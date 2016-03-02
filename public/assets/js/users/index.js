(function () {
	var load_data = function (users) {
		$("tbody").empty();

		var rights = {
			"0": "read",
			"1": "read/write",
			"2": "read/write"
		};

		users = users || [];
		var html = $("script#template-user-record").html();
		_.each(users, function (user, index) {
			var template = html.replace(/\{\{Id\}\}/g, user.Id);
			template = template.replace(/\{\{Naam\}\}/g, user.Naam);
			template = template.replace(/\{\{Email\}\}/g, user.Email);
			template = template.replace(/\{\{Type\}\}/g, rights[user.Type || 0]);
			$("table tbody").append(template);
			var tr = $("table tbody tr:last");
			if (user.Type !== 1) {
				tr.find("i.fa-check-square-o").remove();
			}
			tr.find("button[data-record]").data(user);
		});
		$("button[data-record]").click(load_user);
	};
	var load_user = function () {
		var button = $(this);
		var form = $("#add_user form");
		var data = button.data();

		form.find("#id").val(data.Id);
		form.find("#type").val("edit");
		form.find("#naam").val(data.Naam);
		form.find("#email").val(data.Email);
		form.find("#wachtwoord").prop("required", false);
		switch(data.Type) {
			case 0:
				form.find("#read").prop("checked", true);
				break;
			case 1:
				form.find("#administrator").prop("checked", true);
				break;
			case 2:
				form.find("#write").prop("checked", true);
				break;
		}

		$("#add_user").modal("show");
	};
	var submit_data = function (e) {
		var form = $(this);
		form.find("button[type=submit]").prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");
	};
	$(document).ready(function () {
		$("#add_user").on("shown.bs.modal", function () {
			$(this).find("#naam").focus();
		});
		$("#add_user").on("hidden.bs.modal", function () {
			$(this).find("div>input").val("");
			$(this).find("#type").val("add");
			$("#add_user form").find("button[type=submit]").prop("disabled", false).find("i").removeClass().addClass("fa fa-save");
		});

		$("#delete_user").on("shown.bs.modal", function (event) {
			var button = $(event.relatedTarget);
			var id = button.data("record-id");
			var name = button.data("record-naam");
			var modal = $(this);

			modal.find("input[name=id]").val(id);
			modal.find("input[name=naam]").val(name);
			modal.find("span[name=name]").html(name);
		});

		$("#delete_user button[data-type-submit]").click(function () {
			$(this).prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");

			$.ajax({
				"data" : $("#delete_user form").serialize(),
				"type" : "DELETE",
				"url"  : "/users/json"
			}).done(function () {
				window.location.href = window.location.href;
			});
		});

		$("#add_user form").submit(submit_data);
		$.when($.get("/users/json")).then(load_data);
	});
})();