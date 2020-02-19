const DateDiff = require('date-diff');
const dayjs = require('dayjs');
const logger = require('../helpers/logs');

const Order = require('../models/Order');

module.exports = {
	// @desc    Get all orders and display in Prod table
	// @route   GET /prod/
	// @access  Private - View Prod Role
	getProdOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Production - All Orders';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Production - All Orders';
				orders = await Order.find({
					currentStatus: 'V. Sent to Vendor',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });
			}
			res.render('orders/prod', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all open orders and display in Prod table
	// @route   GET /prod/open
	// @access  Private - View Prod Role
	getProdOpenOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Production - Open Orders';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Production - Open Orders';
				orders = await Order.find({
					$and: [
						{ currentStatus: 'V. Sent to Vendor' },
						{ $or: [{ shipStatus: '' }, { shipStatus: null }] },
						{ lgOrder: true }
					]
				});
			} else {
				orders = await Order.find({
					$and: [
						{ currentStatus: 'V. Sent to Vendor' },
						{ $or: [{ shipStatus: '' }, { shipStatus: null }] }
					]
				});
			}

			res.render('orders/prod', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all pending orders and display in Prod table
	// @route   GET /prod/pending
	// @access  Private - View Prod Role
	getProdPendingOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Production - Shipped Orders';
			let orders;

			if (req.user.lgUser) {
				pageTitle = 'LG Production - Shipped Orders';
				orders = await Order.find({
					$and: [
						{ currentStatus: 'V. Sent to Vendor' },
						{ vendorConfirmShip: { $ne: null } },
						{ shipStatus: 'Shipped' },
						{ lgOrder: true }
					]
				});
			} else {
				orders = await Order.find({
					$and: [
						{ currentStatus: 'V. Sent to Vendor' },
						{ vendorConfirmShip: { $ne: null } },
						{ shipStatus: 'Shipped' }
					]
				});
			}
			res.render('orders/prod', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all cancelled orders and display in Prod table
	// @route   GET /prod/cancelled
	// @access  Private - View Prod Role
	getProdCancelledOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Production - Cancelled Orders';
			let orders;

			if (req.user.lgUser) {
				pageTitle = 'LG Production - Cancelled Orders';
				orders = await Order.find({
					currentStatus: 'W. CANCELLED',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: 'W. CANCELLED' });
			}
			res.render('orders/prod', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get edit modal for single order
	// @route   GET /prod/edit/:id
	// @access  Private - Edit Prod Role
	getProdEditPage: async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);
			res.render('orders/prod-edit', { order });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    update Single order
	// @route   PUT /prod/edit/:id
	// @access  Private - Edit Prod Role
	updateProdOrder: async (req, res, next) => {
		try {
			const {
				latestShipDate,
				vendorConfirmShip,
				jbaPONum,
				jbaGNRNum,
				jbaInvoiceNum,
				shipStatus,
				tracking,
				shippingNotes,
				netValue,
				currency,
				qty
			} = req.body;

			let foundOrder = await Order.findOne({ _id: req.params.id });

			if (foundOrder.balanceOutstanding > 0) {
				foundOrder.paymentStatus = 'Balance Outstanding';
			} else if (foundOrder.balanceOutstanding < 0) {
				foundOrder.paymentStatus = 'Refund Customer';
			} else if (foundOrder.balanceOutstanding == 0) {
				foundOrder.paymentStatus = 'Complete';
			}
			if (latestShipDate) {
				foundOrder.latestShipDate = latestShipDate;
			}

			const sentVendor = foundOrder.sentVendor;
			if (vendorConfirmShip && sentVendor) {
				foundOrder.vendorConfirmShip = vendorConfirmShip;
				let date1 = dayjs(vendorConfirmShip);
				let date2 = dayjs(sentVendor);
				let diff = new DateDiff(date1, date2);
				const prodLeadTime = diff.days();
				foundOrder.prodLeadTime = parseInt(prodLeadTime);
			} else if (vendorConfirmShip && !sentVendor) {
				req.flash('error', 'No Sent to Vendor Date');
				res.redirect('/prod/edit/' + foundOrder._id);
				foundOrder.prodLeadTime = 0;
				return;
			} else {
				foundOrder.prodLeadTime = 0;
			}

			if (tracking != foundOrder.tracking) {
				foundOrder.tracking = tracking;
			}

			if (foundOrder.confirmDeliveryDate && vendorConfirmShip) {
				let date1 = dayjs(foundOrder.confirmDeliveryDate);
				let date2 = dayjs(vendorConfirmShip);
				let diff = new DateDiff(date1, date2);
				const shippingLeadTime = diff.days();
				foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
			} else {
				foundOrder.shippingLeadTime = 0;
			}

			foundOrder.jbaPONum = jbaPONum;
			foundOrder.jbaGNRNum = jbaGNRNum;
			foundOrder.jbaInvoiceNum = jbaInvoiceNum;
			if (
				(foundOrder.jbaInvoiceNum != '' || foundOrder.jbaInvoiceNum != null) &&
				foundOrder.jbaInvoiceDate === null
			) {
				foundOrder.jbaInvoiceDate = dayjs()
					.set('hour', 7)
					.format();
			}
			foundOrder.shipStatus = shipStatus;
			foundOrder.shippingNotes = shippingNotes;
			foundOrder.netValue = netValue;
			foundOrder.qty = qty;
			foundOrder.currency = currency;

			if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
				foundOrder.totalLeadTime =
					foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
			} else {
				foundOrder.totalLeadTime = 0;
			}

			const updatedOrder = await foundOrder.save();
			logger.info(`${updatedOrder.orderNum} - update by ${req.user.username}`);
			req.flash('success_msg', 'Order Production Updated');
			res.redirect('/prod');
		} catch (err) {
			logger.error(err);
		}
	}
};
