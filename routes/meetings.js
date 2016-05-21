var functions = require("../common/functions.js");
var multiparty = require('multiparty');
var path = require("path");
var util = require("util");
var _ = require("lodash");
module.exports = function (app, passport) {
        app.route("/meetings/:id(\\d+)")
                .get(is_logged_in, function (request, response) {
                        functions.get_meeting(request.params.id)
                                .then(function (result) {
                                        var data = result || [];
                                        response.render("meetings/index", {"id": request.params.id, "meeting": _.first(data)});
                                })
                                .fail(function (error) {
                                        response.status(500).send(error).end();
                                });
                });
        app.route("/meetings/create_meeting")
                .post(is_logged_in, function (request, response) {
                        functions.get_active_standard_agendaitems(request.body.id)
                                .then(function (result) {
                                        _.forEach(result, function (row) {
                                                functions.save_agendapoint(row, true, request.body.id, '1')
                                                        .then(function (result) {
                                                                response.json(result);
                                                        })
                                                        .fail(function (error) {
                                                                response.status(500).send(error).end();
                                                        });
                                        });
                                })
                                .fail(function (error) {
                                        response.status(500).send(error).end();
                                });
                });
        app.route("/meetings/get_meetings")
                .post(is_logged_in, function (request, response) {
                        functions.get_meeting_agendaitems(request.body.id)
                                .then(function (result) {
                                        response.json(result);
                                })
                                .fail(function (error) {
                                        response.status(500).send(error).end();
                                });
                });
}

