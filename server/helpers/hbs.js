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
    if (date) {
      return moment(date).format(format);
    } else {
      return null;
    }
  },
  setStatusDiv: function(status) {
    switch (status) {
      case "1. Waiting for Proof":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "2. Proof Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "3. Proof - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "4. Proof Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "5. Proof QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "6. Proof Complete":
        return "<div class='chip status green accent-3'>" + status + "</div>";
        break;
      case "7. Waiting for Revision":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "8. Revision - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "9. Revision Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "10. Revision Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "11. Revision QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "12. Revision Complete":
        return "<div class='chip status green accent-3'>" + status + "</div>";
        break;
      case "13. Waiting for Output":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "14. Output - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "15. Output Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "16. Output Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "17. Output QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "18. Waiting for PNT":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "19. PNT Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "20. PNT QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "21. Uploaded":
        return (
          "<div class='chip status green darken-2 white-text'>" +
          status +
          "</div>"
        );
        break;
      case "22. Sent to Vendor":
        return (
          "<div class='chip status light-blue darken-4 white-text'>" +
          status +
          "</div>"
        );
        break;
      case "23. CANCELLED":
        return (
          "<div class='chip status grey lighten-2 grey-text'>" +
          status +
          "</div>"
        );
        break;
    }
  },
  getInstructions: function(instructions) {
    return instructions.reverse();
  }
};
