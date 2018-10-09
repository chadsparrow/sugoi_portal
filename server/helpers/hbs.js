const moment = require("moment");

module.exports = {
  getHandle: function(username) {
    let userArray = username.split("@");
    username = userArray[0];
    return username;
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      );
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  setStatusDiv: function(status) {
    switch (status) {
      case "1. Waiting for Proof":
        return (
          "<div class='chip status amber accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "2. Proof Started":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "3. Proof - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "4. Proof Ready for QC":
        return (
          "<div class='chip status yellow accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "5. Proof Complete":
        return (
          "<div class='chip status green accent-3' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "6. Waiting for Revision":
        return (
          "<div class='chip status amber accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "7. Revision - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "8. Revision Started":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "9. Revision Ready for QC":
        return (
          "<div class='chip status yellow accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "10. Revision Complete":
        return (
          "<div class='chip status green accent-3' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "11. Waiting for Output":
        return (
          "<div class='chip status amber accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "12. Output - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "13. Output Started":
        return (
          "<div class='chip status light-blue lighten-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "14. Output Ready for QC":
        return (
          "<div class='chip status yellow accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "15. Waiting for PNT":
        return (
          "<div class='chip status amber accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "16. PNT Ready for QC":
        return (
          "<div class='chip status yellow accent-2' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "17. Uploaded":
        return (
          "<div class='chip status green darken-2 white-text' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "18. Sent to Vendor":
        return (
          "<div class='chip status light-blue darken-4 white-text' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
      case "19. CANCELLED":
        return (
          "<div class='chip status grey lighten-2 grey-text' style='font-size: 10px;'>" +
          status +
          "</div>"
        );
        break;
    }
  }
};
