const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// User Login Form
router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/orders');
});

module.exports = router;
