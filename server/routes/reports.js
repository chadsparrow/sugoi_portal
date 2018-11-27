const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", (req, res) => {
  Report.find().then(reports => {
    reports.forEach((report, index) => {
      const avgProofs = getAvg(report.proofTurnArounds);
      report = { avgProofs: avgProofs, ...report };
    });
    // res.render("reports/index", {
    //   reports
    // });
    res.json(reports);
  });
});

function getAvg(turnArounds) {
  return (
    turnArounds.reduce(function(p, c) {
      return p + c;
    }) / turnArounds.length
  );
}

module.exports = router;
