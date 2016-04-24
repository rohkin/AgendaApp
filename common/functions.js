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
	get_agendaitems: function (user_id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT ai.* FROM agendaitems AS ai " +
			"LEFT JOIN actionpoints AS ap " +
			"ON ai.item_id = ap.item_id " +
			"LEFT JOIN users_points AS up " +
			"ON up.point_id = ap.point_id " +
			"WHERE up.user_id = ? " +
			"AND ap.resolved = 0 " +
			"GROUP BY ai.item_id",
			"values": [user_id]
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
	get_actionpoints: function (item_id, user_id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT ap.* FROM agendaitems AS ai " +
			"LEFT JOIN actionpoints AS ap " +
			"ON ai.item_id = ap.item_id " +
			"LEFT JOIN users_points AS up " +
			"ON up.point_id = ap.point_id " +
			"WHERE ai.item_id = ? " +
			"AND up.user_id = ? ",
			"values": [item_id, user_id]
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
	get_standard_agendaitems: function () {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT * FROM agendaitems WHERE `default` = 1 ORDER BY `position` ASC"
		};

		pool.getConnection(function (error, connection) {
			if (error) {
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
	get_user: function (id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT user_id, first_name, middle_name, last_name FROM `users` WHERE `user_id` = ?",
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
	remove_agendaitem: function (id) {
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
	save_standard_agendaitems: function (data) {
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
	},
	save_update_user: function (data) {
		var defer = Q.defer();
		var user = data || [];

		if (user.password2 !== 'undefined') {
			if (user.password !== user.password2) {
				user.password = null;
			}
		}

		var parameters = [];
		_.forEach([1, 2], function () {
			parameters.push(user.user_id || null);
			parameters.push(user.username_ || null);
			parameters.push(user.password || null);
			parameters.push(user.first_name || null);
			parameters.push(user.middle_name || null);
			parameters.push(user.last_name || null);
		});

		var options = {
			"sql": "INSERT INTO `users` (user_id, username, password, first_name, middle_name, last_name)" +
			" VALUES (?,?,?,?,?,?)" +
			" ON DUPLICATE KEY" +
			" UPDATE user_id=?, username=COALESCE(?, username), password=COALESCE(?, password)," +
			" first_name=COALESCE(?, first_name), middle_name=?, last_name=COALESCE(?, last_name)",
			"values": parameters
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
	}
};