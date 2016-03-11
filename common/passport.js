var functions = require("../common/functions");
// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});
	// LOCAL LOGIN
	passport.use("local-user-signin", new LocalStrategy(
		{
			usernameField:     "username",
			passwordField:     "password",
			passReqToCallback: true
		},
		function (request, username, password, done) {
			functions.get_client_authentication(request.body.username, request.body.password)
				.then(function (user) {
					if (user.length > 0) {
						done(null, user);
					} else {
						done(null, null, {"message": "Unauthorized access."});
					}
				}).fail(function (user) {
					done(null, null, {"message": "Unauthorized access."});
				});
		}
	));
};
// route middleware to make sure a user is logged in
global.is_logged_in = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/sign-in");
}
