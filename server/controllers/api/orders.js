const logger = require('../../helpers/logs');
const Order = require('../../models/Order');

module.exports = {
	// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
	// SEC - MUST BE LOGGED IN
	getOrder: async (req, res, next) => {
		try {
			const order = await Order.findOne(
				{ orderNum: req.params.orderNum },
				{ checkpoints: 0, instruction: 0 }
			);
			res.json(order);
		} catch (err) {
			logger.error(err);
		}
	},

	// @DESC - ADDS LINE TO ORDER BASED ON ORDER NUMBER
	// SEC - MUST BE LOGGED IN
	addLineToOrder: async (req, res, next) => {
		try {
			let foundOrder = await Order.findOne({ orderNum: req.params.orderNum });
			foundOrder.orderLines.push({ lineNumber: req.params.lineNumber });
			const savedOrder = await foundOrder.save();
			res.json(savedOrder);
		} catch (err) {
			logger.error(err);
		}
	},

	// @DESC - ADDS ITEM TO LINE BASED ON LINE NUMBER
	// SEC - MUST BE LOGGED IN
	addItemToLine: async (req, res, next) => {
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
	},

	// @DESC - Overwrite Order
	// SEC - MUST BE LOGGED IN
	updateOrder: async (req, res, next) => {
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
};
