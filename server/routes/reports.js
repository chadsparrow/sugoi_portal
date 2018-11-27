const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", (req, res) => {
  let averages;
  Report.aggregate([
    {
      $project: {
        proofAvg: { $avg: "$proofTurnArounds" },
        revisionAvg: { $avg: "$revisionTurnArounds" },
        outputAvg: { $avg: "$outputTurnArounds" },
        truncproofAvg: { $trunc: "$proofAvg" },
        truncrevisionAvg: { $trunc: "$revisionAvg" },
        truncoutputAvg: { $trunc: "$outputAvg" }
      }
    }
  ]).then(function(res) {
    averages = res;
  });

  Report.find().then(reports => {
    console.log(averages);
    res.render("reports/index", {
      reports,
      averages
    });
  });
});

module.exports = router;
