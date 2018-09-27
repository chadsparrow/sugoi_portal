const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../helpers/auth");

// styles route to show all the styles in mongodb
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dashboard");
});

module.exports = router;
