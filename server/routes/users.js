const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');
const logger = require('../helpers/logs');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Form
router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/orders');
    return;
  }
  res.render('users/login');
});

// User Login POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/orders',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Admin Page
router.get('/admin/dash', [ensureAuthenticated, ensureAdmin], (req, res) => {
  res.render('admin/dash');
});

router.get('/edit/:id', [ensureAuthenticated, ensureAdmin], async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    res.render('admin/edit', { employee });
  } catch (err) {
    logger.error(err);
  }
});

router.put('/edit/:id', [ensureAuthenticated, ensureAdmin], async (req, res) => {
  try {
    let { admin, editOrders, editProofs, viewProd, editProd, lgUser } = req.body;

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
    logger.info(`${updatedEmployee.username} - updated by ${req.user.username}`);
    req.flash('success_msg', 'Employee Updated');
    res.redirect('/admin/users');
  } catch (err) {
    logger.error(err);
  }
});

router.get('/delete/:id', [ensureAuthenticated, ensureAdmin], async (req, res) => {
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
});

// User Register Form
router.get('/register', [ensureAuthenticated, ensureAdmin], (req, res) => {
  res.render('users/register');
});

// User Register Form POST
router.post('/register', [ensureAuthenticated, ensureAdmin], async (req, res) => {
  try {
    let { username, password, password2, admin, editOrders, editProofs, viewProd, editProd, lgUser } = req.body;
    username = username.toLowerCase();

    admin = admin ? true : false;
    editOrders = editOrders ? true : false;
    editProofs = editProofs ? true : false;
    viewProd = viewProd ? true : false;
    editProd = editProd ? true : false;
    lgUser = lgUser ? true : false;

    if (password.length < 8) {
      req.flash('error_msg', 'Password must be at least 8 characters.');
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
});

// Logout User
router.get('/logout', ensureAuthenticated, (req, res) => {
  logger.info(`${req.user.username} logged out.`);
  req.logout();
  req.flash('success_msg', 'Logged out');
  res.redirect('/users/login');
});

// User Password Form
router.get('/password', ensureAuthenticated, (req, res) => {
  res.render('users/password');
});

// User Password Post
router.put('/password', ensureAuthenticated, async (req, res) => {
  try {
    let pass = req.body.password;
    let pass2 = req.body.password2;
    let userName = req.body.username;

    if (pass.length < 5) {
      req.flash('error_msg', 'Password needs to be at least 8 characters');
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
});

module.exports = router;
