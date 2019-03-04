const express = require("express");
const router = express.Router();

// User Login Form
router.get("/", (req, res) => {
  res.render("users/login");
});

module.exports = router;
