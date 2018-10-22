const express = require("express");
const router = express.Router();

const {
  ensureAuthenticated,
  ensureEditOrders,
  ensureViewProd,
  ensureEditProd
} = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN ORDER TABLE
// SEC - MUST BE LOGGED IN
router.get("/", ensureAuthenticated, (req, res) => {
  Order.find().then(orders => {
    res.render("orders/index", {
      orders
    });
  });
});

// @DESC - GETS ADD A NEW ORDER PAGE
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  const orderNum = "";
  const accountNum = "";
  const priority = "";
  const currentStatus = "";
  const eventDate = null;
  const latestInHand = null;
  const isr = "";
  const instruction = "";
  const vendor = "";
  res.render("orders/add", {
    orderNum,
    accountNum,
    priority,
    currentStatus,
    eventDate,
    latestInHand,
    isr,
    instruction,
    vendor
  });
});

// @DESC - POSTS A NEW ORDER INTO COLLECTION BASED ON ADD ORDER PAGE
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.post("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let orderNum = req.body.orderNum;
  orderNum = orderNum.toString();
  let accountNum = req.body.accountNum;
  let priority = req.body.priority;
  let currentStatus = req.body.currentStatus;
  let eventDate = req.body.eventDate;
  let latestInHand = req.body.latestInHand;
  let isr = req.body.isr;
  isr = isr.toUpperCase();
  let client = req.body.client;
  let instruction = req.body.instruction;
  let instructions = [];
  let currentArtist = "";
  let uploadDate = null;
  let sentVendor = null;
  let vendor = req.body.vendor;
  let qty = 0;
  let netValue = 0;
  let markEvent = "";
  let multishipPrePack = "";
  let shipStatus = "";
  let tracking = "";
  let confirmDeliveryStatus = "";
  let shippingNotes = "";
  let prodLeadTime = 0;
  let shippingLeadTime = 0;
  let totalLeadTime = 0;
  let jbaPONum = "";
  let jbaGNRNum = "";

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
        accountNum: accountNum,
        currentStatus: currentStatus,
        priority: priority,
        eventDate: eventDate,
        latestInHand: latestInHand,
        isr: isr,
        client: client,
        instructions: instructions,
        currentArtist: currentArtist,
        vendor: vendor,
        qty: qty,
        netValue: netValue,
        markEvent: markEvent,
        multishipPrePack: multishipPrePack,
        shipStatus: shipStatus,
        tracking: tracking,
        confirmDeliveryStatus: confirmDeliveryStatus,
        shippingNotes: shippingNotes,
        prodLeadTime: prodLeadTime,
        shippingLeadTime: shippingLeadTime,
        totalLeadTime: totalLeadTime,
        jbaPONum: jbaPONum,
        jbaGNRNum: jbaGNRNum
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

// @DESC - GETS ORDER FROM ORDERS COLLECTION BASED ON ID#
// SEC - PUBLIC ACCESS
router.get("/view/:id", (req, res) => {
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    res.render("orders/view", {
      order
    });
  });
});

// @DESC - GETS ORDER EDIT PAGE FOR ORDER BASED ON ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    res.render("orders/edit", {
      order
    });
  });
});

// @DESC - UPDATES ORDER IN ORDER COLLECTION BASED ON ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.put("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let id = req.params.id;
  let client = req.body.client;
  let priority = req.body.priority;
  let currentArtist = req.body.currentArtist;
  let currentStatus = req.body.currentStatus;
  let eventDate = req.body.eventDate;
  let latestInHand = req.body.latestInHand;
  let vendor = req.body.vendor;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      console.log(err);
    } else {
      foundOrder.client = client;
      foundOrder.priority = priority;
      foundOrder.currentArtist = currentArtist;
      if (currentStatus === "U. Uploaded") {
        foundOrder.uploadDate = Date.now();
        foundOrder.sentVendor = null;
      } else if (currentStatus === "V. Sent to Vendor") {
        foundOrder.sentVendor = Date.now();
      }
      foundOrder.currentStatus = currentStatus;
      foundOrder.eventDate = eventDate;
      foundOrder.latestInHand = latestInHand;
      foundOrder.vendor = vendor;

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

// @DESC - GETS NOTE EDIT PAGE BASED ON NOTE ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get(
  "/note-edit/:noteid",
  [ensureAuthenticated, ensureEditOrders],
  (req, res) => {
    let noteid = req.params.noteid;
    Order.findOne({ "instructions._id": noteid }).then(order => {
      let note = order.instructions.id(noteid);
      res.render("orders/note-edit", {
        note
      });
    });
  }
);

// @DESC - UPDATES NOTE (INSTRUCTIONS) IN ORDERS COLLECTION BASED ON ORDER ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.put(
  "/note-edit/:noteid",
  [ensureAuthenticated, ensureEditOrders],
  (req, res) => {
    let noteid = req.params.noteid;
    let instruction = req.body.instruction;
    let isr = req.body.isr;
    isr = isr.toUpperCase();
    let instructionType = req.body.instructionType;

    Order.findOne({ "instructions._id": noteid }).then(foundOrder => {
      let note = foundOrder.instructions.id(noteid);
      let id = foundOrder.id;
      if (instruction) {
        note.instruction = instruction;
        note.isr = isr;
        note.instructionType = instructionType;

        foundOrder.save(function(err, updatedOrder) {
          if (err) {
            console.log(err);
          } else {
            req.flash("success_msg", "Note Updated");
            res.redirect("/orders/view/" + id);
          }
        });
      } else {
        req.flash("error_msg", "Blank Request Ignored");
        res.redirect("/orders/view/" + id);
      }
    });
  }
);

// @DESC - EDITS NOTES BY PUSHING NEW ONE TO ARRAY BASED ON ORDER ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.put(
  "/revision/:id",
  [ensureAuthenticated, ensureEditOrders],
  (req, res) => {
    let id = req.params.id;
    let instruction = req.body.instruction;
    let instructionType = "Revision";
    let revUser = req.body.isr;
    revUser = revUser.toUpperCase();
    let currentStatus = "G. Waiting for Revision";

    Order.findOne({ _id: id }, function(err, foundOrder) {
      if (err) {
        console.log(err);
      } else {
        if (instruction) {
          foundOrder.instructions.push({
            instruction: instruction,
            instructionType: instructionType,
            user: revUser
          });

          foundOrder.currentStatus = currentStatus;

          foundOrder.save(function(err, updatedOrder) {
            if (err) {
              console.log(err);
            } else {
              req.flash("success_msg", "Revision Requested");
              res.redirect("/orders/view/" + id);
            }
          });
        } else {
          req.flash("error_msg", "Blank Request Ignored");
          res.redirect("/orders/view/" + id);
        }
      }
    });
  }
);

// @DESC - EDITS NOTES BY PUSHING NEW ONE TO ARRAY BASED ON ORDER ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.put(
  "/notes/:id",
  [ensureAuthenticated, ensureEditOrders],
  (req, res) => {
    let id = req.params.id;
    let instruction = req.body.instruction;
    let instructionType = "Note";
    let noteUser = req.body.noteUser;
    noteUser = noteUser.toUpperCase();

    Order.findOne({ _id: id }, function(err, foundOrder) {
      if (err) {
        console.log(err);
      } else {
        if (instruction) {
          foundOrder.instructions.push({
            instruction: instruction,
            instructionType: instructionType,
            user: noteUser
          });

          foundOrder.save(function(err, updatedOrder) {
            if (err) {
              console.log(err);
            } else {
              req.flash("success_msg", "Note Added");
              res.redirect("/orders/view/" + id);
            }
          });
        } else {
          req.flash("error_msg", "Blank Request Ignored");
          res.redirect("/orders/view/" + id);
        }
      }
    });
  }
);

module.exports = router;
