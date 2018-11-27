const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");
const Report = require("../models/Report");
const Proof = require("../models/Proof");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN ORDER TABLE
// SEC - MUST BE LOGGED IN
router.get("/", ensureAuthenticated, (req, res) => {
  let pageTitle = "In Progress";
  Order.find({
    currentStatus: { $not: { $in: ["V. Sent to Vendor", "W.CANCELLED"] } }
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

router.get("/completed", ensureAuthenticated, (req, res) => {
  let pageTitle = "Completed";
  Order.find({
    currentStatus: "V. Sent to Vendor"
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

router.get("/cancelled", ensureAuthenticated, (req, res) => {
  let pageTitle = "Cancelled";
  Order.find({
    currentStatus: "W. CANCELLED"
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

router.get("/all", ensureAuthenticated, (req, res) => {
  let pageTitle = "All";
  Order.find().then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
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
  let {
    orderNum,
    accountNum,
    priority,
    currentStatus,
    eventDate,
    latestInHand,
    isr,
    client,
    instruction,
    vendor
  } = req.body;
  orderNum = orderNum.toString();
  isr = isr.toUpperCase();
  let instructions = [];
  let currentArtist = "";
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
  let jbaInvoiceNum = "";
  let signedOffDate = null;

  if (instruction) {
    instructions.push({
      instruction: instruction,
      instructionType: "Initial",
      user: isr
    });
  }

  if (currentStatus == "M. Waiting for Output") {
    signedOffDate = moment()
      .tz("America/Vancouver")
      .format();
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
        multishipPrePack: multishipPrePack,
        shipStatus: shipStatus,
        tracking: tracking,
        confirmDeliveryStatus: confirmDeliveryStatus,
        shippingNotes: shippingNotes,
        prodLeadTime: prodLeadTime,
        shippingLeadTime: shippingLeadTime,
        totalLeadTime: totalLeadTime,
        jbaPONum: jbaPONum,
        jbaGNRNum: jbaGNRNum,
        jbaInvoiceNum: jbaInvoiceNum,
        signedOffDate: signedOffDate
      });

      newOrder
        .save()
        .then(order => {
          logger.info(`${order.orderNum} added to DB by ${req.user.username}`);
          req.flash("success_msg", "Order Saved");
          res.redirect("/orders");
        })
        .catch(err => {
          logger.error(err);
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
    Proof.find({ orderNum: order.orderNum }).then(proofs => {
      res.render("orders/view", {
        order,
        proofs
      });
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
  let {
    client,
    priority,
    currentArtist,
    currentStatus,
    eventDate,
    latestInHand,
    vendor,
    qty,
    netValue,
    currency,
    latestShipDate,
    multishipPrePack
  } = req.body;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      logger.error(err);
      return;
    } else {
      foundOrder.client = client;
      foundOrder.priority = priority;
      if (currentStatus === foundOrder.currentStatus) {
        foundOrder.currentArtist = currentArtist;
      } else {
        foundOrder.currentStatus = currentStatus;
        if (
          foundOrder.currentStatus == "A. Waiting for Proof" ||
          foundOrder.currentStatus == "G. Waiting for Revision" ||
          foundOrder.currentStatus == "M. Waiting for Output"
        ) {
          currentArtist = "";
        }
        foundOrder.currentArtist = currentArtist;

        if (foundOrder.currentStatus === "U. Uploaded") {
          foundOrder.uploadDate = moment()
            .tz("America/Vancouver")
            .format();
          foundOrder.sentVendor = null;
          let date1 = moment(Date.parse(foundOrder.uploadDate));
          let date2 = moment(Date.parse(foundOrder.signedOffDate));
          let diff = new DateDiff(date1, date2);
          const outputTurnaround = diff.days();
          foundOrder.outputTurnaround = parseInt(outputTurnaround + 1);

          let reportWeek = moment().tz("America/Vancouver").format("W");
          let reportYear = moment().tz("America/Vancouver").format("YYYY");

          let query = {reportWeekNumber: reportWeek, reportYear: reportYear};
          let updater = {$inc {outputCompleted: 1}};
          let options = {upsert: true, new: true};


          Report.findOneAndUpdate(query, updater, options, function(err, result){
            if (error){
              logger.error(err);
              return;
            }
          });
        } else if (foundOrder.currentStatus === "V. Sent to Vendor") {
          foundOrder.sentVendor = moment()
            .tz("America/Vancouver")
            .format();
        } else if (foundOrder.currentStatus === "M. Waiting for Output") {
          foundOrder.signedOffDate = moment()
            .tz("America/Vancouver")
            .format();
        } else if (foundOrder.currentStatus === "F. Proof Complete") {
          foundOrder.proofCompletionDate = moment()
            .tz("America/Vancouver")
            .format();
          let date1 = moment(Date.parse(foundOrder.proofCompletionDate));
          let date2 = moment(Date.parse(foundOrder.requestDate));
          let diff = new DateDiff(date1, date2);
          const proofTurnaround = diff.days();
          foundOrder.proofTurnaround = parseInt(proofTurnaround + 1);
        }
      }

      foundOrder.eventDate = eventDate;
      foundOrder.latestInHand = latestInHand;
      foundOrder.vendor = vendor;
      foundOrder.qty = qty;
      foundOrder.netValue = netValue;
      if (foundOrder.netValue != null || foundOrder.netValue != undefined) {
        if (foundOrder.netValue > 0) {
          foundOrder.balanceOutstanding = netValue;
          foundOrder.paymentStatus = "Balance Outstanding";
        } else if (foundOrder.netValue < 0) {
          foundOrder.balanceOutstanding = netValue;
          foundOrder.paymentStatus = "Refund Customer";
        } else if (foundOrder.netValue == 0) {
          foundOrder.balanceOutstanding = netValue;
          foundOrder.paymentStatus = "Complete";
        }
      }

      foundOrder.currency = currency;
      foundOrder.latestShipDate = latestShipDate;
      foundOrder.multishipPrePack = multishipPrePack;

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          logger.error(err);
        } else {
          logger.info(
            `${updatedOrder.orderNum} - update by ${req.user.username}`
          );
          req.flash("success_msg", "Order Updated");
          res.redirect("/orders");
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
            logger.error(err);
            return;
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
    let currentStatus = "G. Waiting for Revision";

    Order.findOne({ _id: id }, function(err, foundOrder) {
      if (err) {
        logger.error(err);
        return;
      } else {
        if (instruction) {
          foundOrder.instructions.push({
            instruction: instruction,
            instructionType: instructionType,
            user: revUser
          });

          foundOrder.currentStatus = currentStatus;
          foundOrder.currentArtist = "";

          foundOrder.save(function(err, updatedOrder) {
            if (err) {
              logger.error(err);
              return;
            } else {
              logger.info(
                `${updatedOrder.orderNum} - revision request by ${
                  req.user.username
                }`
              );
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

    Order.findOne({ _id: id }, function(err, foundOrder) {
      if (err) {
        logger.error(err);
        return;
      } else {
        if (instruction) {
          foundOrder.instructions.push({
            instruction: instruction,
            instructionType: instructionType,
            user: noteUser
          });

          foundOrder.save(function(err, updatedOrder) {
            if (err) {
              logger.error(err);
              return;
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
