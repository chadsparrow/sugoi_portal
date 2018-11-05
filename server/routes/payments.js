const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");
const Proof = require("../models/Proof");

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
    paymentNotes
  } = req.body;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      console.log(err);
    } else {
      foundOrder.approvedTerms = approvedTerms;
      foundOrder.onTermPayment = onTermPayment;
      foundOrder.kitOrderPayment = kitOrderPayment;
      foundOrder.isrCollectedOrig = isrCollectedOrig;
      foundOrder.isrCollectedCAD = isrCollectedCAD;
      foundOrder.isrPaymentDate = isrPaymentDate;
      foundOrder.isrPaymentType = isrPaymentType;
      foundOrder.paymentNotes = paymentNotes;
      let balanceOutstanding =
        foundOrder.netValue -
        onTermPayment -
        kitOrderPayment -
        isrCollectedOrig;
      foundOrder.balanceOutstanding = parseInt(balanceOutstanding);
      console.log(foundOrder.balanceOutstanding);
      if (foundOrder.balanceOutstanding > 0) {
        foundOrder.paymentStatus = "Balance Outstanding";
      } else if (foundOrder.balanceOutstanding == 0) {
        foundOrder.paymentStatus = "Complete";
      } else if (foundOrder.balanceOutstanding < 0) {
        foundOrder.paymentStatus = "Refund Customer";
      }

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success_msg", "Payment Updated");
          res.redirect("/payments/");
        }
      });
    }
  });
});

module.exports = router;
