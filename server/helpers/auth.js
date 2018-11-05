module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureAdmin: function(req, res, next) {
    if (req.user.admin == true) {
      return next();
    }
    logger.log("info", `${req.username} attempted admin`);
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureEditOrders: function(req, res, next) {
    if (req.user.editOrders == true) {
      return next();
    }
    logger.log("info", `${req.username} attempted editOrders`);
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureViewProd: function(req, res, next) {
    if (req.user.viewProd == true) {
      return next();
    }
    logger.log("info", `${req.username} attempted viewProd`);
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureEditProd: function(req, res, next) {
    if (req.user.editProd == true) {
      return next();
    }
    logger.log("info", `${req.username} attempted EditProd`);
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureEditProofs: function(req, res, next) {
    if (req.user.editProofs == true) {
      return next();
    }
    logger.log("info", `${req.username} attempted editProofs`);
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
};
