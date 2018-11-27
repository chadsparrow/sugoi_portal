const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", (req, res) => {
  Report.find().then(reports => {
    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
    const result = average(reports[0].proofsCompleted);
    //res.render("reports/index", {});
    res.send(result);
  });
});

module.exports = router;
