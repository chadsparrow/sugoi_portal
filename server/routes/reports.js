const express = require('express');
const router = express.Router();
const {
	getReport,
	getItemsSold,
	getLineChart,
	getWeekReport,
	getPreProdReport,
	getProductionReport
} = require('../controllers/reports');

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router.route('/').get(ensureAuthenticated, ensureAdmin, getReport);

router.route('/items').get(ensureAuthenticated, ensureAdmin, getItemsSold);

router.route('/linechart').get(ensureAuthenticated, ensureAdmin, getLineChart);

router
	.route('/week/:weekNum')
	.get(ensureAuthenticated, ensureAdmin, getWeekReport);

router
	.route('/preprod')
	.get(ensureAuthenticated, ensureAdmin, getPreProdReport);

router
	.route('/production')
	.get(ensureAuthenticated, ensureAdmin, getProductionReport);

module.exports = router;
