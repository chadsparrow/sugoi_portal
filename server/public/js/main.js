$(document).ready(function() {
  $("#styleTable").dataTable({
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
    dom: "lrftip",
    buttons: [
      {
        text: "Excel",
        extend: "excelHtml5"
      }
    ]
  });

  var groupColumn = 1;
  $("#orderTable").dataTable({
    responsive: true,
    pageLength: 20,
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
    dom: "lrftip",
    buttons: [
      {
        text: "Excel",
        extend: "excelHtml5"
      }
    ]
  });
});
