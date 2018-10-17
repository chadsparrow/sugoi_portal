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
      case "A. Waiting for Proof":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "B. Proof Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "C. Proof - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "D. Proof Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "E. Proof QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "F. Proof Complete":
        return "<div class='chip status green accent-3'>" + status + "</div>";
        break;
      case "G. Waiting for Revision":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "H. Revision - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "I. Revision Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "J. Revision Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "K. Revision QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "L. Revision Complete":
        return "<div class='chip status green accent-3'>" + status + "</div>";
        break;
      case "M. Waiting for Output":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "N. Output - Waiting on Someone else":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "O. Output Started":
        return (
          "<div class='chip status light-blue lighten-2'>" + status + "</div>"
        );
        break;
      case "P. Output Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "Q. Output QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "R. Waiting for PNT":
        return "<div class='chip status red white-text'>" + status + "</div>";
        break;
      case "S. PNT Ready for QC":
        return "<div class='chip status yellow accent-2'>" + status + "</div>";
        break;
      case "T. PNT QC Complete":
        return "<div class='chip status yellow accent-4'>" + status + "</div>";
        break;
      case "U. Uploaded":
        return (
          "<div class='chip status green darken-2 white-text'>" +
          status +
          "</div>"
        );
        break;
      case "V. Sent to Vendor":
        return (
          "<div class='chip status light-blue darken-4 white-text'>" +
          status +
          "</div>"
        );
        break;
      case "W. CANCELLED":
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
  },
  checkForQCStatus: function(status) {
    if (
      status === "S. PNT Ready for QC" ||
      status === "P. Output Ready for QC" ||
      status === "J. Revision Ready for QC" ||
      status === "D. Proof Ready for QC"
    ) {
      return true;
    }
  },
  checkForRevisionStatus: function(status) {
    if (status === "F. Proof Complete" || status === "L. Revision Complete") {
      return true;
    }
  },
  catNotes: function(type) {
    switch (type) {
      case "Initial":
        return "grey lighten-1";
        break;
      case "Revision":
        return "light-blue lighten-2";
        break;
      case "QC":
        return "green white-text";
        break;
      case "Note":
        return "grey lighten-1";
        break;
      case "System":
        return "grey lighten-1";
        break;
    }
  }
};
