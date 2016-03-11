var
	mysql = require('mysql')
	, db = require("../common/db.js")
	, os = require("os")
	, path = require("path")
	, Q = require("q")
	, util = require("util")
	, _ = require("lodash");
module.exports = {
	get_client_authentication : function (username, password) {
		var _ = require("lodash");
		var defer = Q.defer();

		var parameters = [];
		parameters.push(username);
		parameters.push(password);

		var options = {
			"sql": 'SELECT * FROM users WHERE username = ? AND password = ?',
			"values": parameters
		};

		connection.query(options, function(error, results) {
			if (error) {
				defer.reject(error);
			} else {
				defer.resolve(results);
			}
		});

		return defer.promise;
	},
};