(function() {
	var submit_data = function (e) {
		var form = $(this);
		form.find("button[type=submit]").prop("disabled", "disabled").find("i").removeClass().addClass("fa fa-spin fa-spinner");
	}
	$(document).ready(function () {
		$("form").submit(submit_data);
	});
})();

