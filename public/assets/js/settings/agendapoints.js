(function () {



	$(document).ready(function () {
		$("#sortable").sortable();

		$(".list-group-item").click(function () {
			$(this).children().first().collapse("toggle");
		})
	});
})();