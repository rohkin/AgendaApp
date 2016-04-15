var express = require('express');
var router = express.Router();

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
	app.route("/users/settings")
		.get(is_logged_in, function (request, response) {
			response.render("users/settings");
		});

};
