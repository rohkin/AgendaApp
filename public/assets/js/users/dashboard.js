(function () {

	var template_agendaitems = function (data) {
		var agendaitems = data || [];
		var html = $("script#agendaitem_template").html();

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
	};

	$(document).ready(function () {
		$.post("/users/get_agendaitems", template_agendaitems);
	});
})();