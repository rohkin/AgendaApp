(function () {
	var check_password_match = function () {
		var password1 = $("input[name=password]").val();
		var password2 = $("input[name=password2]").val();

		if (password1 === password2) {
			$("input[name=password]").parent().removeClass("has-error").addClass("has-success");
			$("input[name=password2]").parent().removeClass("has-error").addClass("has-success");
			$("#save").attr("disabled", false);
		} else {
			$("input[name=password]").parent().removeClass("has-success").addClass("has-error");
			$("input[name=password2]").parent().removeClass("has-success").addClass("has-error");
			$("#save").attr("disabled", true);
		}
	};

	var save_user = function (e) {
		e.preventDefault();

		$("#save").attr("disabled", true).find("i").removeClass("fa-save").addClass("fa-spin fa-spinner");
		$.post("/users/settings", $(this).serializeArray(), function () {
			$("#save").attr("disabled", false).find("i").removeClass("fa-spin fa-spinner").addClass("fa-save");
		});
	};

	var insert_user = function (data) {
		var user = _.first(data) || [];

		_.forEach(user, function (value,index) {
			$("input[name={0}]".format(index)).val(value);
		});

	};

	$(document).ready(function () {
		$("input[name=password], input[name=password2]").keyup(check_password_match);
		$("form").on("submit", save_user);

		$.post("/users/get_user", insert_user);
	});
})();