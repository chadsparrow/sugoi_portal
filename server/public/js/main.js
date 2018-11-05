$(document).ready(function() {
  $("#admin").click(function() {
    if ($("#admin").is(":checked")) {
      $(".form-check-input").attr("checked", true);
    } else {
      $(".form-check-input").attr("checked", false);
    }
  });

  $(".input-date").datepicker({
    minDate: new Date(),
    setDefaultDate: true
  });

  function goBack() {
    window.history.back();
  }

  $("#styleTable").dataTable({
    initComplete: function(settings, json) {
      $(".main-loader").hide();
    },
    responsive: true,
    fixedHeader: {
      header: true,
      headerOffset: 64,
      footer: false
    },
    pageLength: -1,
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "r<'myFilter'f>tip",
    buttons: ["excel"]
  });

  $("#orderTable").dataTable({
    initComplete: function(settings, json) {
      $(".main-loader").hide();
    },
    responsive: true,
    fixedHeader: {
      header: true,
      headerOffset: 64,
      footer: false
    },
    pageLength: -1,
    order: [[1, "asc"], [3, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lBrftip",
    buttons: ["csv"]
  });

  $("#prodTable").dataTable({
    initComplete: function(settings, json) {
      $(".main-loader").hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 4,
        data: "netValue",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      }
    ],
    scrollX: true,
    scrollCollapse: true,
    pageLength: 20,
    order: [[0, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lBrftip",
    buttons: ["csv"]
  });

  $("#paymentTable").dataTable({
    initComplete: function(settings, json) {
      $(".main-loader").hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 3,
        data: "netValue",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      },
      {
        targets: 10,
        data: "onTermPayment",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      },
      {
        targets: 11,
        data: "kitOrderPayment",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      },
      {
        targets: 12,
        data: "isrCollectedOrig",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      },
      {
        targets: 13,
        data: "isrCollectedCAD",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      },
      {
        targets: 18,
        data: "balanceOutstanding",
        render: $.fn.dataTable.render.number(",", ".", 2, "$")
      }
    ],
    scrollX: true,
    scrollCollapse: true,
    pageLength: 20,
    order: [[0, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lBrftip",
    buttons: ["csv"]
  });

  $("#userTable").dataTable({
    responsive: true,
    pageLength: -1,
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "r<'myFilter'f>tip",
    buttons: ["excel"]
  });

  $("#qcTable").dataTable({
    initComplete: function(settings, json) {
      $(".main-loader").hide();
    },
    columnDefs: [
      { width: "10%", targets: 0 },
      { width: "10%", targets: 1 },
      { width: "15%", targets: 2 },
      { width: "65%", targets: 3 }
    ],
    pageLength: 10,
    order: [[0, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lrftip"
  });

  $("#orderNum").keydown(function(e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  });

  var validChars = "$£€c" + "0123456789" + ".-,()'";
  // Init the regex just once for speed - it is "closure locked"
  var str = jQuery.fn.dataTableExt.oApi._fnEscapeRegex(validChars),
    re = new RegExp("[^" + str + "]");
  $.fn.dataTableExt.aTypes.unshift(function(data) {
    if (typeof data !== "string" || re.test(data)) {
      return null;
    }
    return "currency";
  });
  $.fn.dataTable.ext.type.order["currency-pre"] = function(data) {
    //Check if its in the proper format
    if (data.match(/[\()]/g)) {
      if (data.match(/[\-]/g) !== true) {
        //It matched - strip out parentheses & any characters we dont want and append - at front
        data = "-" + data.replace(/[\$£€c\(\),]/g, "");
      } else {
        //Already has a '-' so just strip out non-numeric charactors exluding '-'
        data = data.replace(/[^\d\-\.]/g, "");
      }
    } else {
      data = data.replace(/[\$£€\,]/g, "");
    }
    return parseInt(data, 10);
  };
});
