const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const moment = require("moment-timezone");

const Report = require("../models/Report");

router.get("/", ensureAuthenticated, (req, res) => {
  const currentWeekNum = moment()
    .tz("America/Vancouver")
    .format("W");
  Report.find().then(reports => {
    Report.findOne({ reportWeekNumber: currentWeekNum }).then(report => {
      res.render("reports/index", {
        reports,
        report
      });
    });
  });
});

router.get("/week/:weekNum", ensureAuthenticated, (req, res) => {
  const weekNum = req.params.weekNum;
  Report.find().then(reports => {
    Report.findOne({ reportWeekNumber: weekNum }).then(report => {
      res.render("reports/index", {
        reports,
        report
      });
    });
  });
});

module.exports = router;
