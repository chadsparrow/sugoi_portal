const express = require('express');
const router = express.Router();
const logger = require('../helpers/logs');
const dayjs = require('dayjs');

const { ensureAuthenticated, ensureEditOrders } = require('../helpers/auth');

// includes model for mongodb
const Order = require('../models/Order');

router.get('/', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    let pageTitle = 'Payments - All';
    const orders = await Order.find({ currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] } });
    res.render('payments/', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// GETS all orders with a balance outstanding but not Cancelled, Archived or Initial Status
router.get('/outstanding', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    let pageTitle = 'Payments - Balance Outstanding';
    const orders = await Order.find({
      currentStatus: { $nin: ['W. CANCELLED', 'X. Archived', '1. Initial'] },
      paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] }
    });
    res.render('payments/', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// GETS all orders with a balance outstanding in Pre-Production Status
router.get('/outstanding/preprod', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    let pageTitle = 'Payments - Balance Outstanding - Pre-Production';
    const orders = await Order.find({
      currentStatus: {
        $in: [
          'A. Waiting for Proof',
          'B. Proof Started',
          'C. Proof - Waiting on Someone else',
          'D. Proof Ready for QC',
          'D-1. Proof QC in Progress',
          'E. Proof QC Complete',
          'F. Proof Complete',
          'G. Waiting for Revision',
          'H. Revision - Waiting on Someone else',
          'I. Revision Started',
          'J. Revision Ready for QC',
          'J-1. Revision QC in Progress',
          'K. Revision QC Complete',
          'L. Revision Complete'
        ]
      },
      paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] }
    });
    res.render('payments/', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// GETS all orders with a balance outstanding in Production Status and not Shipped
router.get('/outstanding/prod', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    let pageTitle = 'Payments - Balance Outstanding - In Production';
    const orders = await Order.find({
      currentStatus: {
        $in: [
          'M. Waiting for Output',
          'N. Output - Waiting on Someone else',
          'O. Output Started',
          'P. Output Ready for QC',
          'P-1. Output QC in Progress',
          'Q. Output QC Complete',
          'R. Waiting for PNT',
          'S. PNT Ready for QC',
          'S-1. PNT QC in Progress',
          'T. PNT QC Complete',
          'U. Uploaded',
          'V. Sent to Vendor'
        ]
      },
      paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] },
      shipStatus: { $ne: 'Shipped' }
    });
    res.render('payments/', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// GETS all orders with a balance outstanding and shipped
router.get('/outstanding/shipped', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    let pageTitle = 'Payments - Balance Outstanding - Shipped';
    const orders = await Order.find({ shipStatus: 'Shipped', paymentStatus: { $in: ['Balance Outstanding', 'Refund Customer'] } });
    res.render('payments/', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

router.get('/edit/:id', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    res.render('payments/edit', { order });
  } catch (err) {
    logger.error(err);
  }
});

router.get('/logs/:id', [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    let logs = [];
    const { paymentNotes, paymentNotesDate } = order;
    if (order.paymentNotesLog) {
      logs = order.paymentNotesLog.reverse();
    }
    res.render('payments/logs', { logs, paymentNotes, paymentNotesDate });
  } catch (err) {
    logger.error(err);
  }
});

router.put('/edit/:id', [ensureAuthenticated, ensureEditOrders], (req, res) => {
  const id = req.params.id;
  let {
    approvedTerms,
    onTermPayment,
    kitOrderPayment,
    isrCollectedOrig,
    isrPaymentDate,
    isrPaymentType,
    paymentNotes,
    isrRefunded,
    isrRefundedDate,
    invoiceSent
  } = req.body;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      logger.error(err);
      return;
    } else {
      foundOrder.approvedTerms = approvedTerms;
      foundOrder.onTermPayment = onTermPayment;
      foundOrder.kitOrderPayment = kitOrderPayment;
      foundOrder.isrCollectedOrig = isrCollectedOrig;
      foundOrder.isrPaymentDate = isrPaymentDate;
      foundOrder.isrPaymentType = isrPaymentType;

      if (paymentNotes != foundOrder.paymentNotes) {
        if (!foundOrder.paymentNotesLog) {
          foundOrder.paymentNotesLog = [];
        }
        let currentDate = dayjs().format();
        foundOrder.paymentNotesLog.push({ note: foundOrder.paymentNotes, date: foundOrder.paymentNotesDate });
        foundOrder.paymentNotes = paymentNotes;
        foundOrder.paymentNotesDate = currentDate;
      }

      foundOrder.isrRefunded = isrRefunded;
      foundOrder.isrRefundedDate = isrRefundedDate;
      foundOrder.invoiceSent = invoiceSent;
      if (foundOrder.netValue != null || foundOrder.netValue != undefined) {
        let balanceOutstanding =
          foundOrder.netValue -
          foundOrder.onTermPayment -
          foundOrder.deposit -
          foundOrder.kitOrderPayment -
          foundOrder.isrCollectedOrig +
          foundOrder.isrRefunded;
        foundOrder.balanceOutstanding = balanceOutstanding;
        if (foundOrder.balanceOutstanding > 0) {
          foundOrder.paymentStatus = 'Balance Outstanding';
        } else if (foundOrder.balanceOutstanding == 0) {
          foundOrder.paymentStatus = 'Complete';
        } else if (foundOrder.balanceOutstanding < 0) {
          foundOrder.paymentStatus = 'Refund Customer';
        }
      }

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          logger.error(err);
          return;
        } else {
          logger.info(`${updatedOrder.orderNum} - Payment updated by ${req.user.username}`);
          req.flash('success_msg', 'Payment Updated');
          res.redirect('/payments/outstanding');
        }
      });
    }
  });
});

module.exports = router;
