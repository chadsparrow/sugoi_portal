const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");
const moment = require("moment-timezone");
const dayjs = require('dayjs');

const Report = require("../models/Report");

router.get("/", [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = moment(dayjs()).format("W");
  Report.find({})
    .sort({ reportWeekNumber: -1 })
    .then(reports => {
      Report.findOne({ reportWeekNumber: currentWeekNum }).then(report => {
        res.render("reports/index", {
          reports,
          report
        });
      });
    });
});

router.get("/week/:weekNum", [ensureAuthenticated, ensureAdmin], (req, res) => {
  const weekNum = req.params.weekNum;
  Report.find()
    .sort({ reportWeekNumber: -1 })
    .then(reports => {
      Report.findOne({ reportWeekNumber: weekNum }).then(report => {
        res.render("reports/index", {
          reports,
          report
        });
      });
    });
});

module.exports = router;
