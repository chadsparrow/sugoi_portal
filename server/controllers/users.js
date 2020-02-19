const logger = require('../helpers/logs');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

module.exports = {
	// @desc    Get login page
	// @route   GET /users/login
	// @access  Public
	getLoginForm: (req, res, next) => {
		if (req.user) {
			return res.redirect('/orders');
		}
		res.render('users/login');
	},

	// @desc    Login a user
	// @route   POST /users/login
	// @access  Public
	loginUser: (req, res, next) => {
		passport.authenticate('local', {
			successRedirect: '/orders',
			failureRedirect: '/users/login',
			failureFlash: true
		})(req, res, next);
	},

	// @desc    Get the admin page
	// @route   GET /users/admin/dash
	// @access  Private - Admin role only
	getAdminPage: (req, res, next) => {
		res.render('admin/dash');
	},

	// @desc    Get the user edit page
	// @route   GET /users/edit/:id
	// @access  Private - Admin role only
	getUserEditPage: async (req, res, next) => {
		try {
			const employee = await User.findById(req.params.id);
			res.render('admin/edit', { employee });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Update a user
	// @route   PUT /users/edit/:id
	// @access  Private - Admin role only
	updateUser: async (req, res, next) => {
		try {
			let {
				admin,
				editOrders,
				editProofs,
				viewProd,
				editProd,
				lgUser
			} = req.body;

			admin = admin ? true : false;
			editOrders = editOrders ? true : false;
			editProofs = editProofs ? true : false;
			viewProd = viewProd ? true : false;
			editProd = editProd ? true : false;
			lgUser = lgUser ? true : false;

			let foundEmployee = await User.findOne({ _id: req.params.id });
			foundEmployee.admin = admin;
			foundEmployee.editOrders = editOrders;
			foundEmployee.editProofs = editProofs;
			foundEmployee.viewProd = viewProd;
			foundEmployee.editProd = editProd;
			foundEmployee.lgUser = lgUser;

			const updatedEmployee = await foundEmployee.save();
			logger.info(
				`${updatedEmployee.username} - updated by ${req.user.username}`
			);
			req.flash('success_msg', 'Employee Updated');
			res.redirect('/admin/users');
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Delete user
	// @route   GET /users/delete/:id
	// @access  Private - Admin role only
	deleteUser: async (req, res, next) => {
		try {
			await User.findOneAndDelete({ _id: req.params.id });
			logger.info(`User deleted by ${req.user.username}`);
			req.flash('success_msg', 'Employee Deleted');
			res.redirect('/admin/users');
		} catch (err) {
			logger.error(err);
			req.flash('error_msg', err);
			res.redirect('/admin/users');
		}
	},

	// @desc    Get user register form
	// @route   GET /users/register
	// @access  Private - Admin role only
	getUserRegister: (req, res, next) => {
		res.render('users/register');
	},

	// @desc    Register a user
	// @route   POST /users/register
	// @access  Private - Admin role only
	registerUser: async (req, res, next) => {
		try {
			let {
				username,
				password,
				password2,
				admin,
				editOrders,
				editProofs,
				viewProd,
				editProd,
				lgUser
			} = req.body;
			username = username.toLowerCase();

			admin = admin ? true : false;
			editOrders = editOrders ? true : false;
			editProofs = editProofs ? true : false;
			viewProd = viewProd ? true : false;
			editProd = editProd ? true : false;
			lgUser = lgUser ? true : false;

			if (password.length < 5) {
				req.flash('error_msg', 'Password must be at least 5 characters.');
				return res.redirect('/users/register');
			}

			if (password !== password2) {
				req.flash('error_msg', 'Passwords need to match');
				return res.redirect('/users/register');
			}

			let user = await User.findOne({ username });
			if (user) {
				req.flash('error_msg', 'User already registered');
				return res.redirect('/users/register');
			}

			const newUser = new User({
				username,
				admin,
				editOrders,
				editProofs,
				viewProd,
				editProd,
				lgUser
			});

			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			newUser.password = hash;
			await newUser.save();
			logger.info(`${newUser.username} - created by ${req.user.username}`);
			req.flash('success_msg', 'User registered.');
			res.redirect('/admin/users');
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Logout a user
	// @route   POST /users/logout
	// @access  Public
	logoutUser: (req, res, next) => {
		logger.info(`${req.user.username} logged out.`);
		req.logout();
		req.flash('success_msg', 'Logged out');
		res.redirect('/users/login');
	},

	// @desc    Get user password modify page
	// @route   GET /users/password
	// @access  Private
	getPasswordChangePage: (req, res, next) => {
		res.render('users/password');
	},

	// @desc    Update user password
	// @route   PUT /users/password
	// @access  Private
	updatePassword: async (req, res, next) => {
		try {
			let pass = req.body.password;
			let pass2 = req.body.password2;
			let userName = req.body.username;

			if (pass.length < 5) {
				req.flash('error_msg', 'Password needs to be at least 5 characters');
				return res.redirect('/users/password');
			}

			if (pass !== pass2) {
				req.flash('error_msg', 'Password fields need to match');
				return res.redirect('/users/password');
			}

			let foundUser = await User.findOne({ username: userName });

			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(pass, salt);

			foundUser.password = hash;
			await foundUser.save();

			req.flash('success_msg', 'Password Changed');
			res.redirect('/orders');
		} catch (err) {
			logger.error(err);
		}
	}
};
