module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensureAdmin: function(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.admin == true) {
        return next();
      }
    }
    req.flash("error_msg", "Admins only");
    res.redirect("/users/login");
  }
};
