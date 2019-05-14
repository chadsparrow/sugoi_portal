const express = require("express");
const router = express.Router();
const logger = require("../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

router.get("/", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - All";
  Order.find({ currentStatus: { $nin: ["W. CANCELLED", "X. Archived", "1. Initial"] } }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

// GETS all orders with a balance outstanding but not Cancelled, Archived or Initial Status
router.get("/outstanding", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - Balance Outstanding";
  Order.find({ currentStatus: { $nin: ["W. CANCELLED", "X. Archived", "1. Initial"] }, paymentStatus: 'Balance Outstanding' }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

// GETS all orders with a balance outstanding in Pre-Production Status
router.get("/outstanding/preprod", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - Balance Outstanding - Pre-Production";
  Order.find({ currentStatus: { $in: ["A. Waiting for Proof", "B. Proof Started", "C. Proof - Waiting on Someone else", "D. Proof Ready for QC", "D-1. Proof QC in Progress", "E. Proof QC Complete", "F. Proof Complete", "G. Waiting for Revision", "H. Revision - Waiting on Someone else", "I. Revision Started", "J. Revision Ready for QC", "J-1. Revision QC in Progress", "K. Revision QC Complete", "L. Revision Complete"] }, paymentStatus: 'Balance Outstanding' }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

// GETS all orders with a balance outstanding in Production Status and not Shipped
router.get("/outstanding/prod", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - Balance Outstanding - In Production";
  Order.find({ currentStatus: { $in: ["M. Waiting for Output", "N. Output - Waiting on Someone else", "O. Output Started", "P. Output Ready for QC", "P-1. Output QC in Progress", "Q. Output QC Complete", "R. Waiting for PNT", "S. PNT Ready for QC", "S-1. PNT QC in Progress", "T. PNT QC Complete", "U. Uploaded", "V. Sent to Vendor"] }, paymentStatus: 'Balance Outstanding', shipStatus: { $ne: 'Shipped' } }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

// GETS all orders with a balance outstanding and shipped
router.get("/outstanding/shipped", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - Balance Outstanding - Shipped";
  Order.find({ shipStatus: 'Shipped', paymentStatus: 'Balance Outstanding' }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

router.get("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  const id = req.params.id;
  Order.findOne({ _id: id }).then(order => {
    res.render("payments/edit", {
      order
    });
  });
});

router.put("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
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

  Order.findOne({ _id: id }, function (err, foundOrder) {
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
      foundOrder.paymentNotes = paymentNotes;
      foundOrder.isrRefunded = isrRefunded;
      foundOrder.isrRefundedDate = isrRefundedDate;
      foundOrder.invoiceSent = invoiceSent;
      if (foundOrder.netValue != null || foundOrder.netValue != undefined) {
        let balanceOutstanding =
          foundOrder.netValue -
          onTermPayment -
          foundOrder.deposit -
          kitOrderPayment -
          isrCollectedOrig +
          isrRefunded;
        foundOrder.balanceOutstanding = parseFloat(balanceOutstanding).toFixed(
          2
        );
        if (foundOrder.balanceOutstanding > 0) {
          foundOrder.paymentStatus = "Balance Outstanding";
        } else if (foundOrder.balanceOutstanding == 0) {
          foundOrder.paymentStatus = "Complete";
        } else if (foundOrder.balanceOutstanding < 0) {
          foundOrder.paymentStatus = "Refund Customer";
        }
      }

      foundOrder.save(function (err, updatedOrder) {
        if (err) {
          logger.error(err);
          return;
        } else {
          logger.info(
            `${updatedOrder.orderNum} - Payment updated by ${req.user.username}`
          );
          req.flash("success_msg", "Payment Updated");
          res.redirect("/payments/");
        }
      });
    }
  });
});

module.exports = router;
