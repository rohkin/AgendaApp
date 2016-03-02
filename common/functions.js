var
	connection_pool = require('tedious-connection-pool')
	, db = require("../common/db.js")
	, os = require("os")
	, path = require("path")
	, Q = require("q")
	, Request = require("tedious").Request
	, types = require("tedious").TYPES
	, util = require("util")
	, _ = require("lodash");
module.exports = {
	add_log : function (gebruikersnaam, omschrijving, type) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "naam",
			"type" : types.VarChar,
			"value" : gebruikersnaam
		});
		parameters.push({
			"name" : "type",
			"type" : types.VarChar,
			"value" : type
		});
		parameters.push({
			"name" : "omschrijving",
			"type" : types.VarChar,
			"value" : omschrijving
		});
		functions.execute_storedprocedure("[dbo].[ps_addlog]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	delete_client : function (id) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : id
		});
		functions.execute_storedprocedure("[dbo].[ps_deleteclient]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.resolve(response);
			});
		return defer.promise;
	},
	delete_user : function (id) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : id
		});
		functions.execute_storedprocedure("[dbo].[ps_deleteuser]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.resolve(response);
			});
		return defer.promise;
	},
	delete_attachment : function(id, filename){
		var defer = Q.defer();
		var azure = require('azure-storage');
		var functions = require("../common/functions.js");
		var retryOperations = new azure.ExponentialRetryPolicyFilter();
		var blobSvc = azure.createBlobService(process.env.AZURE_STORAGE_APPLICATION, process.env.AZURE_STORAGE_KEY).withFilter(retryOperations);
		blobSvc.deleteBlob(process.env.AZURE_STORAGE_CONTAINER, filename, function(err, response){
			process.nextTick(function(){
				functions.execute_sql("DELETE FROM dbo.ZspAttachment WHERE Id = @Id", [{
					"name" : "id",
					"type" : types.Int,
					"value" : id
				}]).done();
			});
			defer.resolve(err || response);
		});
		return defer.promise;
	},
	download_attachment : function (filename) {
		var deferred = Q.defer();
		var azure = require('azure-storage');
		var functions = require("../common/functions.js");
		var retryOperations = new azure.ExponentialRetryPolicyFilter();
		var blobSvc = azure.createBlobService(process.env.AZURE_STORAGE_APPLICATION, process.env.AZURE_STORAGE_KEY).withFilter(retryOperations);
		var randomFileName = path.join(os.tmpdir(), functions.get_random_bytes());
		blobSvc.getBlobToLocalFile(process.env.AZURE_STORAGE_CONTAINER
			, filename
			, randomFileName
			, function (err, blockBlob) {
				if (err) {
					deferred.reject(err);
					return;
				}
				deferred.resolve({fileName : randomFileName, blockBlob : blockBlob});
			});
		return deferred.promise;
	},
	execute_sql : function (query, parameters) {
		var defer = Q.defer();
		var pool_config = {max : 10, min : 0, idleTimeoutMillis : 30000};
		var pool = new connection_pool(pool_config, db);
		pool.acquire(function (err, connection) {
			if (err) {
				defer.reject(err);
			}
			var rows = [];
			var request = new Request(query, function (error) {
				connection.release();
				if (error) {
					defer.reject(Error);
					return;
				}
				defer.resolve(rows);
			});
			(parameters || []).forEach(function (param) {
				request.addParameter(param.name, param.type, param.value);
			});
			request.on("row", function (columns) {
				var obj = {};
				columns.forEach(function (column) {
					obj[column.metadata.colName] = column.value;
				});
				rows.push(obj);
			});
			connection.execSql(request);
		});
		return defer.promise;
	},
	execute_storedprocedure : function (query, parameters, include_output_parameters) {
		var defer = Q.defer();
		var output_parameters = [];
		var pool_config = {max : 10, min : 0, idleTimeoutMillis : 30000};
		var pool = new connection_pool(pool_config, db);
		pool.acquire(function (err, connection) {
			if (err) {
				defer.reject(err);
				return;
			}
			var rows = [];
			var request = new Request(query, function (error) {
				connection.release();
				if (error) {
					defer.reject(error);
					return;
				}
				if (include_output_parameters === true) {
					defer.resolve({"results" : rows, "output_parameters" : output_parameters});
				}
				else {
					defer.resolve(rows);
				}
			});
			(parameters || []).forEach(function (param) {
				if (param._output === true) {
					request.addOutputParameter(param.name, param.type, param.value);
				} else {
					request.addParameter(param.name, param.type, param.value);
				}
			});
			request.on('returnValue', function (parameterName, value, metadata) {
				output_parameters.push({
					"name" : parameterName,
					"value" : value
				});
			});
			request.on('row', function (columns) {
				var obj = {};
				columns.forEach(function (column) {
					obj[column.metadata.colName] = column.value;
				});
				rows.push(obj);
			});
			connection.callProcedure(request);
		});
		return defer.promise;
	},
	get_attachments : function (id) {
		var functions = require("../common/functions.js");
		return functions.execute_sql("select Id, BestandsNaam, Soort, UniqueFileName from dbo.ZspAttachment where clientid=@Id order by id desc", [{
			"name" : "id",
			"type" : types.Int,
			"value" : id
		}]);
	},
	get_clients : function (filter) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "actueel",
			"type" : types.Bit,
			"value" : parseInt(filter.actueel, 10) || 0
		});
		parameters.push({
			"name" : "aanhef",
			"type" : types.VarChar,
			"value" : filter.aanhef || ""
		});
		parameters.push({
			"name" : "aanmelddatum_tot",
			"type" : types.VarChar,
			"value" : filter.aanmelddatum_tot || ""
		});
		parameters.push({
			"name" : "aanmelddatum_van",
			"type" : types.VarChar,
			"value" : filter.aanmelddatum_van || ""
		});
		parameters.push({
			"name" : "geboortedatum",
			"type" : types.VarChar,
			"value" : filter.geboortedatum || ""
		});
		parameters.push({
			"name" : "limit",
			"type" : types.Int,
			"value" : filter.limit || 10
		});
		parameters.push({
			"name" : "naam",
			"type" : types.VarChar,
			"value" : filter.naam || ""
		});
		parameters.push({
			"name" : "postcode",
			"type" : types.VarChar,
			"value" : filter.postcode || ""
		});
		parameters.push({
			"name" : "produkt",
			"type" : types.VarChar,
			"value" : filter.produkt || ""
		});
		parameters.push({
			"name" : "plaats",
			"type" : types.VarChar,
			"value" : filter.plaats || ""
		});
		parameters.push({
			"name" : "sort",
			"type" : types.VarChar,
			"value" : filter.sort || ""
		});
		parameters.push({
			"name" : "start",
			"type" : types.Int,
			"value" : filter.start || 0
		});
		parameters.push({
			"name" : "straat",
			"type" : types.VarChar,
			"value" : filter.straat || ""
		});
		parameters.push({
			"name" : "wachtend",
			"type" : types.VarChar,
			"value" : filter.wachtend || ""
		});

		functions.execute_storedprocedure("[dbo].[ps_getclients]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	get_client : function (id) {
		var defer = Q.defer();
		var types = require("tedious").TYPES;
		var functions = require("../common/functions.js");
		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : id || 0
		});
		functions.execute_storedprocedure("[dbo].[ps_getclient]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	get_client_authentication : function (username, password) {
		var defer = Q.defer();
		var functions = require("../common/functions.js");
		/*functions.get_login_information(username, password)
			.then(function (user) {
				if (user) {
					defer.resolve({"id":"1", "type":"admin"});
				} else {
					defer.reject();
				}
			});*/
		defer.resolve({"user_id":"1","name":"Jamey van Heel"});
		return defer.promise;
	},
	get_logs : function (filter) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "Naam",
			"type" : types.VarChar,
			"value" : filter.gebruiker
		});
		parameters.push({
			"name" : "Datum",
			"type" : types.VarChar,
			"value" : filter.datum || ""
		});
		parameters.push({
			"name" : "start",
			"type" : types.Int,
			"value" : parseInt(filter.start, 10) || 1
		});
		parameters.push({
			"name" : "limit",
			"type" : types.Int,
			"value" : parseInt(filter.limit, 10) || 10
		});
		functions.execute_storedprocedure("[dbo].[ps_getlog]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	get_login_information : function (username, password) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "naam",
			"type" : types.VarChar,
			"value" : username
		});
		parameters.push({
			"name" : "wachtwoord",
			"type" : types.VarChar,
			"value" : password
		});
		functions.execute_storedprocedure("[dbo].[ps_getuser]", parameters)
			.then(function (response) {
				defer.resolve(_.first(response) || null);
			})
			.fail(function (response) {
				defer.resolve(null);
			});
		return defer.promise;
	},
	get_personal_information : function (id) {
		var defer = Q.defer();
		var types = require("tedious").TYPES;
		var functions = require("../common/functions.js");
		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : id || 0
		});
		functions.execute_storedprocedure("[dbo].[ps_getclientinfo]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	get_random_bytes : function (bytes) {
		return require("crypto").randomBytes(bytes || 20).toString('hex');
	},
	get_tabel : function (query) {
		var functions = require("../common/functions.js");
		return functions.execute_sql(query, []);
	},
	get_users : function () {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		functions.execute_storedprocedure("[dbo].[ps_getusers]", [])
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.resolve(null);
			});
		return defer.promise;
	},
	insert_attachment: function(id, type, filename, uniquefilename){
		var functions = require("../common/functions.js");
		var defer = Q.defer();
		var types = require("tedious").TYPES;
		var parameters = [];
		parameters.push({
			"name" : "Id",
			"type" : types.Int,
			"value" : id
		});
		parameters.push({
			"name" : "BestandsNaam",
			"type" : types.VarChar,
			"value" : filename
		});
		parameters.push({
			"name" : "UniqueFileName",
			"type" : types.VarChar,
			"value" : uniquefilename
		});
		parameters.push({
			"name" : "Soort",
			"type" : types.VarChar,
			"value" : type
		});
		functions.execute_sql("INSERT INTO dbo.ZspAttachment (ClientId, Soort, BestandsNaam, UniqueFileName) VALUES (@Id, @Soort, @BestandsNaam, @UniqueFileName)", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (response) {
				defer.reject(response);
			});
		return defer.promise;
	},
	update_client : function (client) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"_output" : true,
			"name" : "id",
			"type" : types.Int,
			"value" : parseInt(client.id, 10) || 0
		});
		_.each([
			"aanmelddatum"
			, "burgelijkestaat"
			, "complex"
			, "email"
			, "geboortedatum"
			, "huisnummer"
			, "huisnummertoevoeging"
			, "mobiel"
			, "naam"
			, "opmerking"
			, "plaats"
			, "postcode"
			, "produkt"
			, "provincie"
			, "straat"
			, "telefoon"
			, "titel"
			, "tussenvoegsel"
			, "voorletters"
			, "wachtend"
			, "voorkeur"
		], function (item) {
			parameters.push({
				"name" : item,
				"type" : types.VarChar,
				"value" : client[item] || ""
			});
		});
		_.each(["actueel", "zorgtoewijzing"], function (item) {
			parameters.push({
				"name" : item,
				"type" : types.Bit,
				"value" : parseInt(client[item] || "", 10) || 0
			});
		});
		functions.execute_storedprocedure("[dbo].[ps_updateclient]", parameters, true)
			.then(function (response) {
				defer.resolve(_.find(response.output_parameters, "name", "id").value);
			})
			.fail(function (error) {
				defer.reject(error);
			});
		return defer.promise;
	},
	update_clientinfo : function (client) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var defer = Q.defer();

		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : parseInt(client.id, 10) || 0
		});
		_.each([
			"burgerservicenummer"
			, "bankgironummer"
			, "legitimatietype"
			, "legitimatiegeldigtot"
			, "legitimatienummer"
			, "zzp"
			, "ziektekostenverzekeraar"
			, "polisnummer"
			, "huisarts"
			, "huisartstelefoon"
			, "huisartsgeindiceerd"
			, "apotheek"
			, "apotheektelefoon"
			, "sleutelcode"
			, "sleutellocatie"
			, "bopz"
			, "zorgopvolgingalarmering"
			, "persoonlijkethuiszorg"
			, "huishoudelijkehulp"
			, "ddbegin"
			, "ddeind"
		], function (item) {
			parameters.push({
				"name" : item,
				"type" : types.VarChar,
				"value" : client[item] || ""
			});
		});

		functions.execute_storedprocedure("[dbo].[ps_updateclientinfo]", parameters)
			.then(function (response) {
				defer.resolve(response);
			})
			.fail(function (error) {
				defer.reject(error);
			});
		return defer.promise;
	},
	update_user : function (user) {
		var functions = require("../common/functions.js");
		var types = require("tedious").TYPES;
		var _ = require("lodash");
		var defer = Q.defer();
		var parameters = [];
		parameters.push({
			"name" : "id",
			"type" : types.Int,
			"value" : parseInt(user.id, 10) || 0
		});
		parameters.push({
			"name" : "naam",
			"type" : types.VarChar,
			"value" : user.naam
		});
		parameters.push({
			"name" : "wachtwoord",
			"type" : types.VarChar,
			"value" : user.wachtwoord
		});
		parameters.push({
			"name" : "email",
			"type" : types.VarChar,
			"value" : user.email
		});
		parameters.push({
			"name" : "type",
			"type" : types.Int,
			"value" : user.user_type || 0
		});
		functions.execute_storedprocedure("[dbo].[ps_updateuser]", parameters)
			.then(function () {
				defer.resolve();
			})
			.fail(function (response) {
				defer.reject(response.error);
			});
		return defer.promise;
	},
	uploadFileToAzure : function (file) {
		var deferred = Q.defer();
		var azure = require('azure-storage');
		var retryOperations = new azure.ExponentialRetryPolicyFilter();
		var blobSvc = azure.createBlobService(process.env.AZURE_STORAGE_APPLICATION, process.env.AZURE_STORAGE_KEY).withFilter(retryOperations);
		blobSvc.createBlockBlobFromLocalFile(
			process.env.AZURE_STORAGE_CONTAINER
			, path.basename(file)
			, file,
			function (error, result) {
				if (!error) {
					deferred.resolve(result);
				} else {
					deferred.reject(error);
				}
			});
		return deferred.promise;
	}
};