var mysql = require('mysql')
	, db = require("../common/db.js")
	, os = require("os")
	, path = require("path")
	, Q = require("q")
	, util = require("util")
	, _ = require("lodash");

module.exports = {
	sql_query: function (options) {
		pool.getConnection(function (error, connection) {
			if(error) {
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
	get_agendaitems: function (user_id, data) {
		var defer = Q.defer();

		var user = data.user || null;
		var resolved = data.resolved || null;

		var user_where = "AND up.user_id = ? ";
		var resolved_where = "AND ap.resolved = 0 ";

		if(user == 1) user_where = "";
		if(resolved == 1) resolved_where = "AND ai.item_id NOT IN(SELECT item_id FROM actionpoints WHERE resolved = 0) ";
		if(resolved == 2) resolved_where = "";

		var options = {
			"sql": "SELECT ai.* FROM agendaitems AS ai " +
			"LEFT JOIN actionpoints AS ap " +
			"ON ai.item_id = ap.item_id " +
			"LEFT JOIN users_points AS up " +
			"ON up.point_id = ap.point_id " +
			"WHERE 1=1 " +
			user_where +
			resolved_where +
			"AND `ai`.`default` = 0 " +
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
	get_meeting: function (meeting_id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT * FROM meetings" +
			" WHERE meeting_id = ?",
			"values": [meeting_id]
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
	get_meeting_agendaitems: function (meeting_id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT * FROM agendaitems" +
			" WHERE meeting_id = ?" +
			" ORDER BY position ASC",
			"values": [meeting_id]
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
	get_active_standard_agendaitems: function () {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT * FROM agendaitems WHERE `default` = 1 AND `active` = 1 ORDER BY `position` ASC"
		};

		pool.getConnection(function (error, connection) {
			connection.query(options, function (error, results) {
				if (error) {
					defer.reject(error);
				} else {
					console.log(results);
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
	save_agendapoint: function (data, item_id, meeting_id, active, time) {
		var defer = Q.defer();
		var agendapoints = data || [];
		var item_id = item_id || false;
		var meeting_id = meeting_id || null;
		var active = active || null;
		var time = time || null;



		var parameters = [];
		_.forEach([1, 2], function () {
			if(item_id === true){
				parameters.push(null);
			} else {
				parameters.push(item_id || agendapoints.item_id || null);
			}
			parameters.push(agendapoints.attachment_id_ || null);
			parameters.push(meeting_id || agendapoints.meeting_id || null);
			parameters.push(active || agendapoints.active || null);
			parameters.push(0);
			parameters.push(agendapoints.description || null);
			parameters.push(agendapoints.position || null);
			parameters.push(time || agendapoints.time || null);
			parameters.push(agendapoints.title || null);
		});

		var options = {
			"sql": "INSERT INTO `agendaitems` (item_id, attachment_id, meeting_id, active, `default`, description, position, time, title)" +
			" VALUES (?,?,?,?,?,?,?,?,?)" +
			" ON DUPLICATE KEY" +
			" UPDATE item_id=?, attachment_id=COALESCE(?, attachment_id), meeting_id=COALESCE(?, meeting_id)," +
			" active=COALESCE(?, active), `default`=COALESCE(?, `default`), description=COALESCE(?, description)," +
			" position=COALESCE(?, position), `time`=COALESCE(?, `time`), title=COALESCE(?, title)",
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
	get_agendapoints_by_meeting_id: function (id) {
		var defer = Q.defer();

		var options = {
			"sql": "SELECT ai.* FROM meetings AS m" +
			" INNER JOIN agendaitems AS ai" +
			" ON m.meeting_id = ai.meeting_id" +
			" WHERE m.meeting_id = ?",
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
	resolve_actionpoint: function (data) {
		var defer = Q.defer();

		var parameters = [];
		parameters.push(data.resolved || 0);
		parameters.push(data.id || null);

		var options = {
			"sql": "UPDATE `actionpoints` SET `resolved` = ? WHERE `point_id` = ?",
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