(function () {
	var move_point = function () {
		add_button();

		var data = {};
		var position = 0;
		$.each($("#active_agendapoints, #inactive_agendapoints").children(), function () {
			$(this).data("active", 1);
			if ($(this).parent().attr("id") === "inactive_agendapoints") {
				$(this).data("active", 0);
			}

			data[$(this).data("id")] = {
				"id": $(this).data("id")
				, "position": position
				, "title": $(this).clone().children().remove().end().text().replace(/^\s+|\s+$/g, '')
				, "description": $(this).find("div").text()
				, "active": $(this).data("active")
			};

			position++;
		});

		$.post("/settings/agendapoints", {data: JSON.stringify(data)}, add_id_new_agendapoint);
	};

	var add_id_new_agendapoint = function (id) {
		var last_child = $("#inactive_agendapoints").children().last();
		if (last_child.data("id") === "") {
			last_child.data("id", id);
		}
	};

	var add_agendapoint = function (e) {
		e.preventDefault();

		var title = $("input[name=title]").val();
		var description = $("input[name=description]").val();

		var html = $("script#template_agendapoint").html();
		var template = html.replace(/\{\{Id\}\}/g, "");
		template = template.replace(/\{\{Title\}\}/g, title);
		template = template.replace(/\{\{Description\}\}/g, description);
		template = template.replace(/\{\{Time\}\}/g, "");
		template = template.replace(/\{\{Active\}\}/g, 0);

		$("#inactive_agendapoints").append(template)
		$("#inactive_agendapoints").children().last().trigger("sortstop");

		$("input[name=title]").val("");
		$("input[name=description]").val("");
	};

	var add_button = function () {
		$("#add_delete_button").removeClass("btn-danger col-md-12 btn-lg").addClass("btn-primary pull-right")
			.children().first().removeClass("fa-trash").addClass("fa-plus");
	};

	var delete_button = function () {
		$("#add_delete_button").removeClass("btn-primary pull-right").addClass("btn-danger col-md-12 btn-lg")
			.children().first().removeClass("fa-plus").addClass("fa-trash");
	};

	var remove_agendapoint = function (e, ui) {
		var element = $(ui.draggable);
		var id = element.data("id");
		console.log(id);
		element.remove();
		$.post("/settings/removeagendapoint", {"data": id});
	};

	var template_agendapoints = function (data) {
		var agendapoints = data || [];

		var html = $("script#template_agendapoint").html();
		_.each(agendapoints, function (agendapoint, index) {
			var template = html.replace(/\{\{Id\}\}/g, agendapoint.item_id);
			template = template.replace(/\{\{Title\}\}/g, agendapoint.title);
			template = template.replace(/\{\{Description\}\}/g, agendapoint.description);
			template = template.replace(/\{\{Time\}\}/g, agendapoint.time);
			template = template.replace(/\{\{Active\}\}/g, agendapoint.active);

			$("#active_agendapoints").append(template);

			if (agendapoint.active === 0) {
				$("#inactive_agendapoints").append(template);
				$("#active_agendapoints").children().last().remove();
			}
		});
	};

	$(document).ready(function () {
		$("#active_agendapoints, #inactive_agendapoints").sortable({
			connectWith: "ul"
		});
		$("#add_delete_button").droppable({
			"drop": remove_agendapoint
		});
		$("#active_agendapoints, #inactive_agendapoints").disableSelection();
		$(".list-group").on("sortstop", move_point);
		$(".list-group").on("sortstart", delete_button);
		$(".list-group").on("click", ".list-group-item", function () {
			$(this).children().first().collapse("toggle");
		});

		$("#add_agendapoint_form").submit(add_agendapoint);

		$.post("/settings/getagendapoints", template_agendapoints);
	});
})();