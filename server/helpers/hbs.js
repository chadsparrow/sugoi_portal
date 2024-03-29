const dayjs = require('dayjs');

module.exports = {
	getHandle: function(username) {
		//let userArray = username.split("@");
		//username = userArray[0];
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
		if (date === 'today') {
			date = dayjs().format(format);
		} else if (date && date != 'today') {
			return dayjs(date).format(format);
		} else {
			return null;
		}
	},
	formatPrice: function(value) {
		let val = (value / 1).toFixed(2);
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	},
	netAmount: function(units, price) {
		if (units && price) {
			return '$' + (units * price).toFixed(2);
		}
	},
	setStatusDiv: function(status) {
		switch (status) {
			case '1. Initial':
				return 'grey lighten-2 grey-text';
				break;
			case 'A. Waiting for Proof':
				return 'red white-text';
				break;
			case 'B. Proof Started':
				return 'light-blue lighten-2';
				break;
			case 'C. Proof - Waiting on Someone else':
				return 'deep-purple lighten-4';
				break;
			case 'D. Proof Ready for QC':
				return 'yellow accent-1';
				break;
			case 'D-1. Proof QC in Progress':
				return 'yellow accent-2';
				break;
			case 'E. Proof QC Complete':
				return 'yellow accent-3';
				break;
			case 'F. Proof Complete':
				return 'green accent-3';
				break;
			case 'G. Waiting for Revision':
				return 'red white-text';
				break;
			case 'H. Revision - Waiting on Someone else':
				return 'deep-purple lighten-4';
				break;
			case 'I. Revision Started':
				return 'light-blue lighten-2';
				break;
			case 'J. Revision Ready for QC':
				return 'yellow accent-1';
				break;
			case 'J-1. Revision QC in Progress':
				return 'yellow accent-2';
				break;
			case 'K. Revision QC Complete':
				return 'yellow accent-3';
				break;
			case 'L. Revision Complete':
				return 'green accent-3';
				break;
			case 'M. Waiting for Output':
				return 'red white-text';
				break;
			case 'N. Output - Waiting on Someone else':
				return 'deep-purple lighten-4';
				break;
			case 'O. Output Started':
				return 'light-blue lighten-2';
				break;
			case 'P. Output Ready for QC':
				return 'yellow accent-1';
				break;
			case 'P-1. Output QC in Progress':
				return 'yellow accent-2';
				break;
			case 'Q. Output QC Complete':
				return 'yellow accent-3';
				break;
			case 'R. Waiting for PNT':
				return 'red white-text';
				break;
			case 'S. PNT Ready for QC':
				return 'yellow accent-1';
				break;
			case 'S-1. PNT QC in Progress':
				return 'yellow accent-2';
				break;
			case 'T. PNT QC Complete':
				return 'yellow accent-3';
				break;
			case 'U. Uploaded':
				return 'green darken-2 white-text';
				break;
			case 'V. Sent to Vendor':
				return 'light-blue darken-4 white-text';
				break;
			case 'W. CANCELLED':
				return 'grey lighten-2 grey-text';
				break;
			case 'X. Archived':
				return 'grey lighten-2 grey-text';
				break;
		}
	},
	stripStatusCode: function(status) {
		return status.substr(3);
	},
	getInstructions: function(instructions) {
		return instructions.reverse();
	},
	checkForQCStatus: function(status) {
		if (
			status === 'S. PNT Ready for QC' ||
			status === 'P. Output Ready for QC' ||
			status === 'J. Revision Ready for QC' ||
			status === 'D. Proof Ready for QC'
		) {
			return true;
		}
	},
	checkForRevisionStatus: function(status) {
		if (status === 'F. Proof Complete' || status === 'L. Revision Complete') {
			return true;
		}
	},
	checkForSignOff: function(signedOffDate) {},
	catNotes: function(type) {
		switch (type) {
			case 'Initial':
				return 'grey lighten-1';
				break;
			case 'Revision':
				return 'light-blue lighten-2';
				break;
			case 'QC':
				return 'green white-text';
				break;
			case 'Note':
				return 'grey lighten-1';
				break;
			case 'System':
				return 'grey lighten-1';
				break;
			case 'Art Direction':
				return 'amber lighten-1';
				break;
		}
	},
	setPaymentStatus: function(paymentStatus) {
		switch (paymentStatus) {
			case 'Balance Outstanding':
				return 'red lighten-4';
				break;
			case 'Complete':
				return 'green lighten-4';
				break;
			case 'Refund Customer':
				return 'amber lighten-4';
				break;
		}
	},
	setConfirmDeliveryStatus: function(confirmDeliveryStatus) {
		switch (confirmDeliveryStatus) {
			case 'Delivered':
				return 'green lighten-4 green-text';
				break;
			case 'Exception':
				return 'red lighten-4 red-text';
				break;
			case 'InfoReceived':
				return 'yellow lighten-4 grey-text';
				break;
			case 'Pending':
				return 'yellow lighten-4 grey-text';
				break;
			case 'InTransit':
				return 'yellow lighten-4 grey-text';
				break;
			case 'FailAttempt':
				return 'red lighten-4 red-text';
				break;
			case 'Invalid Tracking #':
				return 'red lighten-4 red-text';
				break;
		}
	},
	setShipStatus: function(shipStatus) {
		if (shipStatus == 'Shipped') {
			return 'green lighten-4 green-text';
		} else {
			return 'black-text';
		}
	},
	getStatusforPayments: function(status, shipStatus) {
		if (shipStatus === 'Shipped') {
			return 'Shipped';
		} else {
			switch (status) {
				case '1. Initial':
					return 'Pre-Production';
					break;
				case 'A. Waiting for Proof':
					return 'Pre-Production';
					break;
				case 'B. Proof Started':
					return 'Pre-Production';
					break;
				case 'C. Proof - Waiting on Someone else':
					return 'Pre-Production';
					break;
				case 'D. Proof Ready for QC':
					return 'Pre-Production';
					break;
				case 'D-1. Proof QC in Progress':
					return 'Pre-Production';
					break;
				case 'E. Proof QC Complete':
					return 'Pre-Production';
					break;
				case 'F. Proof Complete':
					return 'Pre-Production';
					break;
				case 'G. Waiting for Revision':
					return 'Pre-Production';
					break;
				case 'H. Revision - Waiting on Someone else':
					return 'Pre-Production';
					break;
				case 'I. Revision Started':
					return 'Pre-Production';
					break;
				case 'J. Revision Ready for QC':
					return 'Pre-Production';
					break;
				case 'J-1. Revision QC in Progress':
					return 'Pre-Production';
					break;
				case 'K. Revision QC Complete':
					return 'Pre-Production';
					break;
				case 'L. Revision Complete':
					return 'Pre-Production';
					break;
				case 'M. Waiting for Output':
					return 'In Production';
					break;
				case 'N. Output - Waiting on Someone else':
					return 'In Production';
					break;
				case 'O. Output Started':
					return 'In Production';
					break;
				case 'P. Output Ready for QC':
					return 'In Production';
					break;
				case 'P-1. Output QC in Progress':
					return 'In Production';
					break;
				case 'Q. Output QC Complete':
					return 'In Production';
					break;
				case 'R. Waiting for PNT':
					return 'In Production';
					break;
				case 'S. PNT Ready for QC':
					return 'In Production';
					break;
				case 'S-1. PNT QC in Progress':
					return 'In Production';
					break;
				case 'T. PNT QC Complete':
					return 'In Production';
					break;
				case 'U. Uploaded':
					return 'In Production';
					break;
				case 'V. Sent to Vendor':
					return 'In Production';
					break;
			}
		}
	}
};
