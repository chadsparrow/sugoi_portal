$(document).ready(function() {
  $("#productionDiv").hide();

  if ($("#currentStatus").val() == "V. Sent to Vendor") {
    $("#productionDiv").show();
  }
  $("#currentStatus").change(function() {
    if ($("#currentStatus").val() == "V. Sent to Vendor") {
      $("#productionDiv").show();
    } else {
      $("#productionDiv").hide();
    }
  });

  $("#admin").click(function() {
    if ($("#admin").is(":checked")) {
      $(".form-check-input").attr("checked", true);
    } else {
      $(".form-check-input").attr("checked", false);
    }
  });

  $("input.number").keyup(function(event) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    $(this).val(function(index, value) {
      return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
  });

  $(".input-date").datepicker({
    minDate: new Date(),
    setDefaultDate: true
  });

  //payment date
  $(".input-date2").datepicker({
    setDefaultDate: true
  });

  //latest in hand\
  $("#latestInHand").datepicker({
    minDate: new Date(),
    setDefaultDate: true
  });

  var eventDateElem = $("#eventDate").length;

  if (eventDateElem > 0) {
    var eventDateVal = $("#eventDate")
      .datepicker({ format: "MM/DD/YYYY" })
      .val();
    if (eventDateVal) {
      var selectedDate = new Date(eventDateVal);
      var msecsInADay = 86400000;
      var endDate = new Date(selectedDate.getTime() + msecsInADay - 1);

      $("#latestInHand").datepicker({
        maxDate: endDate,
        minDate: new Date(),
        setDefaultDate: true
      });
    }
  }

  // event date selector
  $("#eventDate").datepicker({
    minDate: new Date(),
    setDefaultDate: true,
    onSelect: function(date) {
      var selectedDate = new Date(date);
      var msecsInADay = 86400000;
      var endDate = new Date(selectedDate.getTime() + msecsInADay - 1);

      $("#latestInHand").datepicker({
        maxDate: endDate,
        minDate: new Date(),
        setDefaultDate: true
      });
    }
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
    buttons: ["excelHtml5"]
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
    buttons: [
      {
        extend: "excelHtml5",
        text: "Export Excel",
        title: "",
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return "Orders-Report " + n;
        },
        exportOptions: {
          modifier: {
            page: "current"
          },
          columns: ":not(:last-child)"
        }
      },
      {
        text: "In Progress",
        action: function(e, dt, node, config) {
          var regex = "^(?!V.|W.)";
          dt.columns(1)
            .search(regex, true, false, true)
            .draw();
        }
      },
      {
        text: "Completed",
        action: function(e, dt, node, config) {
          var regex = "V. Sent to Vendor";
          dt.columns(1)
            .search(regex, true, false, true)
            .draw();
        }
      }
    ]
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
    pageLength: 15,
    order: [[0, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lBrftip",
    buttons: [
      {
        extend: "excelHtml5",
        text: "Export Excel",
        title: "",
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return "Production-Report " + n;
        },
        exportOptions: {
          modifier: {
            page: "current"
          },
          columns: ":not(:last-child)"
        }
      }
    ]
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
    pageLength: 15,
    order: [[0, "asc"]],
    oLanguage: {
      sSearch: "Search",
      sSearchPlaceholder: "Enter search text",
      sInfo: "_START_ -_END_ of _TOTAL_",
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "lBrftip",
    buttons: [
      {
        extend: "excelHtml5",
        text: "Export Excel",
        title: "",
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return "Payments-Report " + n;
        },
        exportOptions: {
          modifier: {
            page: "current"
          },
          columns: ":not(:last-child)"
        }
      }
    ]
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
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select></div>"
    },
    bAutoWidth: false,
    dom: "r<'myFilter'f>tip",
    buttons: ["excelHtml5"]
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
        '<option value="15">15</option>' +
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
});
