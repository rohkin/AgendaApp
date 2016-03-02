(function () {
	var parse_data = function (clients) {
		$("tbody").empty();
		clients = clients|| [];
		var html = $("script#template-client-record").html();

		_.each(clients, function (client, index) {
			var template = html.replace(/\{\{Id\}\}/g, client.Id || "");
			template = template.replace(/\{\{Titel\}\}/g, client.Titel || "");
			template = template.replace(/\{\{Voorletters\}\}/g, client.Voorletters || "");
			template = template.replace(/\{\{Tussenvoegsel\}\}/g, client.Tussenvoegsel || "");
			template = template.replace(/\{\{Naam\}\}/g, client.Naam || "");
			template = template.replace(/\{\{Adres\}\}/g, client.Adres || "");
			template = template.replace(/\{\{Postcode\}\}/g, client.Postcode || "");
			template = template.replace(/\{\{Plaats\}\}/g, client.Plaats || "");
			template = template.replace(/\{\{GeboorteDatum\}\}/g, client.GeboorteDatum);
			template = template.replace(/\{\{Telefoon\}\}/g, client.Telefoon || "");
			template = template.replace(/\{\{Mobiel\}\}/g, (client.Mobiel || "") ? "06-{0}".format(client.Mobiel) : "");
			template = template.replace(/\{\{Product\}\}/g, client.Produkt || "");
			template = template.replace(/\{\{Wachtend\}\}/g, client.Wachtend || "");
			template = template.replace(/\{\{Voorkeur\}\}/g, client.Voorkeur || "");
			template = template.replace(/\{\{aanmelddatum\}\}/g, client.aanmelddatum || "");
			template = template.replace(/\{\{Opmerking\}\}/g, client.Opmerking || "");

			$("table tbody").append(template);

			var tr = $("table tbody tr[data-type='tr-client']:last");
			if(client.Actueel === false ) {
				tr.addClass("danger");
			}

		});
		set_datetime_formats();
		if(clients.length) {
			set_pagination(_.last(clients));
		}
		$("[data-toggle='tooltip']").tooltip();
		$("button[data-button-search]").removeAttr("disabled").find("i").removeClass().addClass("fa fa-search");
		$("td[data-type='phone']").each(function(){
			if ($(this).text().length === 24) {
				$(this).empty()
			}
		});
	};

	var search = function () {
		var params = $("form").serializeObject();
		params.start = $("button[data-button-search]").attr("data-start");
		params.limit = $("button[data-button-search]").attr("data-limit");

		if (params.geboortedatum) {
			params.geboortedatum = moment(params.geboortedatum, global.DateTimeFormat.L, true);
			if (!params.geboortedatum.isValid()) {
				$("input[name=geboortedatum]").val("").focus();
				return;
			}
			params.geboortedatum = params.geboortedatum.format("YYYY-MM-DD");
		}
		if (params.aanmelddatum_tot) {
			params.aanmelddatum_tot = moment(params.aanmelddatum_tot, global.DateTimeFormat.L, true);
			if (!params.aanmelddatum_tot.isValid()) {
				$("input[name=aanmelddatum_tot]").val("").focus();
				return;
			}
			params.aanmelddatum_tot = params.aanmelddatum_tot.format("YYYY-MM-DD");
		}
		if (params.aanmelddatum_van) {
			params.aanmelddatum_van = moment(params.aanmelddatum_van, global.DateTimeFormat.L, true);
			if (!params.aanmelddatum_van.isValid()) {
				$("input[name=aanmelddatum_van]").val("").focus();
				return;
			}
			params.aanmelddatum_van = params.aanmelddatum_van.format("YYYY-MM-DD");
		}
		params.aanhef = _.isArray(params.aanhef) ? "": params.aanhef;
		$.post("/", $.param(params), parse_data);
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

		$("#pages").text("Pagina {0} van {1} - {2} record(s) gevonden.".format(page, max_pages, log.Aantal));
	};
	$(document).ready(function () {
		$("[data-type=date]").each(function () {
			$(this).attr("placeholder", global.DateTimeFormat.L.toLowerCase()).blur(blur_datum);
		});

		$("button[data-button-search]").click(function () {
			var limit = $("select[name=limit]").val();
			$("button[data-button-search]").attr("data-start", 1);
			$("button[data-button-search]").attr("data-limit", limit);

			$(this).prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");

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
	});
})();