const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment");
const logger = require("../helpers/logs");

const {
  ensureAuthenticated,
  ensureViewProd,
  ensureEditProd
} = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN PROD TABLE
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/", [ensureAuthenticated, ensureViewProd], (req, res) => {
  Order.find({
    currentStatus: { $in: ["V. Sent to Vendor", "W. CANCELLED"] }
  }).then(orders => {
    res.render("orders/prod", {
      orders
    });
  });
});

// @DESC - GETS ORDER BY ID# AND DISPLAYS IN MODAL WITH EDITABLE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/edit/:id", [ensureAuthenticated, ensureEditProd], (req, res) => {
  let id = req.params.id;
  Order.findOne({ _id: id }).then(order => {
    res.render("orders/prod-edit", {
      order
    });
  });
});

// @DESC - UPDATES ORDER BY ID# BASED ON CHANGES TO EDIT FORM
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.put("/edit/:id", [ensureAuthenticated, ensureEditProd], (req, res) => {
  const id = req.params.id;
  const {
    qty,
    netValue,
    currency,
    latestShipDate,
    multishipPrePack,
    vendorConfirmShip,
    jbaPONum,
    jbaGNRNum,
    jbaInvoiceNum,
    shipStatus,
    tracking,
    confirmDeliveryDate,
    confirmDeliveryStatus,
    estDeliveryDate,
    shippingNotes
  } = req.body;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      logger.error(err);
      return;
    } else {
      foundOrder.qty = qty;
      foundOrder.netValue = netValue;
      foundOrder.balanceOutstanding = netValue;
      foundOrder.currency = currency;
      if (latestShipDate) {
        foundOrder.latestShipDate = latestShipDate;
      }

      foundOrder.multishipPrePack = multishipPrePack;
      const sentVendor = foundOrder.sentVendor;
      if (vendorConfirmShip && sentVendor) {
        foundOrder.vendorConfirmShip = vendorConfirmShip;
        let date1 = moment(Date.parse(vendorConfirmShip));
        let date2 = moment(Date.parse(sentVendor));
        let diff = new DateDiff(date1, date2);
        const prodLeadTime = diff.days();
        foundOrder.prodLeadTime = parseInt(prodLeadTime);
      } else if (vendorConfirmShip && !sentVendor) {
        req.flash("error", "No Sent to Vendor Date");
        res.redirect("/prod/edit/" + foundOrder._id);
        return;
      }

      foundOrder.confirmDeliveryDate = confirmDeliveryDate;
      foundOrder.confirmDeliveryStatus = confirmDeliveryStatus;
      foundOrder.estDeliveryDate = estDeliveryDate;

      if (confirmDeliveryDate && vendorConfirmShip) {
        let date1 = moment(Date.parse(confirmDeliveryDate));
        let date2 = moment(Date.parse(vendorConfirmShip));
        let diff = new DateDiff(date1, date2);
        const shippingLeadTime = diff.days();
        foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
      }

      if (tracking) {
        foundOrder.tracking = tracking;
      }

      foundOrder.jbaPONum = jbaPONum;
      foundOrder.jbaGNRNum = jbaGNRNum;
      foundOrder.jbaInvoiceNum = jbaInvoiceNum;
      foundOrder.shipStatus = shipStatus;
      foundOrder.shippingNotes = shippingNotes;

      if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
        foundOrder.totalLeadTime =
          foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
      }

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          logger.error(err);
          return;
        } else {
          logger.info(
            `${updatedOrder.orderNum} - update by ${req.user.username}`
          );
          req.flash("success_msg", "Order Production Updated");
          res.redirect("/prod");
        }
      });
    }
  });
});

module.exports = router;
