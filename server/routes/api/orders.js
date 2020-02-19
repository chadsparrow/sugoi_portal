const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/api/orders');
const { ensureAuthenticated, ensureEditOrders } = require('../../helpers/auth');

// includes model for mongodb
const Order = require('../../models/Order');

router
	.route('/:orderNum')
	.get(ensureAuthenticated, ordersController.getOrder)
	.put(ensureAuthenticated, ensureEditOrders, ordersController.updateOrder);

router
	.route('/:orderNum/:lineNumber')
	.put(ensureAuthenticated, ensureEditOrders, ordersController.addLineToOrder);

router
	.route('/:orderNum/:lineNumber/:itemNumber')
	.put(ensureAuthenticated, ensureEditOrders, ordersController.addItemToLine);

module.exports = router;
