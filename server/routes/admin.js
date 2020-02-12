const express = require('express');
const router = express.Router();

const {
	getAdminDashboard,
	getStylesDashboard,
	getUsersDashboard
} = require('../controllers/admin');

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router.route('/dash').get(ensureAuthenticated, ensureAdmin, getAdminDashboard);

router
	.route('/styles')
	.get(ensureAuthenticated, ensureAdmin, getStylesDashboard);

router.route('/users').get(ensureAuthenticated, ensureAdmin, getUsersDashboard);

module.exports = router;
