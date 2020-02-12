const express = require('express');
const router = express.Router();
const logger = require('../../helpers/logs');

const { ensureAuthenticated, ensureEditOrders } = require('../../helpers/auth');

// includes model for mongodb
const Order = require('../../models/Order');

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get('/:orderNum', ensureAuthenticated, async (req, res) => {
	try {
		const order = await Order.findOne(
			{ orderNum: req.params.orderNum },
			{ checkpoints: 0, instruction: 0 }
		);
		res.json(order);
	} catch (err) {
		logger.error(err);
	}
});

// @DESC - ADDS LINE TO ORDER BASED ON ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.put(
	'/:orderNum/:lineNumber',
	[ensureAuthenticated, ensureEditOrders],
	async (req, res) => {
		try {
			let foundOrder = await Order.findOne({ orderNum: req.params.orderNum });
			foundOrder.orderLines.push({ lineNumber: req.params.lineNumber });
			const savedOrder = await foundOrder.save();
			res.json(savedOrder);
		} catch (err) {
			logger.error(err);
		}
	}
);

// @DESC - ADDS ITEM TO LINE BASED ON LINE NUMBER
// SEC - MUST BE LOGGED IN
router.put(
	'/:orderNum/:lineNumber/:itemNumber',
	[ensureAuthenticated, ensureEditOrders],
	async (req, res) => {
		try {
			let foundOrder = await Order.findOne({ orderNum: req.params.orderNum });
			const newItemNumber = `${foundOrder.orderNum}-${
				foundOrder.orderLines[req.params.lineNumber].lineNumber
			}-${req.params.itemNumber}`;
			foundOrder.orderLines[req.params.lineNumber].items.push({
				itemNumber: newItemNumber
			});
			const savedOrder = await foundOrder.save();
			res.json(savedOrder);
		} catch (err) {
			logger.error(err);
		}
	}
);

router.put(
	'/:orderNum',
	[ensureAuthenticated, ensureEditOrders],
	async (req, res) => {
		try {
			const requestOrder = req.body;
			const order = await Order.findOneAndUpdate(
				{ orderNum: req.params.orderNum },
				requestOrder,
				{ new: true, upsert: true }
			);
			res.json(order);
		} catch (err) {
			logger.error(err);
		}
	}
);

module.exports = router;
