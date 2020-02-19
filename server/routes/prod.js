const express = require('express');
const router = express.Router();
const prodController = require('../controllers/prod');

const {
	ensureAuthenticated,
	ensureViewProd,
	ensureEditProd
} = require('../helpers/auth');

router
	.route('/')
	.get(ensureAuthenticated, ensureViewProd, prodController.getProdOrders);

router
	.route('/open')
	.get(ensureAuthenticated, ensureViewProd, prodController.getProdOpenOrders);

router
	.route('/pending')
	.get(
		ensureAuthenticated,
		ensureViewProd,
		prodController.getProdPendingOrders
	);

router
	.route('/cancelled')
	.get(
		ensureAuthenticated,
		ensureViewProd,
		prodController.getProdCancelledOrders
	);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureEditProd, prodController.getProdEditPage)
	.put(ensureAuthenticated, ensureEditProd, prodController.updateProdOrder);

module.exports = router;
