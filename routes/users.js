var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var Q = require("q");
var util = require("util");
var _ = require("lodash");

/* GET users listing. */
module.exports = function (app, passport) {
	app.route("/users/dashboard")
		.get(is_logged_in, function (request, response) {
			response.render("users/dashboard");
		});
	app.route("/users/agendaitems")
		.get(is_logged_in, function (request, response) {
			response.render("users/agendaitems");
		});
	app.route("/users/get_agendaitems")
		.post(is_logged_in, function (request, response) {
			functions.get_agendaitems(_.first(request.user).user_id)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/users/get_actionpoints")
		.post(is_logged_in, function (request, response) {
			functions.get_actionpoints(request.body.id, _.first(request.user).user_id)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/users/settings")
		.get(is_logged_in, function (request, response) {
			response.render("users/settings");
		});
};
