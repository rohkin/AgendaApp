var mysql = require('mysql')
	, db = require("../common/db.js")
	, os = require("os")
	, path = require("path")
	, Q = require("q")
	, util = require("util")
	, _ = require("lodash");

module.exports = {
	get_client_authentication: function (username, password) {
		var defer = Q.defer();

		var parameters = [];
		parameters.push(username);
		parameters.push(password);

		var options = {
			"sql": 'SELECT * FROM users WHERE username = ? AND password = ?',
			"values": parameters
		};
		pool.getConnection(function (error, connection) {
			connection.query(options, function (error, results) {
				if (error) {
					defer.reject(error);
				} else {
					defer.resolve(results);
				}
			});
			connection.release();
		});

		return defer.promise;
	},
	get_standard_agendapoints: function () {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT * FROM agendaitems WHERE `default` = 1 ORDER BY `position` ASC"
		};

		pool.getConnection(function (error, connection) {
			if(error) {
				console.log(error);
				defer.reject(error);
				return defer.promise;

			}
			connection.query(options, function (error, results) {
				if (error) {
					defer.reject(error);
				} else {
					defer.resolve(results);
				}
			});
			connection.release();
		});

		return defer.promise;
	},
	remove_agendapoint: function (id) {
		var defer = Q.defer();

		var options = {
			"sql": "DELETE FROM `agendaitems` WHERE `item_id` = ?",
			"values": [id]
		};

		pool.getConnection(function (error, connection) {
			connection.query(options, function (error, results) {
				if (error) {
					defer.reject(error);
				} else {
					defer.resolve(results);
				}
				connection.release();
			});
		});


		return defer.promise;
	},
	save_standard_agendapoints: function (data) {
		var defer = Q.defer();

		var resolve = null;

		_.forEach(data, function (value, key) {
			var parameters = [];
			parameters.push(data[key].id || null);
			parameters.push(data[key].position || 9999);
			parameters.push(data[key].title || "");
			parameters.push(data[key].description || "");
			parameters.push(data[key].active || "0");
			parameters.push({
				"position": data[key].position,
				"title": data[key].title,
				"description": data[key].description,
				"active": data[key].active
			});

			var options = {
				"sql": "INSERT INTO `agendaitems` (`item_id`,`position`,`title`,`description`,`active`,`default`) " +
				" VALUES (?,?,?,?,?,1)" +
				" ON DUPLICATE KEY" +
				" UPDATE ?",
				"values": parameters
			};
			pool.getConnection(function (error, connection) {
				connection.query(options, function (error, results) {
					if (error) {
						defer.reject(error);
						return defer.promise;
					} else {
						if (key === "") {
							defer.resolve(results);
						}
						resolve = results;
					}
				});
				connection.release();
			});
		});

		if (!defer.promise) {
			defer.resolve(resolve);
		}

		return defer.promise;
	}
};