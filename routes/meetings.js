var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var util = require("util");
var _ = require("lodash");
module.exports = function (app, passport) {
        app.route("/meetings/:id(\\d+)")
                .get(is_logged_in, function (request, response) {
                        response.render("meetings/index", {"id": request.params.id});
                });
        app.route("/meetings/get_meetings")
                .post(is_logged_in, function (request, response) {
                        functions.get_agendapoints_by_meeting_id(request.body.id)
                                .then(function (result) {
                                        response.json(result);
                                }).fail(function (error) {
                                response.status(500).send(error).end();
                        });
                });
}

