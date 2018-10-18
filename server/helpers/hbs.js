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
        return "red white-text";
        break;
      case "B. Proof Started":
        return "light-blue lighten-2";
        break;
      case "C. Proof - Waiting on Someone else":
        return "light-blue lighten-2";
        break;
      case "D. Proof Ready for QC":
        return "yellow accent-2";
        break;
      case "E. Proof QC Complete":
        return "yellow accent-4";
        break;
      case "F. Proof Complete":
        return "green accent-3";
        break;
      case "G. Waiting for Revision":
        return "red white-text";
        break;
      case "H. Revision - Waiting on Someone else":
        return "light-blue lighten-2";
        break;
      case "I. Revision Started":
        return "light-blue lighten-2";
        break;
      case "J. Revision Ready for QC":
        return "yellow accent-2";
        break;
      case "K. Revision QC Complete":
        return "yellow accent-4";
        break;
      case "L. Revision Complete":
        return "green accent-3";
        break;
      case "M. Waiting for Output":
        return "red white-text";
        break;
      case "N. Output - Waiting on Someone else":
        return "light-blue lighten";
        break;
      case "O. Output Started":
        return "light-blue lighten-2";
        break;
      case "P. Output Ready for QC":
        return "yellow accent-2";
        break;
      case "Q. Output QC Complete":
        return "yellow accent-4";
        break;
      case "R. Waiting for PNT":
        return "red white-text";
        break;
      case "S. PNT Ready for QC":
        return "yellow accent-2";
        break;
      case "T. PNT QC Complete":
        return "yellow accent-4";
        break;
      case "U. Uploaded":
        return "green darken-2 white-text";
        break;
      case "V. Sent to Vendor":
        return "light-blue darken-4 white-text";
        break;
      case "W. CANCELLED":
        return "grey lighten-2 grey-text";
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
