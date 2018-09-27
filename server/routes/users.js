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

// User Login POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// User Register Form
router.get("/register", ensureAdmin, (req, res) => {
  res.render("users/register");
});

// User Register Form POST
router.post("/register", ensureAdmin, (req, res) => {
  let userName = req.body.username;
  userName = userName.toLowerCase();

  if (req.body.password.length < 6) {
    req.flash("error_msg", "Password needs to be at least 6 characters");
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
          role: req.body.role
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

module.exports = router;
