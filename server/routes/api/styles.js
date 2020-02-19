const express = require('express');
const router = express.Router();
const stylesController = require('../../controllers/api/styles');

const { ensureAuthenticated } = require('../../helpers/auth');

router.route('/').get(ensureAuthenticated, stylesController.getAllStyles);

router
	.route('/sg2019')
	.get(ensureAuthenticated, stylesController.getSugoi2019Pricing);

router
	.route('/sg2020')
	.get(ensureAuthenticated, stylesController.getSugoi2020Pricing);

router.route('/lg').get(ensureAuthenticated, stylesController.getLGStyles);

router
	.route('/lg2019')
	.get(ensureAuthenticated, stylesController.getLG2019Pricing);

router
	.route('/lg2020')
	.get(ensureAuthenticated, stylesController.getLG2020Pricing);

module.exports = router;
