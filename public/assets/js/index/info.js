(function () {
	var load_attachments = function(data){
		var attachments = (data || {}).attachments || [];
		var html  = $("#template-attachment-record").html();
		var tbody = $("table#table-attachments tbody")
		_.each(attachments, function(obj){
			var tmpl = html.replace(/\{\{id\}\}/g, obj["Id"] || 0);
			tmpl = tmpl.replace(/\{\{soort\}\}/g, obj["Soort"] || "");
			tmpl = tmpl.replace(/\{\{clientid\}\}/g, window["clientid"] || "0");
			tmpl = tmpl.replace(/\{\{bestandsnaam\}\}/g, obj["BestandsNaam"] || "");
			tmpl = tmpl.replace(/\{\{file1\}\}/g, encodeURIComponent(obj["BestandsNaam"] || ""));
			tmpl = tmpl.replace(/\{\{file2\}\}/g, encodeURIComponent(obj["UniqueFileName"] || ""));
			tbody.append(tmpl);
		});
		var bijlagesoorten = (data || {}).bijlagesoort || [];
		_.each(bijlagesoorten, function(obj){
			$("form#attachment select[name=soort]").append("<option value=\"{0}\">{0}</option>".format(obj.Titel.replace("'", "\'")));
		})
	};
	var load_client = function (obj) {
		var client = (obj || {})["client"] || {};
		var html_client = $("#template-client-information").html();
		var tmpl = html_client.replace(/\{\{Id\}\}/g, client["Id"]);
		tmpl = tmpl.replace(/\{\{AanmeldDatum\}\}/g, client["aanmelddatum"] || "null");
		tmpl = tmpl.replace(/\{\{Actueel\}\}/g, client["Actueel"] ? "<i class='fa fa-check-square'></i>" : "<i class='fa fa-close text-danger'></i>");
		tmpl = tmpl.replace(/\{\{BurgelijkeStaat\}\}/g, client["BurgelijkeStaat"] || "");
		tmpl = tmpl.replace(/\{\{Complex\}\}/g, client["Complex"] || "");
		tmpl = tmpl.replace(/\{\{GeboorteDatum\}\}/g, client["GeboorteDatum"] || "");
		tmpl = tmpl.replace(/\{\{Huisnummer\}\}/g, client["Huisnummer"] || "");
		tmpl = tmpl.replace(/\{\{HuisnummerToevoeging\}\}/g, (client["HuisnummerToevoeging"] || "") ? "-{0}".format(client["HuisnummerToevoeging"]) : "");
		tmpl = tmpl.replace(/\{\{Mobiel\}\}/g, (client["Mobiel"] || "") ? "06-{0}".format(client["Mobiel"]) : "");
		tmpl = tmpl.replace(/\{\{Naam\}\}/g, client["Naam"] || "");
		tmpl = tmpl.replace(/\{\{Opmerking\}\}/g, client["Opmerking"] || "");
		tmpl = tmpl.replace(/\{\{Plaats\}\}/g, client["Plaats"] || "");
		tmpl = tmpl.replace(/\{\{Postcode\}\}/g, client["Postcode"] || "");
		tmpl = tmpl.replace(/\{\{Produkt\}\}/g, client["Produkt"] || "");
		tmpl = tmpl.replace(/\{\{Provincie\}\}/g, client["Provincie"] || "");
		tmpl = tmpl.replace(/\{\{Straat\}\}/g, client["Straat"] || "");
		tmpl = tmpl.replace(/\{\{Telefoon\}\}/g, client["Telefoon"] || "");
		tmpl = tmpl.replace(/\{\{Titel\}\}/g, client["Titel"] || "");
		tmpl = tmpl.replace(/\{\{Tussenvoegsel\}\}/g, client["Tussenvoegsel"] || "");
		tmpl = tmpl.replace(/\{\{Voorkeur\}\}/g, client["Voorkeur"] || "");
		tmpl = tmpl.replace(/\{\{Voorletters\}\}/g, client["Voorletters"] || "");
		tmpl = tmpl.replace(/\{\{Wachtend\}\}/g, client["Wachtend"] || "");
		tmpl = tmpl.replace(/\{\{ZorgToewijzing\}\}/g, client["ZorgToewijzing"] ? "<i class='fa fa-check-square-o'></i>" : "<i class='fa fa-close text-danger'></i>");
		$("#body-client").prepend(tmpl);
		set_datetime_formats();
	};
	var load_comment = function (obj) {
		var client = (obj || {})["client"] || {};
		var html_client = $("#template-client-comment").html();
		var tmpl = html_client.replace(/\{\{Opmerking\}\}/g, client["Opmerking"] || "");
		$("#body-comment").prepend(tmpl);
		set_datetime_formats();
	};
	var load_data = function (data) {
		$.when().then(function () {
				return _.first(data).then(load_client);
			})
			.then(function () {
				return _.first(data).then(load_comment);
			})
			.then(function () {
				return _.last(data).then(load_personal);
			})
			.then(function () {
				return _.last(data).then(load_attachments);
			})
			.done(function () {
				$("a.btn:not([data-type-download])").click(function(){
					var btn = $(this);
						btn.addClass("disabled")
						.find("i")
						.removeClass()
						.addClass("fa fa-spin fa-spinner");
				});
			});

	};
	var load_personal = function (obj) {
		var personal = (obj || {})["personal"] || {};
		var html_personal = $("#template-personal-information").html();
		var tmpl = html_personal.replace(/\{\{Personal\}\}/g, personal["Id"]);
		tmpl = tmpl.replace(/\{\{Apotheek\}\}/g, personal["Apotheek"] || "");
		tmpl = tmpl.replace(/\{\{ApotheekTelefoon\}\}/g, personal["ApotheekTelefoon"] || "");
		tmpl = tmpl.replace(/\{\{BankGiroNummer\}\}/g, personal["BankGiroNummer"] || "");
		tmpl = tmpl.replace(/\{\{Bopz\}\}/g, personal["Bopz"] || "");
		tmpl = tmpl.replace(/\{\{BurgerServiceNummer\}\}/g, personal["BurgerServiceNummer"] || "");
		tmpl = tmpl.replace(/\{\{ddBegin\}\}/g, personal["ddBegin"] || "");
		tmpl = tmpl.replace(/\{\{ddEind\}\}/g, personal["ddEind"] || "");
		tmpl = tmpl.replace(/\{\{Huisarts\}\}/g, personal["Huisarts"] || "");
		tmpl = tmpl.replace(/\{\{HuisartsGeindiceerd\}\}/g, personal["HuisartsGeindiceerd"] || "");
		tmpl = tmpl.replace(/\{\{HuisartsTelefoon\}\}/g, personal["HuisartsTelefoon"] || "");
		tmpl = tmpl.replace(/\{\{HuishoudelijkeHulp\}\}/g, personal["HuishoudelijkeHulp"] || "");
		tmpl = tmpl.replace(/\{\{LegitimatieGeldigTot\}\}/g, personal["LegitimatieGeldigTot"] || "");
		tmpl = tmpl.replace(/\{\{LegitimatieNummer\}\}/g, personal["LegitimatieNummer"] || "");
		tmpl = tmpl.replace(/\{\{LegitimatieType\}\}/g, personal["LegitimatieType"] || "");
		tmpl = tmpl.replace(/\{\{PersoonlijkeThuiszorg\}\}/g, personal["PersoonlijkeThuiszorg"] || "");
		tmpl = tmpl.replace(/\{\{Polisnummer\}\}/g, personal["Polisnummer"] || "");
		tmpl = tmpl.replace(/\{\{Sleutelcode\}\}/g, personal["Sleutelcode"] || "");
		tmpl = tmpl.replace(/\{\{SleutelLocatie\}\}/g, personal["SleutelLocatie"] || "");
		tmpl = tmpl.replace(/\{\{ZiektekostenVerzekeraar\}\}/g, personal["ZiektekostenVerzekeraar"] || "");
		tmpl = tmpl.replace(/\{\{ZorgopvolgingAlarmering\}\}/g, personal["ZorgopvolgingAlarmering"] || "");
		tmpl = tmpl.replace(/\{\{Zzp\}\}/g, personal["Zzp"] || "");
		$("#body-personal").prepend(tmpl);
		$("#body-personal dt").css({"width" : "180px"});
		$("#body-personal dd").css({"margin-left" : "200px"});
		set_datetime_formats();
	};
	$(document).ready(function () {
		window["clientid"] = parseInt(window.location.pathname.split("/").pop(), 10) || 0;
		if (window["clientid"] === 0) {
			return;
		}
		$.when([$.get("/client/{0}".format(window["clientid"])), $.get("/clientinfo/{0}".format(window["clientid"]))])
			.then(load_data)
		;
	});
})();