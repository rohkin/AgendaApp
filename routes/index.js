var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var util = require("util");
var _ = require("lodash");
module.exports = function (app, passport) {
	app.route("/")
		.get(is_logged_in, function (request, response) {
			response.render("index");
		});
	app.route('/sign-in')
		.get(function (request, response) {
			response.render("sign-in", {
				"message": request.flash("error"),
				"version": require(path.join("..", "package.json")).version
			});
		})
		.post(passport.authenticate("local-user-signin", {
			"failureRedirect": "/sign-in",
			"failureFlash": true
		}), function (request, response) {
			response.redirect("/");
		});
	app.route("/sign-out")
		.get(function (request, response) {
			request.session.destroy();
			request.logout();
			response.redirect('/sign-in');
		});
	app.route("/dashboard")
		.get(function (request, response) {
			response.render("dashboard");
		});
}

