const express = require("express");
const router = express.Router();
const logger = require("../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

router.get("/", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.find().then(orders => {
    res.render("payments/", {
      orders
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
    isrCollectedCAD,
    isrPaymentDate,
    isrPaymentType,
    paymentNotes,
    isrRefunded,
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
      foundOrder.isrCollectedCAD = isrCollectedCAD;
      foundOrder.isrPaymentDate = isrPaymentDate;
      foundOrder.isrPaymentType = isrPaymentType;
      foundOrder.paymentNotes = paymentNotes;
      foundOrder.invoiceSent = invoiceSent;
      if (foundOrder.netValue != null || foundOrder.netValue != undefined) {
        let balanceOutstanding =
          foundOrder.netValue -
          onTermPayment -
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

      foundOrder.save(function(err, updatedOrder) {
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
