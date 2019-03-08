const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");
//const moment = require("moment-timezone");
let dayjs = require('dayjs');
dayjs.extend(AdvancedFormat);

const Report = require("../models/Report");

router.get("/", [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = dayjs().week();
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
