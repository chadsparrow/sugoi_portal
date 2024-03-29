$(document).ready(function() {
  //  THIS SECTION SHOWS AND HIDES EXTRA PRODUCTION FIELDS IF IT'S READY TO GO TO PRODUCTION
  $.fn.dataTable.moment('D-MMM-YY');
  $('#productionDiv').hide();

  if ($('#currentStatus').val() == 'V. Sent to Vendor') {
    $('#productionDiv').show();
  }
  $('#currentStatus').change(function() {
    if ($('#currentStatus').val() == 'V. Sent to Vendor') {
      $('#productionDiv').show();
    } else {
      $('#productionDiv').hide();
    }
  });

  // THIS SECTION SHOWS ART DIRECTION FIELD IF IT IS WAITING FOR PROOF
  $('#proofDiv').hide();

  if ($('#currentStatus').val() == 'A. Waiting for Proof') {
    $('#proofDiv').show();
  }

  $('#currentStatus').change(function() {
    if ($('#currentStatus').val() == 'A. Waiting for Proof') {
      $('#proofDiv').show();
    } else {
      $('#proofDiv').hide();
    }
  });

  $('#admin').click(function() {
    if ($('#admin').is(':checked')) {
      $('.form-check-input').attr('checked', true);
    } else {
      $('.form-check-input').attr('checked', false);
    }
  });

  //  FORMATS PRICING WITH , AFTER 3 DIGITS
  $('input.number').keyup(function(event) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    $(this).val(function(index, value) {
      return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
  });

  $('.input-date').datepicker({
    minDate: new Date(),
    setDefaultDate: true
  });

  //payment date
  $('.input-date2').datepicker({
    setDefaultDate: true
  });

  //latest in hand
  $('#latestInHand').datepicker({
    minDate: new Date(),
    setDefaultDate: true
  });

  var eventDateElem = $('#eventDate').length;

  if (eventDateElem > 0) {
    var eventDateVal = $('#eventDate')
      .datepicker({ format: 'MM/DD/YYYY' })
      .val();
    if (eventDateVal) {
      var selectedDate = new Date(eventDateVal);
      var msecsInADay = 86400000;
      var endDate = new Date(selectedDate.getTime() + msecsInADay - 1);

      $('#latestInHand').datepicker({
        maxDate: endDate,
        minDate: new Date(),
        setDefaultDate: true
      });
    }
  }

  var tableExporter = $('.poTable').tableExport({
    formats: ['xlsx'],
    fileName: 'id',
    bootstrap: false,
    position: 'bottom',
    trimWhitespace: true
  });

  tableExporter.types.date.assert = function(v) {
    return false;
  };

  // event date selector
  $('#eventDate').datepicker({
    minDate: new Date(),
    setDefaultDate: true,
    onSelect: function(date) {
      var selectedDate = new Date(date);
      var msecsInADay = 86400000;
      var endDate = new Date(selectedDate.getTime() + msecsInADay - 1);

      $('#latestInHand').datepicker({
        maxDate: endDate,
        minDate: new Date(),
        setDefaultDate: true
      });
    }
  });

  function goBack() {
    window.history.back();
  }

  $('#styleTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    responsive: true,
    fixedHeader: {
      header: true,
      headerOffset: 64,
      footer: false
    },
    pageLength: -1,
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: "r<'myFilter'f>tip",
    buttons: ['excelHtml5']
  });

  //ORDER TABLE
  $('#orderTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    responsive: false,
    select: true,
    pageLength: -1,
    order: [[1, 'asc'], [3, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        text: 'All',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders/all');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Initial',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders/initial');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'In Progress',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Completed',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders/completed');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Archived',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders/archived');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Cancelled',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/orders/cancelled');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Orders-Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  $('#prodTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 4,
        data: 'netValue',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      }
    ],
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[0, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      // {
      //   text: "Vendor Copy",
      //   action: function (e, dt, node, config) {
      //     $(location).attr("href", "/prod/ccn");
      //   },
      //   className: "waves-effect waves-light btn-small"
      // },
      {
        text: 'All Orders',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/prod/');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Open Orders',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/prod/open');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Shipped',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/prod/pending');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Cancelled',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/prod/cancelled');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Production-Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  $('#prodCCNTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[0, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        text: 'All Orders',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/prod/');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Production-Report-CCN ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ]
  });

  $('#paymentTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 2,
        data: 'netValue',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 3,
        data: 'balanceOutstanding',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 11,
        data: 'onTermPayment',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 12,
        data: 'kitOrderPayment',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 13,
        data: 'isrCollectedOrig',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 16,
        data: 'isrRefunded',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      }
    ],
    select: true,
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[0, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        text: 'All',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/payments/');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Outstanding All',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/payments/outstanding');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Outstanding Pre-Prod',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/payments/outstanding/preprod');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Outstanding Prod',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/payments/outstanding/prod');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        text: 'Outstanding Shipped',
        action: function(e, dt, node, config) {
          $(location).attr('href', '/payments/outstanding/shipped');
        },
        className: 'waves-effect waves-light btn-small'
      },
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Payments-Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  $('#userTable').dataTable({
    pageLength: -1,
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: "r<'myFilter'f>tip",
    buttons: ['excelHtml5']
  });

  $('#qcTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    columnDefs: [{ width: '10%', targets: 0 }, { width: '10%', targets: 1 }, { width: '15%', targets: 2 }, { width: '65%', targets: 3 }],
    pageLength: 10,
    order: [[0, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lrftip'
  });

  $('#reportTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 9,
        data: 'netValue',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      },
      {
        targets: 10,
        data: 'estValue',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      }
    ],
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[1, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  $('#reportTable2').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    fixedColumns: {
      leftColumns: 1,
      rightColumns: 1
    },
    columnDefs: [
      {
        targets: 10,
        data: 'netValue',
        render: $.fn.dataTable.render.number(',', '.', 2, '$')
      }
    ],
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[1, 'asc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  $('#itemOrderedTable').dataTable({
    initComplete: function(settings, json) {
      $('.main-loader').hide();
    },
    scrollX: true,
    scrollCollapse: true,
    pageLength: -1,
    order: [[1, 'desc']],
    oLanguage: {
      sSearch: 'Search',
      sSearchPlaceholder: 'Enter search text',
      sInfo: '_START_ -_END_ of _TOTAL_',
      sLengthMenu:
        '<span>Rows per page:</span><select class="browser-default">' +
        '<option value="15">15</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        '</select></div>'
    },
    bAutoWidth: false,
    dom: 'lBrftip',
    buttons: [
      {
        extend: 'excelHtml5',
        className: 'waves-effect waves-light btn-small',
        text: 'Export Excel',
        title: '',
        filename: function() {
          var d = new Date();
          var n = d.getTime();
          return 'Report ' + n;
        },
        exportOptions: {
          modifier: {
            page: 'current'
          },
          columns: ':not(:last-child)'
        }
      }
    ]
  });

  // ONLY ALLOWS DIGITS AND 7 CHARACTERS in SO NUMBER
  // $("#orderNum").keydown(function (e) {
  //   // Allow: backspace, delete, tab, escape, enter and .
  //   if (
  //     $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
  //     // Allow: Ctrl+A, Command+A
  //     (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
  //     // Allow: home, end, left, right, down, up
  //     (e.keyCode >= 35 && e.keyCode <= 40)
  //   ) {
  //     // let it happen, don't do anything
  //     return;
  //   }
  //   // Ensure that it is a number and stop the keypress
  //   if (
  //     (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
  //     (e.keyCode < 96 || e.keyCode > 105)
  //   ) {
  //     e.preventDefault();
  //   }
  // });
});
