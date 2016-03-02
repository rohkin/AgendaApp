(function () {
	var append_options = function (data_obj, name, value) {
		var combo = $("select[name={0}]".format(name));
		_.each(data_obj, function (obj) {
			combo.append("<option value=\"{0}\">{0}</option>".format(obj[value || "Titel"].replace("'", "\'")));
		});
	};
	var load_data = function (data) {
		var provincies = _.map(_.unique(_.pluck(data.plaats || [], "Provincie")).sort(),function (obj) {return {"Titel": obj}});
		var burgelijkestaat = data.burgelijkestaat || {};
		var client = data.client || {};
		var complex = data.complex || {};
		var plaats = data.plaats || {};
		var produkt = data.produkt || {};
		var titel = data.titel || {};
		var tussenvoegsel = data.tussenvoegsel || {};
		var voorkeur = data.voorkeur || {};
		var wachtend = data.wachtend || {};
		append_options(burgelijkestaat, "burgelijkestaat");
		append_options(complex, "complex");
		append_options(provincies, "provincie");
		append_options(produkt, "produkt");
		append_options(titel, "titel");
		append_options(tussenvoegsel, "tussenvoegsel");
		append_options(voorkeur, "voorkeur");
		append_options(wachtend, "wachtend");

		var combo_plaats = $("select[name=plaats]");

		_.each(plaats, function (obj) {
			combo_plaats.append("<option data-provincie=\"{1}\" value=\"{0}\">{0}</option>".format(obj["Titel"].replace("'", "\'"), obj.Provincie));
		});

		combo_plaats.change(select_plaats);

		_.each(client, function (value, index) {
			$("[name='{0}'][type=text], [name='{0}'][type=email], [name='{0}'][type=hidden], textarea[name='{0}']".format(index.toLowerCase())).val(value);
		});
		_.each(["GeboorteDatum", "aanmelddatum"], function (item) {
			if (client[item]) {
				$("[name='{0}']".format(item.toLowerCase()))
					.val(moment.unix((parseInt(client[item], 10) || 0) / 1000)
						.format(global.DateTimeFormat.L));
			}
		});
		_.each(["BurgelijkeStaat", "Complex", "Plaats", "Provincie", "Tussenvoegsel", "Wachtend", "Produkt", "Voorkeur"], function (item) {
			$("select[name=\"{0}\"] option[value=\"{1}\"]".format(item.toLowerCase(), (client[item] || "").replace("'", "\'"))).prop("selected", "selected");
		});
		$("input[name='actueel']").prop("checked", client.Actueel);
		$("input[name='zorgtoewijzing']").prop("checked", client.ZorgToewijzing);
		$("input[name='geboortedatum']").focus();
	};
	var select_plaats = function () {
		var provincie = $(this).find("option:selected").data("provincie");
		$("[name=provincie] [value='{0}']".format(provincie)).prop("selected","selected");
	};
	var submit_data = function (e) {
		var params = $(this).serializeObject();
		if (params.geboortedatum) {
			params.geboortedatum = moment(params.geboortedatum, global.DateTimeFormat.L, true);
			if (!params.geboortedatum.isValid()) {
				e.preventDefault();
				$("input[name=geboortedatum]").val("").focus();
				return;
			}
			$("input[name=geboortedatum]").val(params.geboortedatum.format("YYYY-MM-DD"));
		}
		if (params.aanmelddatum) {
			params.aanmelddatum = moment(params.aanmelddatum, global.DateTimeFormat.L, true);
			if (!params.aanmelddatum.isValid()) {
				e.preventDefault();
				$("input[name=aanmelddatum]").val("").focus();
				return;
			}
			$("input[name=aanmelddatum]").val(params.aanmelddatum	.format("YYYY-MM-DD"));
		}


		$("#save_client").prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");
	};
	$(document).ready(function () {
		var id = parseInt(window.location.pathname.split("/").pop(), 10) || 0;

		$("[data-type=date]").each(function () {
			$(this).attr("placeholder", global.DateTimeFormat.L.toLowerCase())
				.blur(blur_datum);
		});

		$.get("/client/{0}".format(id), load_data);

		$("#save_client").click(function () {
			$("form").submit();
		});
		$("form").submit(submit_data);
		$("#delete_client").on("shown.bs.modal", function (event) {
			var button = $(event.relatedTarget);
			var id = button.data("record-id");
			var modal = $(this);
			modal.find("input[name=id]").val(id);
		});
		$("#delete_client button[data-type-submit]").click(function () {
			$(this).prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");

			$.ajax({
				"data" : $("#delete_client form").serialize(),
				"type" : "DELETE",
				"url"  : window.location.href
			}).done(function () {
				window.location.href = "/";
			});
		});
	});
})();