jQuery.fn.serializeObject = function (array_separator) {
	var array_data, object_data;
	array_data = this.serializeArray();
	object_data = {};
	$.each(array_data, function () {
		var value;
		if (this.value !== null) {
			value = this.value;
		} else {
			value = "";
		}
		if (object_data[this.name]) {
			if (!Array.isArray(this.name)) {
				object_data[this.name] = [object_data[this.name]];
			}
			object_data[this.name].push(value);
		} else {
			object_data[this.name] = value;
		}
		if (Array.isArray(object_data[this.name]) && array_separator) {
			object_data[this.name] = object_data[this.name].join(array_separator);
		}
	});
	return object_data;
};
String.prototype.format = function () {
	var s = this, i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};
var block_ui = function (event, xhr, options) {
	options.hideModal || $("#loader").modal({"backdrop": true});
};
var blur_datum = function () {
	var element = $(this);
	var value = element.val();
	if (value.match(/(^(\d{2}-\d{2}-\d{4}$))|(^\d{8}$)/)) {
		element.val(moment(value.replace("-", ""), global.DateTimeFormat.L.replace("-", "")).format(global.DateTimeFormat.L));
	}
};
var unblock_ui = function () {
	$("#loader").modal("hide");
};
var set_datetime_formats = function () {
	$("span[data-format-datetime]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('LL LT') : "&nbsp;").removeAttr("data-format-datetime");
	});
	$("span[data-format-datetime-short]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('L LT') : "&nbsp;").removeAttr("data-format-datetime-short");
	});
	$("span[data-format-datetime-short-seconds]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('L HH:mm:ss') : "&nbsp;").removeAttr("data-format-datetime-short-seconds");
	});
	$("span[data-format-datetime-short-break]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('L<br>LT') : "&nbsp;").removeAttr("data-format-datetime-short-break");
	});
	$("span[data-format-date]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('LL') : "&nbsp;").removeAttr("data-format-date");
	});
	$("span[data-format-date-short]").each(function () {
		var value = $(this).html();
		if  (_.isNull(JSON.parse(value || "null"))){
			$(this).html("&nbsp;").removeAttr("data-format-date-short");
			return;
		}
		$(this).html(moment(parseInt(value)).format('L')).removeAttr("data-format-date-short");
	});
	$("span[data-format-time]").each(function () {
		var value = $(this).html();
		$(this).html(JSON.parse(value) ? moment(parseInt(value)).format('LT') : "&nbsp;").removeAttr("data-format-time");
	});
};
$(document).ajaxSend(block_ui).ajaxComplete(unblock_ui).ajaxError(function (e, xhr) {
	$("#error-status").html("&nbsp;{0} - {1}".format(xhr.status, xhr.statusText));
	$("#error-headers").html(xhr.getAllResponseHeaders().split("\n").join("<br>"));
	$("#error-msg").html(xhr.responseText);
	$("#error").modal({"backdrop": true});
});

$(document).ready(function () {
	moment.locale(window.navigator.userLanguage || window.navigator.language);
	_.extend(window.global, {"DateTimeFormat": moment.localeData()._longDateFormat});

	set_datetime_formats();
});
