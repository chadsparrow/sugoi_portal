const moment = require("moment-timezone");

module.exports = {
  getHandle: function (username) {
    //let userArray = username.split("@");
    //username = userArray[0];
    return username;
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      );
  },
  formatDate: function (date, format) {
    if (date) {
      let d = new Date(date);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      return moment(d).format(format);
    } else {
      return null;
    }
  },
  setStatusDiv: function (status) {
    switch (status) {
      case "A. Waiting for Proof":
        return "red white-text";
        break;
      case "B. Proof Started":
        return "light-blue lighten-2";
        break;
      case "C. Proof - Waiting on Someone else":
        return "deep-purple lighten-4";
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
        return "deep-purple lighten-4";
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
        return "deep-purple lighten-4";
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
  stripStatusCode: function (status) {
    return status.substr(3);
  },
  getInstructions: function (instructions) {
    return instructions.reverse();
  },
  checkForQCStatus: function (status) {
    if (
      status === "S. PNT Ready for QC" ||
      status === "P. Output Ready for QC" ||
      status === "J. Revision Ready for QC" ||
      status === "D. Proof Ready for QC"
    ) {
      return true;
    }
  },
  checkForRevisionStatus: function (status) {
    if (status === "F. Proof Complete" || status === "L. Revision Complete") {
      return true;
    }
  },
  checkForSignOff: function (status) {
    if (
      status === "M. Waiting for Output" ||
      status === "N. Output - Waiting on Someone else" ||
      status === "O. Output Started" ||
      status === "P. Output Ready for QC" ||
      status === "Q. Output QC Complete" ||
      status === "R. Waiting for PNT" ||
      status === "S. PNT Ready for QC" ||
      status === "T. PNT QC Complete" ||
      status === "U. Uploaded" ||
      status === "V. Sent to Vendor" ||
      status === "W. CANCELLED"
    ) {
      return true;
    }
  },
  catNotes: function (type) {
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
  },
  setPaymentStatus: function (paymentStatus) {
    switch (paymentStatus) {
      case "Balance Outstanding":
        return "red lighten-4";
        break;
      case "Complete":
        return "green lighten-4";
        break;
      case "Refund Customer":
        return "amber lighten-4";
        break;
    }
  },
  setConfirmDeliveryStatus: function (confirmDeliveryStatus) {
    switch (confirmDeliveryStatus) {
      case "Delivered":
        return "green lighten-4 green-text";
        break;
      case "Exception":
        return "red lighten-4 red-text";
        break;
      case "InfoReceived":
        return "yellow lighten-4 grey-text";
        break;
      case "Pending":
        return "yellow lighten-4 grey-text";
        break;
      case "InTransit":
        return "yellow lighten-4 grey-text";
        break;
      case "FailAttempt":
        return "red lighten-4 red-text";
        break;
      case "Invalid Tracking #":
        return "red lighten-4 red-text";
        break;
    }
  },
  setShipStatus: function (shipStatus) {
    if (shipStatus == "Shipped") {
      return "green lighten-4 green-text";
    } else {
      return "black-text";
    }
  }
};
