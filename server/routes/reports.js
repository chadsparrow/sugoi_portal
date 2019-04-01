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

router.get("/linechart", [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = moment(dayjs().format()).format("W");
  Report.find({})
    .sort({ reportWeekNumber: 1 })
    .then(reports => {
      res.render("reports/linechart", { reports });
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

// PRE-PRODUCTION REPORT
router.get("/preprod", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = "Pre-Production Report";
  Order.find({
    currentStatus: {
      $not: { $in: ["V. Sent to Vendor", "W. CANCELLED", "X. Archived"] }
    }
  }).then(orders => {
    let cadTotal = 0;
    let usdTotal = 0;

    for (let x = 0; x < orders.length; x++) {
      if (orders[x].netValue === null || orders[x].netValue === 0) {
        if (orders[x].currency === "CAD") {
          cadTotal += orders[x].estValue;
        } else if (orders[x].currency === "USD") {
          usdTotal += orders[x].estValue;
        }
      } else {
        if (orders[x].currency === "CAD") {
          cadTotal += orders[x].netValue;
        } else if (orders[x].currency === "USD") {
          usdTotal += orders[x].netValue;
        }
      }
    }
    cadTotal = cadTotal.toFixed(2);
    usdTotal = usdTotal.toFixed(2);

    res.render("reports/inprogress", {
      orders,
      pageTitle,
      cadTotal,
      usdTotal
    });
  });
});

// PRODUCTION REPORT
router.get("/production", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = "Production Report - Not Invoiced / Invoiced Today Only";
  Order.find({ $or: [{ jbaInvoiceNum: { $in: ["", null] }, currentStatus: "V. Sent to Vendor" }, { jbaInvoiceNum: { $nin: ["", null] }, currentStatus: "V. Sent to Vendor", jbaInvoiceDate: { $gte: dayjs().startOf('day'), $lte: dayjs().endOf('day') } }] })
    .then(orders => {
      let cadTotal = 0;
      let usdTotal = 0;

      for (let x = 0; x < orders.length; x++) {
        if (orders[x].currency === "CAD") {
          cadTotal += orders[x].netValue;
        } else if (orders[x].currency === "USD") {
          usdTotal += orders[x].netValue;
        }
      }

      cadTotal = cadTotal.toFixed(2);
      usdTotal = usdTotal.toFixed(2);

      res.render("reports/production", {
        orders,
        pageTitle,
        cadTotal,
        usdTotal
      });
    });
});

module.exports = router;
