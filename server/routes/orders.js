const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// styles route to show all the styles in mongodb
router.get("/", ensureAuthenticated, (req, res) => {
  Order.find().then(orders => {
    res.render("orders/index", {
      orders
    });
  });
});

router.get("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  const orderNum = "";
  const priority = "";
  const currentStatus = "";
  const eventDate = null;
  const latestInHand = null;
  const isr = "";
  const instruction = "";
  res.render("orders/add", {
    orderNum,
    priority,
    currentStatus,
    eventDate,
    latestInHand,
    isr,
    instruction
  });
});

router.post("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let orderNum = req.body.orderNum;
  orderNum = orderNum.toString();
  let priority = req.body.priority;
  let currentStatus = req.body.currentStatus;
  let eventDate = req.body.eventDate;
  let latestInHand = req.body.latestInHand;
  let isr = req.body.isr;
  let client = req.body.client;
  let instruction = req.body.instruction;
  let instructions = [];
  let currentArtist = "";
  let uploadDate = null;
  let sentVendor = null;
  let qty = 0;
  let netValue = 0;
  let markEvent = "";
  let mutishipPrePack = "";
  let shipStatus = "";
  let tracking = [];
  let confirmDeliveryStatus = "";
  let shippingNotes = "";
  let prodLeadTime = 0;
  let shippingLeadTime = 0;
  let totalLeadTime = 0;

  if (instruction) {
    instructions.push({
      instruction: instruction,
      instructionType: "Initial",
      user: isr
    });
  }

  Order.findOne({ orderNum: orderNum }, function(err, order) {
    if (order) {
      req.flash("error_msg", "Order Number already entered");
      res.redirect("/orders/add");
    } else {
      const newOrder = new Order({
        orderNum: orderNum,
        currentStatus: currentStatus,
        priority: priority,
        eventDate: eventDate,
        latestInHand: latestInHand,
        isr: isr,
        client: client,
        instructions: instructions,
        currentArtist: currentArtist,
        uploadDate: uploadDate,
        sentVendor: sentVendor,
        qty: qty,
        netValue: netValue,
        markEvent: markEvent,
        mutishipPrePack: mutishipPrePack,
        shipStatus: shipStatus,
        tracking: tracking,
        confirmDeliveryStatus: confirmDeliveryStatus,
        shippingNotes: shippingNotes,
        prodLeadTime: prodLeadTime,
        shippingLeadTime: shippingLeadTime,
        totalLeadTime: totalLeadTime
      });

      newOrder
        .save()
        .then(order => {
          req.flash("success_msg", "Order Saved");
          res.redirect("/orders");
        })
        .catch(err => {
          console.log(err);
          return;
        });
    }
  });
});

router.get("/view/:id", (req, res) => {
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    res.render("orders/view", {
      order
    });
  });
});

router.get("/edit/:id", (req, res) => {
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    res.render("orders/edit", {
      order
    });
  });
});

router.put("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let id = req.params.id;
  let client = req.body.client;
  let priority = req.body.priority;
  let currentArtist = req.body.currentArtist;
  let currentStatus = req.body.currentStatus;
  let eventDate = req.body.eventDate;
  let latestInHand = req.body.latestInHand;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      console.log(err);
    } else {
      foundOrder.client = client;
      foundOrder.priority = priority;
      foundOrder.currentArtist = currentArtist;
      foundOrder.currentStatus = currentStatus;
      foundOrder.eventDate = eventDate;
      foundOrder.latestInHand = latestInHand;

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success_msg", "Order Updated");
          res.redirect("/orders/view/" + id);
        }
      });
    }
  });
});

module.exports = router;
