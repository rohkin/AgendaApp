var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var Q = require("q");
var util = require("util");
var _ = require("lodash");
module.exports = function (app, passport) {
	app.route("/settings/")
		.get(is_logged_in, function (request, response) {
			response.render("settings/index");
		});
	app.route("/settings/agendapoints")
		.get(is_logged_in, function (request, response) {
			response.render("settings/agendapoints");
		})
		.post(is_logged_in, function (request, response) {
			functions.save_standard_agendaitems(JSON.parse(request.body.data))
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/settings/getagendapoints")
		.post(is_logged_in, function (request, response) {
			functions.get_standard_agendaitems()
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/settings/removeagendapoint")
		.post(is_logged_in, function (request, response) {
			functions.remove_agendaitem(request.body.data)
				.then(function (result) {
					response.json(result);
				}).fail(function (error) {
				response.status(500).send(error).end();
			});
		});
	app.route("/settings/users")
		.get(is_logged_in, function (request, response) {
			response.render("settings/users");
		});

}

