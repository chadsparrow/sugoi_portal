const express = require('express');
const router = express.Router();

const {
	getProdOrders,
	getProdOpenOrders,
	getProdPendingOrders,
	getProdCancelledOrders,
	getProdEditPage,
	updateProdOrder
} = require('../controllers/prod');

const {
	ensureAuthenticated,
	ensureViewProd,
	ensureEditProd
} = require('../helpers/auth');

router.route('/').get(ensureAuthenticated, ensureViewProd, getProdOrders);

router
	.route('/open')
	.get(ensureAuthenticated, ensureViewProd, getProdOpenOrders);

router
	.route('/pending')
	.get(ensureAuthenticated, ensureViewProd, getProdPendingOrders);

router
	.route('/cancelled')
	.get(ensureAuthenticated, ensureViewProd, getProdCancelledOrders);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureEditProd, getProdEditPage)
	.put(ensureAuthenticated, ensureEditProd, updateProdOrder);

module.exports = router;
