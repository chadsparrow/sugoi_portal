module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	},
	ensureAdmin: function(req, res, next) {
		if (req.user.admin == true) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	},
	ensureEditOrders: function(req, res, next) {
		if (req.user.editOrders == true) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	},
	ensureViewProd: function(req, res, next) {
		if (req.user.viewProd == true) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	},
	ensureEditProd: function(req, res, next) {
		if (req.user.editProd == true) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	},
	ensureEditProofs: function(req, res, next) {
		if (req.user.editProofs == true) {
			return next();
		}
		req.flash('error_msg', 'Not Authorized');
		res.redirect('/users/login');
	}
};
