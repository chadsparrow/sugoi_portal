const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment");

const {
  ensureAuthenticated,
  ensureEditOrders,
  ensureViewProd,
  ensureEditProd
} = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN PROD TABLE
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/", [ensureAuthenticated, ensureViewProd], (req, res) => {
  Order.find().then(orders => {
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
  let id = req.params.id;
  let qty = req.body.qty;
  let netValue = req.body.netValue;
  let currency = req.body.currency;
  let latestShipDate = req.body.latestShipDate;
  let markEvent = req.body.markEvent;
  let multishipPrePack = req.body.multishipPrePack;
  let vendorConfirmShip = req.body.vendorConfirmShip;
  let jbaPONum = req.body.jbaPONum;
  let jbaGNRNum = req.body.jbaGNRNum;
  let shipStatus = req.body.shipStatus;
  let tracking = req.body.tracking;
  // IF TRACKING - API CALL TO SHIPPO TO GET SHIPPING DETAILS VIA TRACKING # IF NOT NULL
  // Set confirmDeliveryDate, confirmDeliveryStatus, estDeliveryDate
  let shippingNotes = req.body.shippingNotes;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      console.log(err);
    } else {
      foundOrder.qty = qty;
      foundOrder.netValue = netValue;
      foundOrder.currency = currency;
      foundOrder.latestShipDate = latestShipDate;
      foundOrder.markEvent = markEvent;
      foundOrder.multishipPrePack = multishipPrePack;
      let sentVendor = foundOrder.sentVendor;
      if (vendorConfirmShip) {
        foundOrder.vendorConfirmShip = vendorConfirmShip;
        let date1 = moment(vendorConfirmShip);
        let date2 = moment(sentVendor);
        let diff = new DateDiff(date1, date2);
        let prodLeadTime = diff.days();
        foundOrder.prodLeadTime = parseInt(prodLeadTime + 1);
      }

      // if (confirmDeliveryDate) {
      //   foundOrder.confirmDeliveryDate;
      // }

      // if (confirmDeliveryDate && vendorConfirmShip) {
      //   foundOrder.shippingLeadTime = parseInt(
      //     confirmDeliveryDate - vendorConfirmShip
      //   );
      // }

      if (tracking) {
        foundOrder.tracking = tracking;
      }

      foundOrder.jbaPONum = jbaPONum;
      foundOrder.jbaGNRNum = jbaGNRNum;
      foundOrder.shipStatus = shipStatus;
      foundOrder.shippingNotes = shippingNotes;

      if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
        foundOrder.totalLeadTime =
          foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
      }

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success_msg", "Order Production Updated");
          res.redirect("/prod");
        }
      });
    }
  });
});

module.exports = router;
