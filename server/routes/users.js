const express = require('express');
const router = express.Router();

const {
	getLoginForm,
	loginUser,
	getAdminPage,
	getUserEditPage,
	updateUser,
	deleteUser,
	getUserRegister,
	registerUser,
	logoutUser,
	getPasswordChangePage,
	updatePassword
} = require('../controllers/users');

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router
	.route('/login')
	.get(getLoginForm)
	.post(loginUser);

router.route('/admin/dash').get(ensureAuthenticated, ensureAdmin, getAdminPage);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureAdmin, getUserEditPage)
	.put(ensureAuthenticated, ensureAdmin, updateUser);

router.route('/delete/:id').get(ensureAuthenticated, ensureAdmin, deleteUser);

router
	.route('/register')
	.get(ensureAuthenticated, ensureAdmin, getUserRegister)
	.post(ensureAuthenticated, ensureAdmin, registerUser);

router.route('/logout').get(logoutUser);

router
	.route('/password')
	.get(ensureAuthenticated, getPasswordChangePage)
	.put(ensureAuthenticated, updatePassword);

module.exports = router;
