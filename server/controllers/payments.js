const logger = require('../helpers/logs');
const dayjs = require('dayjs');

const Order = require('../models/Order');

// @desc    Get All Payments
// @route   GET /payments/
// @access  Private - Edit Orders Role
exports.getAllPayments = async (req, res, next) => {
	try {
		let pageTitle = 'Payments - All';
		let orders;
		if (req.user.lgUser) {
			pageTitle = 'LG Payments - All';
			orders = await Order.find({
				currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] },
				lgOrder: true
			});
		} else {
			orders = await Order.find({
				currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] }
			});
		}
		res.render('payments/', { orders, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get Balance Outstanding Orders
// @route   GET /payments/outstanding
// @access  Private - Edit Orders Role
exports.getOutstanding = async (req, res, next) => {
	try {
		let pageTitle = 'Payments - Balance Outstanding';
		let orders;
		if (req.user.lgUser) {
			pageTitle = 'LG Payments - Balance Outstanding';
			orders = await Order.find({
				currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] },
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
				lgOrder: true
			});
		} else {
			orders = await Order.find({
				currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] },
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] }
			});
		}
		res.render('payments/', { orders, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get Balance Outstanding Orders in Pre-Prod
// @route   GET /payments/outstanding/preprod
// @access  Private - Edit Orders Role
exports.getOutstandingPreProd = async (req, res, next) => {
	try {
		let pageTitle = 'Payments - Balance Outstanding - Pre-Production';
		let orders;
		if (req.user.lgUser) {
			pageTitle = 'LG Payments - Balance Outstanding - Pre-Production';
			orders = await Order.find({
				currentStatus: {
					$in: [
						'A. Waiting for Proof',
						'B. Proof Started',
						'C. Proof - Waiting on Someone else',
						'D. Proof Ready for QC',
						'D-1. Proof QC in Progress',
						'E. Proof QC Complete',
						'F. Proof Complete',
						'G. Waiting for Revision',
						'H. Revision - Waiting on Someone else',
						'I. Revision Started',
						'J. Revision Ready for QC',
						'J-1. Revision QC in Progress',
						'K. Revision QC Complete',
						'L. Revision Complete'
					]
				},
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
				lgOrder: true
			});
		} else {
			orders = await Order.find({
				currentStatus: {
					$in: [
						'A. Waiting for Proof',
						'B. Proof Started',
						'C. Proof - Waiting on Someone else',
						'D. Proof Ready for QC',
						'D-1. Proof QC in Progress',
						'E. Proof QC Complete',
						'F. Proof Complete',
						'G. Waiting for Revision',
						'H. Revision - Waiting on Someone else',
						'I. Revision Started',
						'J. Revision Ready for QC',
						'J-1. Revision QC in Progress',
						'K. Revision QC Complete',
						'L. Revision Complete'
					]
				},
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] }
			});
		}
		res.render('payments/', { orders, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get Balance Outstanding Orders in Production
// @route   GET /payments/outstanding/prod
// @access  Private - Edit Orders Role
exports.getOutstandingProd = async (req, res, next) => {
	try {
		let pageTitle = 'Payments - Balance Outstanding - In Production';
		let orders;
		if (req.user.lgUser) {
			pageTitle = 'LG Payments - Balance Outstanding - In Production';
			orders = await Order.find({
				currentStatus: {
					$in: [
						'M. Waiting for Output',
						'N. Output - Waiting on Someone else',
						'O. Output Started',
						'P. Output Ready for QC',
						'P-1. Output QC in Progress',
						'Q. Output QC Complete',
						'R. Waiting for PNT',
						'S. PNT Ready for QC',
						'S-1. PNT QC in Progress',
						'T. PNT QC Complete',
						'U. Uploaded',
						'V. Sent to Vendor'
					]
				},
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
				shipStatus: { $ne: 'Shipped' },
				lgOrder: true
			});
		} else {
			orders = await Order.find({
				currentStatus: {
					$in: [
						'M. Waiting for Output',
						'N. Output - Waiting on Someone else',
						'O. Output Started',
						'P. Output Ready for QC',
						'P-1. Output QC in Progress',
						'Q. Output QC Complete',
						'R. Waiting for PNT',
						'S. PNT Ready for QC',
						'S-1. PNT QC in Progress',
						'T. PNT QC Complete',
						'U. Uploaded',
						'V. Sent to Vendor'
					]
				},
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
				shipStatus: { $ne: 'Shipped' }
			});
		}
		res.render('payments/', { orders, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get Balance Outstanding Orders that are shipped
// @route   GET /payments/outstanding/shipped
// @access  Private - Edit Orders Role
exports.getOutstandingShipped = async (req, res, next) => {
	try {
		let pageTitle = 'Payments - Balance Outstanding - Shipped';
		let orders;
		if (req.user.lgUser) {
			pageTitle = 'LG Payments - Balance Outstanding - Shipped';
			orders = await Order.find({
				shipStatus: 'Shipped',
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
				lgOrder: true
			});
		} else {
			orders = await Order.find({
				shipStatus: 'Shipped',
				paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] }
			});
		}
		res.render('payments/', { orders, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get Payments edit page for single order
// @route   GET /payments/edit/:id
// @access  Private - Edit Orders Role
exports.getPaymentsEditPage = async (req, res, next) => {
	try {
		const order = await Order.findOne({ _id: req.params.id });
		res.render('payments/edit', { order });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Edit payment for single order
// @route   PUT /payments/edit/:id
// @access  Private - Edit Orders Role
exports.updatePayment = async (req, res, next) => {
	try {
		let {
			approvedTerms,
			onTermPayment,
			kitOrderPayment,
			isrCollectedOrig,
			isrPaymentDate,
			isrPaymentType,
			paymentNotes,
			isrRefunded,
			isrRefundedDate,
			invoiceSent
		} = req.body;

		let foundOrder = await Order.findOne({ _id: req.params.id });
		foundOrder.approvedTerms = approvedTerms;
		foundOrder.onTermPayment = onTermPayment;
		foundOrder.kitOrderPayment = kitOrderPayment;
		foundOrder.isrCollectedOrig = isrCollectedOrig;
		foundOrder.isrPaymentDate = isrPaymentDate;
		foundOrder.isrPaymentType = isrPaymentType;

		if (paymentNotes != foundOrder.paymentNotes) {
			if (!foundOrder.paymentNotesLog) {
				foundOrder.paymentNotesLog = [];
			}
			let currentDate = dayjs().format();
			foundOrder.paymentNotesLog.push({
				note: foundOrder.paymentNotes,
				date: foundOrder.paymentNotesDate
			});
			foundOrder.paymentNotes = paymentNotes;
			foundOrder.paymentNotesDate = currentDate;
		}

		foundOrder.isrRefunded = isrRefunded;
		foundOrder.isrRefundedDate = isrRefundedDate;
		foundOrder.invoiceSent = invoiceSent;
		if (foundOrder.netValue != null || foundOrder.netValue != undefined) {
			let balanceOutstanding =
				foundOrder.netValue -
				foundOrder.onTermPayment -
				foundOrder.deposit -
				foundOrder.kitOrderPayment -
				foundOrder.isrCollectedOrig +
				foundOrder.isrRefunded;
			foundOrder.balanceOutstanding = balanceOutstanding;
			if (foundOrder.balanceOutstanding > 0) {
				foundOrder.paymentStatus = 'Balance Outstanding';
			} else if (foundOrder.balanceOutstanding == 0) {
				foundOrder.paymentStatus = 'Complete';
			} else if (foundOrder.balanceOutstanding < 0) {
				foundOrder.paymentStatus = 'Refund Customer';
			}
		}

		const updatedOrder = await foundOrder.save();
		logger.info(
			`${updatedOrder.orderNum} - Payment updated by ${req.user.username}`
		);
		req.flash('success_msg', 'Payment Updated');
		res.redirect('/payments/outstanding');
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get payment logs for single order
// @route   GET /payments/logs/:id
// @access  Private - Edit Orders Role
exports.getPaymentLogs = async (req, res, next) => {
	try {
		const order = await Order.findOne({ _id: req.params.id });
		let logs = [];
		const { paymentNotes, paymentNotesDate } = order;
		if (order.paymentNotesLog) {
			logs = order.paymentNotesLog.reverse();
		}
		res.render('payments/logs', { logs, paymentNotes, paymentNotesDate });
	} catch (err) {
		logger.error(err);
	}
};
