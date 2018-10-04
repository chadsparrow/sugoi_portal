const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

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

  if (req.body.editProd) {
    editProd = true;
  } else {
    editProd = false;
  }

  if (req.body.password.length < 8) {
    req.flash("error_msg", "Password needs to be at least 8 characters");
    res.render("users/register");
  } else {
    User.findOne({ username: userName }, function(err, user) {
      if (user) {
        req.flash("error_msg", "User already registered!");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          username: userName,
          password: req.body.password,
          admin: admin,
          editOrders: editOrders,
          editProofs: editProofs,
          editProd: editProd
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "User registered!");
                res.redirect("/users/register");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout User
router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/users/login");
});

// User Password Form
router.get("/password", ensureAuthenticated, (req, res) => {
  res.render("users/password");
});

// User Password Post
router.put("/password", ensureAuthenticated, (req, res) => {
  let pass = req.body.password;
  let userName = req.body.username;

  if (pass.length < 8) {
    req.flash("error_msg", "Password needs to be at least 8 characters");
    res.redirect("/users/password");
  } else {
    User.findOne({ username: userName }, function(err, foundObject) {
      if (err) throw err;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (err) throw err;
          foundObject.password = hash;
          foundObject.username = userName;
          foundObject
            .save()
            .then(user => {
              req.flash("success_msg", "Password Updated");
              res.redirect("/orders/");
            })
            .catch(err => {
              console.log(err);
              return;
            });
        });
      });
    });
  }
});

module.exports = router;
