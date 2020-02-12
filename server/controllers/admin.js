const logger = require('../helpers/logs');
const User = require('../models/User');
const Style = require('../models/Style');

// @desc    Gets Admin Dashboard
// @route   GET /admin/dash
// @access  Private - Admin Role
exports.getAdminDashboard = (req, res, next) => {
	res.render('admin/dash');
};

// @desc    Gets Styles Table Page
// @route   GET /admin/styles
// @access  Private - Admin Role
exports.getStylesDashboard = async (req, res, next) => {
	try {
		const styles = await Style.find();
		res.render('admin/styles', { styles });
	} catch (err) {
		logger.error(err);
		req.flash('error_msg', err);
		res.redirect('/admin/dash');
	}
};

// @desc    Gets Users Table Page
// @route   GET /admin/users
// @access  Private - Admin Role
exports.getUsersDashboard = async (req, res, next) => {
	try {
		const employees = await User.find().sort({ username: 1 });
		res.render('admin/users', { employees });
	} catch (err) {
		logger.error(err);
		req.flash('error_msg', err);
		res.redirect('/orders');
	}
};
