const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../helpers/auth');
const moment = require('moment');
const dayjs = require('dayjs');

const Report = require('../models/Report');
const Order = require('../models/Order');

router.get('/', [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = moment(dayjs().format()).format('W');
  Report.find({})
    .sort({ reportYear: -1, reportWeekNumber: -1 })
    .then(reports => {
      Report.findOne({ reportWeekNumber: currentWeekNum }).then(report => {
        res.render('reports/index', {
          reports,
          report
        });
      });
    });
});

router.get('/items', [ensureAuthenticated, ensureAdmin], async (req, res) => {
  const pageTitle = 'Items Sold';
  let itemsOrdered = {};
  try {
    const orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });

    for (order of orders) {
      let orderLines = order.orderLines;
      for (orderLine of orderLines) {
        let items = orderLine.items;
        for (item of items) {
          if (item.extendedDescription && !item.cancelled) {
            if (item.extendedDescription in itemsOrdered) {
              itemsOrdered[item.extendedDescription] += item.totalUnits;
            } else {
              itemsOrdered[item.extendedDescription] = item.totalUnits;
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.render('reports/items', { itemsOrdered, pageTitle });
});

router.get('/qd', [ensureAuthenticated, ensureAdmin], async (req, res) => {
  const pageTitle = 'Quick Design';
  let itemsOrdered = {};
  try {
    const orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });

    for (order of orders) {
      let orderLines = order.orderLines;
      for (orderLine of orderLines) {
        if (orderLine.graphicCode != 'CUSTM' && orderLine.colourWayCode != 'SUB' && !orderLine.cancelled) {
          let items = orderLine.items;
          for (item of items) {
            if (`${orderLine.graphicCode} - ${orderLine.colourWayCode}` in itemsOrdered) {
              itemsOrdered[`${orderLine.graphicCode} - ${orderLine.colourWayCode}`] += item.totalUnits;
            } else {
              itemsOrdered[`${orderLine.graphicCode} - ${orderLine.colourWayCode}`] = item.totalUnits;
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.render('reports/qd', { itemsOrdered, pageTitle });
});

router.get('/linechart/', [ensureAuthenticated, ensureAdmin], (req, res) => {
  const currentWeekNum = moment(dayjs().format()).format('W');
  Report.find({ reportYear: 2019 })
    .sort({ reportWeekNumber: 1 })
    .then(reports => {
      let proofsCompleted = [];
      let revisionsCompleted = [];
      let outputCompleted = [];
      let weekNumbers = [];
      let avgProofs = [];
      let avgRevisions = [];
      let avgOutput = [];

      for (report of reports) {
        proofsCompleted.push(report.proofsCompleted);
        revisionsCompleted.push(report.revisionsCompleted);
        outputCompleted.push(report.outputCompleted);
        weekNumbers.push(report.reportWeekNumber);
        avgProofs.push(report.avgProofs);
        avgRevisions.push(report.avgRevisions);
        avgOutput.push(report.avgOutput);
      }
      res.render('reports/linechart', { proofsCompleted, revisionsCompleted, outputCompleted, weekNumbers, avgProofs, avgRevisions, avgOutput });
    });
});

router.get('/week/:weekNum', [ensureAuthenticated, ensureAdmin], (req, res) => {
  const weekNum = req.params.weekNum;
  Report.find()
    .sort({ reportWeekNumber: -1 })
    .then(reports => {
      Report.findOne({ reportWeekNumber: weekNum }).then(report => {
        res.render('reports/index', {
          reports,
          report
        });
      });
    });
});

// PRE-PRODUCTION REPORT
router.get('/preprod', [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = 'Pre-Production Report';
  Order.find({
    currentStatus: {
      $not: { $in: ['V. Sent to Vendor', 'W. CANCELLED', 'X. Archived'] }
    }
  })
    .then(orders => {
      let cadTotal = 0;
      let usdTotal = 0;

      for (order of orders) {
        if (order.netValue) {
          if (order.currency === 'CAD') {
            cadTotal += order.netValue;
          } else {
            usdTotal += order.netValue;
          }
        } else {
          if (order.estValue) {
            if (order.currency === 'CAD') {
              cadTotal += order.estValue;
            } else {
              usdTotal += order.estValue;
            }
          }
        }
      }

      // for (let x = 0; x < orders.length; x++) {
      //   if (orders[x].netValue === null || orders[x].netValue === 0) {
      //     if (orders[x].currency === "CAD") {
      //       cadTotal += orders[x].estValue;
      //     } else if (orders[x].currency === "USD") {
      //       usdTotal += orders[x].estValue;
      //     }
      //   } else {
      //     if (orders[x].currency === "CAD") {
      //       cadTotal += orders[x].netValue;
      //     } else if (orders[x].currency === "USD") {
      //       usdTotal += orders[x].netValue;
      //     }
      //   }
      // }

      res.render('reports/inprogress', {
        orders,
        pageTitle,
        cadTotal,
        usdTotal
      });
    })
    .catch(err => console.log(err));
});

// PRODUCTION REPORT
router.get('/production', [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = 'Production Report - Not Invoiced / Invoiced Today Only';
  Order.find({
    $or: [
      { jbaInvoiceNum: { $in: ['', null] }, currentStatus: 'V. Sent to Vendor' },
      {
        jbaInvoiceNum: { $nin: ['', null] },
        currentStatus: 'V. Sent to Vendor',
        jbaInvoiceDate: { $gte: dayjs().startOf('day'), $lte: dayjs().endOf('day') }
      }
    ]
  })
    .then(orders => {
      let cadTotal = 0;
      let usdTotal = 0;

      for (order of orders) {
        if (order.netValue) {
          if (order.currency === 'CAD') {
            cadTotal += order.netValue;
          } else {
            usdTotal += order.netValue;
          }
        }
      }

      // for (let x = 0; x < orders.length; x++) {
      //   if (orders[x].currency === "CAD") {
      //     cadTotal += orders[x].netValue;
      //   } else if (orders[x].currency === "USD") {
      //     usdTotal += orders[x].netValue;
      //   }
      // }

      res.render('reports/production', {
        orders,
        pageTitle,
        cadTotal,
        usdTotal
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
