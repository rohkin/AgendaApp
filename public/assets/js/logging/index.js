(function () {
	var parse_data = function (logs) {
		$("tbody").empty();
		logs = logs || [];
		var html = $("script#template-log-record").html();

		_.each(logs, function (log, index) {
			var template = html.replace(/\{\{Id\}\}/g, log.Id);
			template = template.replace(/\{\{Datum\}\}/g, log.Datum*1000);
			template = template.replace(/\{\{Actie\}\}/g, log.Type);
			template = template.replace(/\{\{Gebruiker\}\}/g, log.Naam);
			template = template.replace(/\{\{Omschrijving\}\}/g, log.Omschrijving);
			$("table tbody").append(template);
			var tr = $("table tbody tr:last");
			tr.find("button[data-record]").data(log);
		});
		set_datetime_formats();
		if(logs.length) {
			set_pagination(_.last(logs));
		}
		//$("button[data-record]").click(load_user);
	};
	var parse_user_data = function (users) {
		$("select[name=gebruiker]").empty();
		users = users || [];
		var html = $("script#template-user-record").html();

		_.each(users, function (user, index) {
			var template = html.replace(/\{\{GebruikerId\}\}/g, user.Id);
			template = template.replace(/\{\{GebruikerNaam\}\}/g, user.Naam);
			$("select[name=gebruiker]").append(template);
		});
	};

	var search = function () {
		var params = $("form").serializeObject();
		params.start = $("button[data-button-search]").attr("data-start");
		params.limit = $("button[data-button-search]").attr("data-limit");
		if (params.datum) {
			params.datum = moment(params.datum, global.DateTimeFormat.L, true);
			if (!params.datum.isValid()) {
				$("input[name=datum]").val("").focus();
				return;
			}
			params.datum = params.datum.format("YYYY-MM-DD");
		}
		$.post("/logging", $.param(params), parse_data);
	};
	var set_pagination = function (log) {
		var page = parseInt($("button[data-start]").attr("data-start"));

		$("button[data-previous]").attr("disabled", false);
		if(page === 1){
			$("button[data-previous]").attr("disabled", true);
		}

		var limit = $("button[data-button-search]").attr("data-limit");
		var max_pages = Math.ceil(log.Aantal / limit);

		$("button[data-next]").attr("disabled", false);
		if(page === max_pages){
			$("button[data-next]").attr("disabled", true);
		}

		$("#pages").text("Pagina {0} van {1} - {2} record(s) gevonden.".format(page,max_pages,log.Aantal));
	};
	$(document).ready(function () {
		$("[data-type=date]").each(function () {
			$(this).attr("placeholder", global.DateTimeFormat.L.toLowerCase()).blur(blur_datum);
		});

		$("button[data-button-search]").click(function () {
			var limit = $("select[name=limit]").val();
			$("button[data-button-search]").attr("data-start", 1);
			$("button[data-button-search]").attr("data-limit", limit);
			search();
		});

		$("button[data-next]").click(function () {
			var start = parseInt($("button[data-button-search]").attr("data-start"));
			$("button[data-button-search]").attr("data-start", start+1);
			search();
		});

		$("button[data-previous]").click(function () {
			var start = parseInt($("button[data-button-search]").attr("data-start"));
			$("button[data-button-search]").attr("data-start", start-1);
			search();
		});

		$.get("/users/json", null, parse_user_data);
	});
})();