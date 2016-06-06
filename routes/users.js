var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var Q = require("q");
var util = require("util");
var _ = require("lodash");

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
			functions.get_agendaitems(_.first(request.user).user_id, request.body)
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
		})
		.post(is_logged_in, function (request, response) {
			functions.save_update_user(request.body)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/users/get_user")
		.post(is_logged_in, function (request, response) {
			functions.get_user(_.first(request.user).user_id)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/users/resolve_actionpoint")
		.post(is_logged_in, function (request, response) {
			functions.resolve_actionpoint(request.body)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				console.log(error)
				response.status(500).send(error).end();
			});
		});
};
