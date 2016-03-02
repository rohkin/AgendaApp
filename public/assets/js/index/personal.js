(function () {
	var append_options = function (data_obj, name, value) {
		var combo = $("select[name={0}]".format(name));
		_.each(data_obj, function (obj) {
			combo.append("<option value=\"{0}\">{0}</option>".format(obj[value || "Titel"].replace("'", "\'")));
		});
	};

	var load_data = function (data) {
		var personal = data.personal || {};
		var legitimatie = data.legitimatie || {};
		var ziektekostenverzekeraar = data.ziektekostenverzekeraar || {};
		var zzp = data.zzp || {};
		var huisartsgeindiceerd = [{"Titel" : ""}, {"Titel" : "Ja"}, {"Titel" : "Nee"}, {"Titel" : "N.v.t."}];
		var bopz = data.bopz || {};
		append_options(legitimatie, "legitimatietype");
		append_options(ziektekostenverzekeraar, "ziektekostenverzekeraar");
		append_options(zzp, "zzp");
		append_options(huisartsgeindiceerd, "huisartsgeindiceerd");
		append_options(bopz, "bopz");

		_.each(personal, function (value, index) {
			$("input[name='{0}'], textarea[name='{0}']".format(index.toLowerCase())).val(value);
		});
		_.each(["ddBegin", "ddEind", "LegitimatieGeldigTot"], function (item) {
			if (personal[item]) {
				$("[name='{0}']".format(item.toLowerCase()))
					.val(moment.unix((parseInt(personal[item], 10) || 0) / 1000).format(global.DateTimeFormat.L));
			}
		});
		_.each(["LegitimatieType", "ZiektekostenVerzekeraar", "Zzp", "HuisartsGeindiceerd", "Bopz"], function (item) {
			$("select[name=\"{0}\"] option[value=\"{1}\"]".format(item.toLowerCase(), (personal[item] || "").replace("'", "\'"))).prop("selected", "selected");
		});
	};
	var submit_data = function (e) {
		var params = $(this).serializeObject();

		if (params.legitimatiegeldigtot) {
			params.legitimatiegeldigtot = moment(params.legitimatiegeldigtot, global.DateTimeFormat.L, true);
			if (!params.legitimatiegeldigtot.isValid()) {
				e.preventDefault();
				$("input[name=legitimatiegeldigtot]").val("").focus();
				return;
			}
			$("input[name=legitimatiegeldigtot]").val(params.legitimatiegeldigtot.format("YYYY-MM-DD"));
		}
		if (params.ddbegin) {
			params.ddbegin = moment(params.ddbegin, global.DateTimeFormat.L, true);
			if (!params.ddbegin.isValid()) {
				e.preventDefault();
				$("input[name=ddbegin]").val("").focus();
				return;
			}
			$("input[name=ddbegin]").val(params.ddbegin.format("YYYY-MM-DD"));
		}
		if (params.ddeind) {
			params.ddeind = moment(params.ddeind, global.DateTimeFormat.L, true);
			if (!params.ddeind.isValid()) {
				e.preventDefault();
				$("input[name=ddeind]").val("").focus();
				return;
			}
			$("input[name=ddeind]").val(params.ddeind.format("YYYY-MM-DD"));
		}
		$("#save_personal").prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");
	};
	$(document).ready(function () {
		var id = parseInt(window.location.pathname.split("/").pop(), 10) || 0;

		$("[data-type=date]").each(function () {
			$(this).attr("placeholder", global.DateTimeFormat.L.toLowerCase()).blur(blur_datum);
		});
		$.get("/clientinfo/{0}".format(id), load_data);

		$("#save_personal").click(function () {
			$("form").submit();
		});

		$("form").submit(submit_data);
	});
})();