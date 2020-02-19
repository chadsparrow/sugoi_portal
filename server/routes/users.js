const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');

router
	.route('/login')
	.get(usersController.getLoginForm)
	.post(usersController.loginUser);

router
	.route('/admin/dash')
	.get(ensureAuthenticated, ensureAdmin, usersController.getAdminPage);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureAdmin, usersController.getUserEditPage)
	.put(ensureAuthenticated, ensureAdmin, usersController.updateUser);

router
	.route('/delete/:id')
	.get(ensureAuthenticated, ensureAdmin, usersController.deleteUser);

router
	.route('/register')
	.get(ensureAuthenticated, ensureAdmin, usersController.getUserRegister)
	.post(ensureAuthenticated, ensureAdmin, usersController.registerUser);

router.route('/logout').get(usersController.logoutUser);

router
	.route('/password')
	.get(ensureAuthenticated, usersController.getPasswordChangePage)
	.put(ensureAuthenticated, usersController.updatePassword);

module.exports = router;
