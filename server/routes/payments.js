const express = require('express');
const router = express.Router();

const {
	getAllPayments,
	getOutstanding,
	getOutstandingPreProd,
	getOutstandingProd,
	getOutstandingShipped,
	getPaymentsEditPage,
	updatePayment,
	getPaymentLogs
} = require('../controllers/payments');

const { ensureAuthenticated, ensureEditOrders } = require('../helpers/auth');

router.route('/').get(ensureAuthenticated, ensureEditOrders, getAllPayments);

router
	.route('/outstanding')
	.get(ensureAuthenticated, ensureEditOrders, getOutstanding);

router
	.route('/outstanding/preprod')
	.get(ensureAuthenticated, ensureEditOrders, getOutstandingPreProd);

router
	.route('/outstanding/prod')
	.get(ensureAuthenticated, ensureEditOrders, getOutstandingProd);

router
	.route('/outstanding/shipped')
	.get(ensureAuthenticated, ensureEditOrders, getOutstandingShipped);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureEditOrders, getPaymentsEditPage)
	.put(ensureAuthenticated, ensureEditOrders, updatePayment);

router
	.route('/logs/:id')
	.get(ensureAuthenticated, ensureEditOrders, getPaymentLogs);

module.exports = router;
