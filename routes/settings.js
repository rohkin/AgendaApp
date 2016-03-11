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
		});
	app.route("/settings/users")
		.get(is_logged_in, function (request, response) {
			response.render("settings/users");
		});

}

