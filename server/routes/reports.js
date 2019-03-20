const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");
const moment = require("moment");
const dayjs = require('dayjs');

const Report = require("../models/Report");
const Order = require("../models/Order");

router.get("/", [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = moment(dayjs().format()).format("W");
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

router.get("/cad", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = "Reports CAD - In Progress";
  Order.find({ signedOffDate: { $type: 10 }, currency: "CAD" }).then(orders => {
    res.render("reports/inprogress", {
      orders,
      pageTitle
    });
  });
});

router.get("/usd", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = "Reports USD - In Progress";
  Order.find({ signedOffDate: { $type: 10 }, currency: "USD" }).then(orders => {
    res.render("reports/inprogress", {
      orders,
      pageTitle
    });
  });
});

module.exports = router;
