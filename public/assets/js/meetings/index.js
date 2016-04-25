(function () {
        var toggle_agendapoint = function () {
                $(this).parent().find(".panel-collapse, hr").collapse("toggle");
        };

        var template_meetings = function (data) {
                console.log(data);
        };

        $(document).ready(function () {
                $(".panel-heading").on("click", toggle_agendapoint);


                $.post("/meetings/get_meetings", {"id": $("#page_id").data("id")}, template_meetings);
        });
})();