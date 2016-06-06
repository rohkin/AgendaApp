(function () {
	var resolve_actionpoint = function () {
		var resolve = 1 - $(this).data("resolved");
		var actionpoint_id = $(this).data("id");
		var self = $(this)

		$.post("/users/resolve_actionpoint", {"id": actionpoint_id, "resolved": resolve}, function () {
			self.data("resolved", resolve);
			set_actionpoint_resolve(self.parent().parent());
		});
	};

	var set_actionpoint_resolve = function (actionpoint) {
		var resolved = actionpoint.find("button[data-resolved]").data("resolved");

		actionpoint.removeClass("list-group-item-success").addClass("list-group-item-danger");
		actionpoint.find("i").removeClass("fa-check-circle").addClass("fa-times-circle");
		if(resolved == 1) {
			actionpoint.removeClass("list-group-item-danger").addClass("list-group-item-success");
			actionpoint.find("i").removeClass("fa-times-circle").addClass("fa-check-circle");
		}
	};

	var template_agendaitems = function (data) {
		var agendaitems = data || [];
		var html = $("script#agendaitem_template").html();
		$("#test").html("");

		_.each(agendaitems, function (item, index) {
			var template = html.replace(/\{\{AgendaTitle\}\}/g, item.title);
			template = template.replace(/\{\{AgendaDescription\}\}/g, item.description);
			template = template.replace(/\{\{AgendaId\}\}/g, item.item_id);
			$("#test").append(template);

			$.post("/users/get_actionpoints", {"id": item.item_id}, template_actionpoints);
		});
	};

	var template_actionpoints = function (data) {
		var actionpoints = data || [];
		var html = $("script#actionpoint_template").html();

		_.each(actionpoints, function (point, index) {
			var template = html.replace(/\{\{ActionTitle\}\}/g, point.title);
			template = template.replace(/\{\{ActionDescription\}\}/g, point.description);
			template = template.replace(/\{\{ActionResolved\}\}/g, point.resolved);
			template = template.replace(/\{\{ActionId\}\}/g, point.point_id);
			$("ul[data-id={0}]".format(point.item_id)).append(template);
		});

		$("ul[data-id] > .actionpoint").each(function () {
			set_actionpoint_resolve($(this));
		});
	};

	$(document).ready(function () {
		$.post("/users/get_agendaitems", {"resolved":$("select[name=resolved]").val(), "user":$("select[name=user]").val()}, template_agendaitems);
		$("#test").on("click", "button[data-resolved]", resolve_actionpoint);

		$("select").change(function () {
			$.post("/users/get_agendaitems", {"resolved":$("select[name=resolved]").val(), "user":$("select[name=user]").val()}, template_agendaitems);
		});
	});
})();