const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");
const logger = require("../helpers/logs");

// Load User Model
require("../models/User");
const User = mongoose.model("users");

// User Login Form
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/login/:userName/:key", (req, res) => {
  const userName = req.params.userName;
  const key = req.params.key;
  res.render("users/loginwparams", {
    key,
    userName
  });
});

// User Login POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/orders",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//User Admin Page
router.get("/admin", [ensureAuthenticated, ensureAdmin], (req, res) => {
  User.find()
    .sort([["username", "asc"]])
    .then(employees => {
      res.render("users/admin", {
        employees
      });
    })
    .catch(err => {
      logger.error(err);
      req.flash("error_msg", err);
      res.redirect("/orders");
    });
});

router.get("/edit/:id", [ensureAuthenticated, ensureAdmin], (req, res) => {
  User.findOne({
    _id: req.params.id
  }).then(employee => {
    res.render("users/edit", {
      employee
    });
  });
});

router.put("/edit/:id", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let id = req.params.id;
  let admin;
  let editOrders;
  let editProofs;
  let viewProd;
  let editProd;

  if (req.body.admin) {
    admin = true;
  } else {
    admin = false;
  }

  if (req.body.editOrders) {
    editOrders = true;
  } else {
    editOrders = false;
  }

  if (req.body.editProofs) {
    editProofs = true;
  } else {
    editProofs = false;
  }

  if (req.body.viewProd) {
    viewProd = true;
  } else {
    viewProd = false;
  }

  if (req.body.editProd) {
    editProd = true;
  } else {
    editProd = false;
  }

  User.findOne({ _id: id }, function (err, foundEmployee) {
    if (err) {
      logger.error(err);
      return;
    } else {
      foundEmployee.admin = admin;
      foundEmployee.editOrders = editOrders;
      foundEmployee.editProofs = editProofs;
      foundEmployee.viewProd = viewProd;
      foundEmployee.editProd = editProd;

      foundEmployee.save(function (err, updatedEmployee) {
        if (err) {
          logger.error(err);
          return;
        } else {
          logger.info(`${updatedEmployee} - updated by ${req.user.username}`);
          req.flash("success_msg", "Employee Updated");
          res.redirect("/users/admin");
        }
      });
    }
  });
});

router.get("/delete/:id", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let id = req.params.id;
  User.findOneAndRemove({ _id: id }, function (err) {
    if (err) {
      logger.error(err);
      req.flash("error_msg", err);
      res.redirect("/users/admin");
    } else {
      logger.info(`User deleted by ${req.user.username}`);
      req.flash("success_msg", "Employee Deleted");
      res.redirect("/users/admin");
    }
  });
});

// User Register Form
router.get("/register", [ensureAuthenticated, ensureAdmin], (req, res) => {
  res.render("users/register");
});

// User Register Form POST
router.post("/register", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let userName = req.body.username;
  userName = userName.toLowerCase();

  let admin;
  let editOrders;
  let editProofs;
  let viewProd;
  let editProd;

  if (req.body.admin) {
    admin = true;
  } else {
    admin = false;
  }

  if (req.body.editOrders) {
    editOrders = true;
  } else {
    editOrders = false;
  }

  if (req.body.editProofs) {
    editProofs = true;
  } else {
    editProofs = false;
  }

  if (req.body.viewProd) {
    viewProd = true;
  } else {
    viewProd = false;
  }

  if (req.body.editProd) {
    editProd = true;
  } else {
    editProd = false;
  }

  if (req.body.password.length < 8) {
    req.flash("error_msg", "Password needs to be at least 8 characters");
    res.redirect("/users/register");
  } else if (req.body.password !== req.body.password2) {
    req.flash("error_msg", "Password needs to match");
    res.redirect("/users/register");
  } else {
    User.findOne({ username: userName }, function (err, user) {
      if (user) {
        req.flash("error_msg", "User already registered");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          username: userName,
          password: req.body.password,
          admin: admin,
          editOrders: editOrders,
          editProofs: editProofs,
          viewProd: viewProd,
          editProd: editProd
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                logger.info(
                  `${user.username} - user created by ${req.user.username}`
                );
                req.flash("success_msg", "User registered");
                res.redirect("/users/admin");
              })
              .catch(err => {
                logger.error(err);
              });
          });
        });
      }
    });
  }
});

// Logout User
router.get("/logout", ensureAuthenticated, (req, res) => {
  logger.info(`${req.user.username} logged out.`);
  req.logout();
  req.flash("success_msg", "Logged out");
  res.redirect("/users/login");
});

// User Password Form
router.get("/password", ensureAuthenticated, (req, res) => {
  res.render("users/password");
});

// User Password Post
router.put("/password", ensureAuthenticated, (req, res) => {
  let pass = req.body.password;
  let pass2 = req.body.password2;
  let userName = req.body.username;

  if (pass.length < 5) {
    req.flash("error_msg", "Password needs to be at least 8 characters");
    res.redirect("/users/password");
  } else if (pass !== pass2) {
    req.flash("error_msg", "Password fields need to match");
    res.redirect("/users/password");
  } else {
    User.findOne({ username: userName }, function (err, foundObject) {
      if (err) {
        logger.error(err);
        return;
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (err) {
            logger.error(err);
            return;
          }
          foundObject.password = hash;
          foundObject
            .save()
            .then(user => {
              req.flash("success_msg", "Password Updated");
              res.redirect("/orders/");
            })
            .catch(err => {
              logger.error(err);
            });
        });
      });
    });
  }
});

module.exports = router;
