const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", ensureAuthenticated, (req, res) => {
  Report.find().then(reports => {
    res.render("reports/index", {
      reports
    });
  });
});

module.exports = router;
