const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment-timezone");
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
  let pageTitle = "Production";
  Order.find({ currentStatus: "V. Sent to Vendor" }).then(orders => {
    res.render("orders/prod", {
      orders,
      pageTitle
    });
  });
});

router.get("/ccn", [ensureAuthenticated, ensureViewProd], (req, res) => {
  Order.find({
    currentStatus: "V. Sent to Vendor"
  }).then(orders => {
    res.render("orders/ccnview", {
      orders
    });
  });
});

router.get("/open", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let pageTitle = "Open Orders";
  Order.find({
    $and: [
      { currentStatus: "V. Sent to Vendor" },
      {
        $or: [
          { vendorConfirmShip: null },
          { shipStatus: "" },
          { shipStatus: null },
          { tracking: null },
          { tracking: "" },
          { jbaPONum: null },
          { jbaPONum: "" },
          { jbaGNRNum: null },
          { jbaGNRNum: "" },
          { jbaInvoiceNum: null },
          { jbaInvoiceNum: "" }
        ]
      }
    ]
  }).then(orders => {
    res.render("orders/prod", {
      orders,
      pageTitle
    });
  });
});

router.get("/pending", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let pageTitle = "Shipped Orders";
  Order.find({
    $and: [
      { currentStatus: "V. Sent to Vendor" },
      { vendorConfirmShip: { $ne: null } },
      { shipStatus: "Shipped" }
    ]
  }).then(orders => {
    res.render("orders/prod", { orders, pageTitle });
  });
});

router.get("/cancelled", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let pageTitle = "Cancelled Orders";
  Order.find({
    currentStatus: "W. CANCELLED"
  }).then(orders => {
    res.render("orders/prod", {
      orders,
      pageTitle
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
    latestShipDate,
    vendorConfirmShip,
    jbaPONum,
    jbaGNRNum,
    jbaInvoiceNum,
    shipStatus,
    tracking,
    shippingNotes
  } = req.body;

  Order.findOne({ _id: id }, function (err, foundOrder) {
    if (err) {
      logger.error(err);
      return;
    } else {
      if (foundOrder.balanceOutstanding > 0) {
        foundOrder.paymentStatus = "Balance Outstanding";
      } else if (foundOrder.balanceOutstanding < 0) {
        foundOrder.paymentStatus = "Refund Customer";
      } else if (foundOrder.balanceOutstanding == 0) {
        foundOrder.paymentStatus = "Complete";
      }
      if (latestShipDate) {
        foundOrder.latestShipDate = latestShipDate;
      }

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
        foundOrder.prodLeadTime = 0;
        return;
      } else {
        foundOrder.prodLeadTime = 0;
      }

      if (tracking != foundOrder.tracking) {
        foundOrder.tracking = tracking;
      }

      if (foundOrder.confirmDeliveryDate && vendorConfirmShip) {
        let date1 = moment(Date.parse(foundOrder.confirmDeliveryDate));
        let date2 = moment(Date.parse(vendorConfirmShip));
        let diff = new DateDiff(date1, date2);
        const shippingLeadTime = diff.days();
        foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
      } else {
        foundOrder.shippingLeadTime = 0;
      }

      foundOrder.jbaPONum = jbaPONum;
      foundOrder.jbaGNRNum = jbaGNRNum;
      foundOrder.jbaInvoiceNum = jbaInvoiceNum;
      foundOrder.shipStatus = shipStatus;
      foundOrder.shippingNotes = shippingNotes;

      if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
        foundOrder.totalLeadTime =
          foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
      } else {
        foundOrder.totalLeadTime = 0;
      }

      foundOrder.save(function (err, updatedOrder) {
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
