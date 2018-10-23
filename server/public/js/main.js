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
    dom: "Brftip",
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
    dom: "Brftip",
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

  // var cleave = new Cleave("#accountNum", {
  //   delimiter: "-",
  //   blocks: [6, 3],
  //   uppercase: true
  // });

  // $("#accountNum").keydown(function(e) {
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

  // On form submit, handle the file uploads.
  $("#upload-zip").on("submit", function(event) {
    event.preventDefault();

    // Get the files from input, create new FormData.
    var files = $("#myZip").get(0).files,
      formData = new FormData();

    if (files.length === 0) {
      alert("Select atleast 1 file to upload.");
      return false;
    }

    // Append the files to the formData.
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("zips[]", file, file.name);
    }

    // Note: We are only appending the file inputs to the FormData.
    uploadFiles(formData);
  });

  function uploadFiles(formData) {
    $.ajax({
      url: "./public/uploads",
      method: "post",
      data: formData,
      processData: false,
      contentType: false,
      xhr: function() {
        var xhr = new XMLHttpRequest();

        // Add progress event listener to the upload.
        xhr.upload.addEventListener("progress", function(event) {
          var progressBar = $(".progress-bar");

          if (event.lengthComputable) {
            var percent = (event.loaded / event.total) * 100;
            progressBar.width(percent + "%");

            if (percent === 100) {
              progressBar.removeClass("active");
            }
          }
        });

        return xhr;
      }
    })
      .done(handleSuccess)
      .fail(function(xhr, status) {
        alert(status);
      });
  }

  $("#myZip").on("change", function() {
    $(".progress-bar").width("0%");
  });
});
