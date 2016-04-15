// NODE MODULES
var body_parser = require("body-parser");
var flash = require("connect-flash");
var path = require("path");
var passport = require("passport");
var serve_static = require("serve-static");
var favicon = require("serve-favicon");
// ENVIRONMENT
// set production port to 80 if not defined
var port = process.env.PORT || 80;
global.env = process.env.NODE_ENV || "development";
// call express
var express = require("express");

//pass passport for configuration
require("./common/passport.js")(passport);

// define our app using express
var app = express();
var session = require("express-session");
app.locals.title = "AgendaApp";
// favicon
//app.use(favicon(path.join(__dirname, "public", "favicon.png")));

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// development environment
if (env === "development") {
	app.use(serve_static(path.join(__dirname, "public")));
	port = 5000;
	app.locals.pretty = true;
}
var private_key = "11f46fc1153e0dacd6d581d968ce2573c4fe1ecde2a7fcf792d9ac0af8ed2f2d";
// required for passport
// session secret
app.use(session({"key": "AgendaApp", "resave": true, "saveUninitialized": true, "secret": private_key}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// use connect-flash for flash messages stored in session
app.use(flash());
// initialise jade view engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "jade");
app.set("etag", "strong");
app.set("jsonp callback name", "callback");
// ROUTES FOR OUR API
require(path.join(__dirname, "routes", "index.js"))(app, passport);
require(path.join(__dirname, "routes", "settings.js"))(app, passport);
require(path.join(__dirname, "routes", "users.js"))(app, passport);

// Handle 404
app.all('*', function (request, response) {
	// send a NOT AUTHORIZED response status
	response.render("404");
});
// Start the server
app.listen(port);
console.log("listening to port: %s; environment = %s", port, env);
