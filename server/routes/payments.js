const express = require("express");
const router = express.Router();
const logger = require("../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

router.get("/", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - All";
  Order.find({ currentStatus: { $nin: ["W. CANCELLED", "X. Archived", "1. Initial"] }, paymentStatus: { $ne: 'Complete' } }).then(orders => {
    res.render("payments/", {
      orders,
      pageTitle
    });
  });
});

// router.get("/signedoff", [ensureAuthenticated, ensureEditOrders], (req, res) => {
//   let pageTitle = "Payments - Signed Off";
//   let signedOff = ["M. Waiting for Output", "N. Output - Waiting on Someone else", "O. Output Started", "P. Output Ready for QC", "P-1. Output QC in Progress", "Q. Output QC Complete", "R. Waiting for PNT", "S. PNT Ready for QC", "S-1. PNT QC in Progress", "T. PNT QC Complete", "U. Uploaded", "V. Sent to Vendor"];
//   Order.find({ currentStatus: { $in: signedOff }, paymentStatus: { $ne: 'Complete' } }).then(orders => {
//     res.render("payments/", {
//       orders,
//       pageTitle
//     });
//   });
// });

router.get("/outstanding", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let pageTitle = "Payments - Balance Outstanding";
  Order.find({ currentStatus: { $nin: ["W. CANCELLED", "X. Archived", "1. Initial"] }, paymentStatus: 'Balance Outstanding' }).then(orders => {
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
