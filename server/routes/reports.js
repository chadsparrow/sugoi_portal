const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", ensureAuthenticated, (req, res) => {
  let averages;
  Report.aggregate([
    {
      $project: {
        proofAvg: {
          $trunc: [
            {
              $avg: "$proofTurnArounds"
            }
          ]
        },
        revisionAvg: {
          $trunc: [
            {
              $avg: "$revisionTurnArounds"
            }
          ]
        },
        outputAvg: {
          $trunc: [
            {
              $avg: "$outputTurnArounds"
            }
          ]
        }
      }
    }
  ]).then(function(res) {
    averages = res;
  });

  Report.find().then(reports => {
    res.render("reports/index", {
      reports,
      averages
    });
  });
});

module.exports = router;
