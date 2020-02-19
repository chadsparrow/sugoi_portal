const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router
	.route('/dash')
	.get(ensureAuthenticated, ensureAdmin, adminController.getAdminDashboard);

router
	.route('/styles')
	.get(ensureAuthenticated, ensureAdmin, adminController.getStylesDashboard);

router
	.route('/users')
	.get(ensureAuthenticated, ensureAdmin, adminController.getUsersDashboard);

module.exports = router;
