const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router
	.route('/')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getReport);

router
	.route('/items')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getItemsSold);

router
	.route('/linechart')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getLineChart);

router
	.route('/week/:weekNum')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getWeekReport);

router
	.route('/preprod')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getPreProdReport);

router
	.route('/production')
	.get(ensureAuthenticated, ensureAdmin, reportsController.getProductionReport);

module.exports = router;
