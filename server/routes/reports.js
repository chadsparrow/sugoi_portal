const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const moment = require("moment-timezone");

const Report = require("../models/Report");

router.get("/", ensureAuthenticated, (req, res) => {
  const currentWeekNum = moment()
    .tz("America/Vancouver")
    .format("W");
  Report.findOne({ reportWeekNumber: currentWeekNum }).then(report => {
    res.render("reports/index", {
      report
    });
  });
});

router.get("/week/:weekNum", ensureAuthenticated, (req, res) => {
  const weekNum = req.params.weekNum;
  Report.findOne({ reportWeekNumber: weekNum }).then(report => {
    res.render("reports/index", {
      report
    });
  });
});

module.exports = router;
