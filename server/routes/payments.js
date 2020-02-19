const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');

const { ensureAuthenticated, ensureEditOrders } = require('../helpers/auth');

router
	.route('/')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getAllPayments
	);

router
	.route('/outstanding')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getOutstanding
	);

router
	.route('/outstanding/preprod')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getOutstandingPreProd
	);

router
	.route('/outstanding/prod')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getOutstandingProd
	);

router
	.route('/outstanding/shipped')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getOutstandingShipped
	);

router
	.route('/edit/:id')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getPaymentsEditPage
	)
	.put(ensureAuthenticated, ensureEditOrders, paymentsController.updatePayment);

router
	.route('/logs/:id')
	.get(
		ensureAuthenticated,
		ensureEditOrders,
		paymentsController.getPaymentLogs
	);

module.exports = router;
