$(document).ready(function() {
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
    rowGroup: {
      dataSrc: 1
    },
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
    dom: "r<'myFilter'f>tip",
    buttons: ["excel"]
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
    dom: "r<'myFilter'f>tip",
    buttons: ["excel"]
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
});
