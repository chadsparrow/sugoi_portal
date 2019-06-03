const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment-timezone");
const dayjs = require('dayjs');
const logger = require("../helpers/logs");
const jsonxml = require('jsontoxml');
const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");
const Report = require("../models/Report");
const Proof = require("../models/Proof");
const CustomArtist = require('../models/CustomArtist');
const CustomRep = require('../models/CustomRep');


// @DESC - GETS ALL ORDERS AND DISPLAYS IN ORDER TABLE
// SEC - MUST BE LOGGED IN
router.get("/all", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "All";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG All"
      orders = await Order.find({ lgOrder: true });
    } else {
      orders = await Order.find();
    }
    res.render("orders/index", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - LOADS PO PAGE WITH SINGLE ORDER DETAILS
// SEC - MUST BE LOGGED IN
router.get("/po/:orderNum", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = `${req.params.orderNum} PO`;
    let poDate = dayjs().format('MM/DD/YYYY');
    let items = [];

    const order = await Order.findOne({ orderNum: req.params.orderNum });

    for (let orderLine of order.orderLines) {
      if (!orderLine.cancelled) {
        for (let item of orderLine.items) {
          if (!item.cancelled) {
            if (item.personalization === true) {
              item.unitCost += 5.00;
            }
            items.push(item);
          }
        }
      }
    }

    res.render("orders/po", {
      order,
      pageTitle,
      poDate,
      items
    });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS XML PAGE FOR A SINGLE ORDER
// SEC - MUST BE LOGGED IN
router.get("/xml/:orderNum", ensureAuthenticated, (req, res) => {
  let items = [];
  Order.findOne({ orderNum: req.params.orderNum })
    .then(order => {
      const newOrderObject = {};
      newOrderObject.SAP = [];

      if (order.client) {
        order.client = order.client.replace(/&/g, '&amp;');
        order.client = order.client.replace(/</g, '&lt;');
        order.client = order.client.replace(/>/g, '&gt;');
        order.client = order.client.replace(/"/g, '&quot;');
        order.client = order.client.replace(/'/g, '&apos;');
      }

      for (let orderLine of order.orderLines) {
        if (!orderLine.cancelled) {
          if (orderLine.items.length > 0) {
            for (let item of orderLine.items) {
              if (!item.cancelled) {
                if (order.needSketch === false || (order.needSketch === true && item.sketchOnly === true)) {
                  let prs = '';
                  if (item.personalization) {
                    prs = 'Y';
                  } else {
                    prs = 'N';
                  }
                  let scaled = '';
                  if (orderLine.scaledArtCharge > 0) {
                    scaled = 'Y';
                  } else {
                    scaled = 'N';
                  }

                  let extendedDescription = item.extendedDescription;
                  extendedDescription = extendedDescription.replace(/&/g, '&amp;');
                  extendedDescription = extendedDescription.replace(/</g, '&lt;');
                  extendedDescription = extendedDescription.replace(/>/g, '&gt;');
                  extendedDescription = extendedDescription.replace(/"/g, '&quot;');
                  extendedDescription = extendedDescription.replace(/'/g, '&apos;');

                  newOrderObject.SAP.push({
                    'item': {
                      'SALESORDER': order.orderNum,
                      'CLIENT': order.client,
                      'CHILDWORKORDER': item.itemNumber,
                      'STYLENUM': item.autobahnCode,
                      'STYLENAME': extendedDescription,
                      'PARENTWORKORDER': orderLine.lineNumber,
                      'XXS': item.xxs,
                      'XS': item.xs,
                      'S': item.s,
                      'M': item.m,
                      'L': item.l,
                      'XL': item.xl,
                      'XXL': item.xxl,
                      'XXXL': item.xxxl,
                      'ONE': item.one,
                      'PROOFARTIST': order.currentArtist,
                      'OUTPUTARTIST': ".",
                      'SHIPTO': order.accountNum,
                      'TAKENBY': order.isr,
                      'JOBTYPE': orderLine.lineJobType,
                      'REFERENCEORDER': orderLine.swoReference,
                      'CHILDREFERENCEORDER': item.childReference,
                      'COLORS1': item.colour1,
                      'COLORS2': item.colour2,
                      'COLORS3': item.colour3,
                      'COLORS4': '.',
                      'COLORS5': '.',
                      'COLORS6': '.',
                      'ZIPPERCOLOR': item.zipper,
                      'CONTRASTCOLOR': item.contrast,
                      'THREADCOLOR': item.thread,
                      'GRAPHIC': orderLine.graphicCode,
                      'COLOURWAY': orderLine.colourWayCode,
                      'CUSTOMERPO': '.',
                      'REVISION': '.',
                      'BRAND': item.brand,
                      'FACTORY': order.vendor,
                      'SCALED_ART': scaled,
                      'PERSONALIZATION': prs,
                      'INK': item.inkType,
                      'SCALEDSIZES': '.',
                    }
                  });
                }
              }
            }
          }
        }
      }

      const xml = jsonxml(newOrderObject);
      res.type('application/xml');
      res.send(xml);
    })
    .catch(err => {
      console.log(err);
    });
});

// @DESC - GETS ALL IN PROGRESS ORDERS
// SEC - MUST BE LOGGED IN
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "In Progress";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG In Progress";
      orders = await Order.find({
        currentStatus: {
          $not: { $in: ["V. Sent to Vendor", "W. CANCELLED", "1. Initial", "X. Archived"] }
        },
        lgOrder: true
      });
    } else {
      orders = await Order.find({
        currentStatus: {
          $not: { $in: ["V. Sent to Vendor", "W. CANCELLED", "1. Initial", "X. Archived"] }
        }
      });
    }
    res.render("orders/index", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ALL IN INITIAL ORDERS - BEFORE IN PROGRESS
// SEC - MUST BE LOGGED IN
router.get("/initial", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "Initial";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG Initial";
      orders = await Order.find({ currentStatus: "1. Initial", lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: "1. Initial" });
    }
    res.render("orders/index", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ALL IN COMPLETED ORDERS - IN PRODUCTION
// SEC - MUST BE LOGGED IN
router.get("/completed", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "Completed";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG Completed";
      orders = await Order.find({ currentStatus: "V. Sent to Vendor", lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: "V. Sent to Vendor" });
    }
    res.render("orders/notinprogress", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ALL CANCELLED ORDERS
// SEC - MUST BE LOGGED IN
router.get("/cancelled", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "Cancelled";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG Cancelled"
      orders = await Order.find({ currentStatus: "W. CANCELLED", lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: "W. CANCELLED" });
    }
    res.render("orders/notinprogress", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ALL IN ARCHIVED ORDERS - MAINLY NEVER GONE TO PRODUCTION
// SEC - MUST BE LOGGED IN
router.get("/archived", ensureAuthenticated, async (req, res) => {
  try {
    let pageTitle = "Archived";
    let orders;
    if (req.user.lgUser) {
      pageTitle = "LG Archived";
      orders = await Order.find({ currentStatus: "X. Archived", lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: "X. Archived" });
    }
    res.render("orders/index", { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ADD A NEW ORDER PAGE
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get("/add", [ensureAuthenticated, ensureEditOrders], async (req, res) => {
  try {
    const currentUser = req.user.username.toUpperCase();
    if (req.user.lgUser) {
      const customReps = await CustomRep.find({ office: "LG" }).sort('text');
      res.render("orders/add", {
        orderNum: "9LG_",
        priority: "",
        currentStatus: "",
        isr: "",
        instruction: "",
        vendor: "CCN",
        estValue: 0,
        lgOrder: true,
        customReps: customReps,
        currentUser: currentUser
      });
    } else {
      const order = await Order.findOne({ orderNum: { $regex: /^\d+$/ } }).sort('-orderNum');
      const newOrderNum = (parseInt(order.orderNum) + 1).toString();
      const customReps = await CustomRep.find({ office: "SUGOI" }).sort('text');
      res.render("orders/add", {
        orderNum: newOrderNum,
        priority: "",
        currentStatus: "",
        isr: "",
        instruction: "",
        vendor: "",
        customReps: customReps,
        estValue: 0,
        lgOrder: false,
        currentUser: currentUser
      });
    }
  } catch (error) {
    logger.error(err);
  }
});

// @DESC - POSTS A NEW ORDER INTO COLLECTION BASED ON ADD ORDER PAGE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.post("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let {
    orderNum,
    priority,
    isr,
    instruction,
    vendor,
    estValue,
    currency
  } = req.body;
  orderNum = orderNum.toString();
  isr = isr.toUpperCase();

  let instructions = [];

  if (instruction) {
    instructions.push({
      instruction,
      instructionType: "Initial",
      user: isr
    });
  }

  const lgOrder = req.user.lgUser ? true : false;
  const quoteToggle = req.user.lgUser ? false : true;

  Order.findOne({ orderNum: orderNum }, function (err, order) {
    if (order) {
      req.flash("error_msg", "Order Number already entered");
      res.redirect("/orders/add");
      return;
    } else {
      const newOrder = new Order({
        orderNum,
        priority,
        isr,
        instructions,
        vendor,
        estValue,
        currency,
        lgOrder,
        quoteToggle
      });

      newOrder
        .save()
        .then(order => {
          logger.info(`${order.orderNum} added to database by ${req.user.username}`);
          req.flash("success_msg", "Order Saved");
          if (order.currentStatus === "1. Initial") {
            res.redirect("/orders/initial");
          } else {
            res.redirect("/orders/");
          }
        })
        .catch(err => {
          logger.error(err);
        });
    }
  });
});

// @DESC - GETS ORDER FROM ORDERS COLLECTION BASED ON ID#
// SEC - PUBLIC ACCESS
router.get("/view/:id", ensureAuthenticated, (req, res) => {
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    Proof.find({ orderNum: order.orderNum })
      .then(proofs => {
        res.render("orders/view", {
          order,
          proofs
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// @DESC - GETS ORDER EDIT PAGE FOR ORDER BASED ON ID#
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.findOne({ _id: req.params.id }).then(order => {
    let instructions = order.instructions;
    let artDirection = '';
    if (order.currentStatus === "A. Waiting for Proof") {

      if (instructions.length > 0) {
        let instruction = instructions[instructions.length - 1];
        if (instruction.instructionType === "Art Direction") {
          artDirection = instructions[instructions.length - 1].instruction;
        }
      }
    }
    CustomArtist.find().then(customArtists => {
      res.render("orders/edit", {
        order,
        customArtists,
        artDirection
      });
    });
  });
});

// @DESC - UPDATES ORDER IN ORDER COLLECTION BASED ON ID# - USES CURRENTSTATUS TO DETERMINE WHAT TO DO
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.put("/edit/:id", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let id = req.params.id;
  let {
    priority,
    currentArtist,
    currentStatus,
    vendor,
    jbaPONum,
    latestShipDate,
    accountNum,
    instruction,
    estValue,
    currency,
    latestInHand,
    eventDate
  } = req.body;

  Order.findOne({ _id: id }, function (err, foundOrder) {
    if (err) {
      return logger.error(err);
    } else {
      foundOrder.currentArtist = currentArtist;
      foundOrder.priority = priority;
      foundOrder.estValue = estValue;
      foundOrder.currency = currency;
      foundOrder.accountNum = accountNum;

      foundOrder.currentStatus = currentStatus;
      if (foundOrder.currentStatus === "A. Waiting for Proof") {
        if (foundOrder.proofRequestDate === null) {
          foundOrder.proofRequestDate = dayjs().format();
        }
        if (!instruction) {
          req.flash("error_msg", "Art Direction required - Try Again");
          res.redirect(`/orders/edit/${id}`);
          return;
        }

        if (instruction) {
          foundOrder.instructions.push({
            instruction,
            instructionType: "Art Direction",
            user: foundOrder.isr
          });
        }

        foundOrder.currentArtist = "";
      }

      if (
        foundOrder.currentStatus === "G. Waiting for Revision" ||
        foundOrder.currentStatus === "M. Waiting for Output" ||
        foundOrder.currentStatus === "W. CANCELLED" ||
        foundOrder.currentStatus === "X. Archived"
      ) {
        foundOrder.currentArtist = "";
      }

      if (foundOrder.currentStatus === "U. Uploaded") {
        if (foundOrder.signedOffDate === null) {
          req.flash("error_msg", "Order not signed off yet");
          res.redirect(`/orders/edit/${id}`);
          return;
        }

        if (foundOrder.uploadDate === null) {
          foundOrder.uploadDate = dayjs().format();
          foundOrder.sentVendor = null;

          let date1 = dayjs(foundOrder.uploadDate);
          let date2 = dayjs(foundOrder.signedOffDate);
          let diff = new DateDiff(date1, date2);
          const outputTurnaround = parseInt(diff.days() + 1);
          foundOrder.outputTurnaround = outputTurnaround;
          let reportWeek = moment(dayjs().format()).format("W");
          let reportYear = dayjs().format("YYYY");
          let reportMonth = moment(dayjs().format()).format("M");
          let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);
          let outputAvg = 0;

          Report.findOneAndUpdate(
            {
              reportWeekNumber: reportWeek,
              reportYear: reportYear,
              reportWeekRange: reportWeekRange,
              reportMonth: reportMonth
            },
            {
              $inc: { outputCompleted: 1 },
              $push: { outputTurnArounds: outputTurnaround }
            },
            { upsert: true, new: true },
            function (err, updatedReport) {
              if (err) {
                return logger.error(err);
              }

              let length = updatedReport.outputTurnArounds.length;
              let sum = 0;
              for (let i = 0; i < length; i++) {
                sum += parseInt(updatedReport.outputTurnArounds[i], 10);
              }

              outputAvg = Math.round(sum / length);

              Report.updateOne(
                {
                  _id: updatedReport._id
                },
                { $set: { avgOutput: outputAvg } },
                function (error, finalUpdatedReport) {
                  if (error) {
                    return logger.error(error);
                  }
                }
              );
            }
          );

        }
      } else if (foundOrder.currentStatus === "V. Sent to Vendor") {
        if (foundOrder.signedOffDate === null) {
          req.flash("error_msg", "Order not signed off");
          res.redirect(`/orders/edit/${id}`);
          return;
        }

        if (foundOrder.sentVendor === null) {
          foundOrder.sentVendor = dayjs().format();
        }

      } else if (foundOrder.currentStatus === "M. Waiting for Output") {
        if (foundOrder.needSketch) {
          req.flash("error_msg", "Cannot Sign Off - Mock Requested");
          res.redirect(`/orders/edit/${id}`);
          return;
        } else {
          if (foundOrder.signedOffDate === null) {
            foundOrder.signedOffDate = dayjs().format();
            let reportWeek = moment(dayjs().format()).format("W");
            let reportYear = dayjs().format("YYYY");
            let reportMonth = moment(dayjs().format()).format("M");

            let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);

            Report.findOneAndUpdate(
              {
                reportWeekNumber: reportWeek,
                reportYear: reportYear,
                reportWeekRange: reportWeekRange,
                reportMonth: reportMonth
              },
              {
                $inc: { signOffs: 1 }
              },
              { upsert: true, new: true },
              function (err, result) {
                if (err) {
                  return logger.error(err);
                }
              }
            )
          }
        }
      } else if (foundOrder.currentStatus === "F. Proof Complete") {
        if (foundOrder.proofRequestDate === null) {
          req.flash("error_msg", "Proof not requested - Cannot complete");
          res.redirect(`/orders/edit/${id}`);
          return;
        }

        if (foundOrder.proofCompletionDate === null) {
          foundOrder.proofCompletionDate = dayjs().format();
          let date1 = dayjs(foundOrder.proofCompletionDate);
          let date2 = dayjs(foundOrder.proofRequestDate);
          let diff = new DateDiff(date1, date2);
          const proofTurnaround = parseInt(diff.days() + 1);
          foundOrder.proofTurnaround = proofTurnaround;

          let reportWeek = moment(dayjs().format()).format("W");
          let reportYear = dayjs().format("YYYY");
          let reportMonth = moment(dayjs().format()).format("M");

          let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);

          let proofsAvg = 0;

          Report.findOneAndUpdate(
            {
              reportWeekNumber: reportWeek,
              reportYear: reportYear,
              reportWeekRange: reportWeekRange,
              reportMonth: reportMonth
            },
            {
              $inc: { proofsCompleted: 1 },
              $push: { proofTurnArounds: proofTurnaround }
            },
            { upsert: true, new: true },
            function (err, updatedReport) {
              if (err) {
                return logger.error(err);
              }
              let length = updatedReport.proofTurnArounds.length;
              let sum = 0;
              for (let i = 0; i < length; i++) {
                sum += parseInt(updatedReport.proofTurnArounds[i]);
              }
              proofsAvg = Math.round(sum / length);

              Report.updateOne(
                {
                  _id: updatedReport._id
                },
                { $set: { avgProofs: proofsAvg } },
                function (error, finalUpdatedReport) {
                  if (error) {
                    return logger.error(error);
                  }
                }
              );
            }
          );
        }
      } else if (foundOrder.currentStatus === "L. Revision Complete") {
        if (foundOrder.revisionRequestDate == null) {
          req.flash("error_msg", "Revision not requested - Cannot complete");
          res.redirect(`/orders/edit/${id}`);
          return;
        }

        if (foundOrder.revisionCompletionDate === null) {
          foundOrder.revisionCompletionDate = dayjs().format();

          let date1 = dayjs(foundOrder.revisionCompletionDate);
          let date2 = dayjs(foundOrder.revisionRequestDate);
          let diff = new DateDiff(date1, date2);
          const revisionTurnaround = parseInt(diff.days() + 1);

          let reportWeek = moment(dayjs().format()).format("W");
          let reportYear = dayjs().format("YYYY");
          let reportMonth = moment(dayjs().format()).format("M");

          let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);
          let revisionsAvg = 0;

          Report.findOneAndUpdate(
            {
              reportWeekNumber: reportWeek,
              reportYear: reportYear,
              reportWeekRange: reportWeekRange,
              reportMonth: reportMonth
            },
            {
              $inc: { revisionsCompleted: 1 },
              $push: { revisionTurnArounds: revisionTurnaround }
            },
            { upsert: true, new: true },
            function (err, updatedReport) {
              if (err) {
                return logger.error(err);
              }
              let length = updatedReport.revisionTurnArounds.length;
              let sum = 0;
              for (let i = 0; i < length; i++) {
                sum += parseInt(updatedReport.revisionTurnArounds[i], 10);
              }
              revisionsAvg = Math.round(sum / length);

              Report.updateOne(
                {
                  _id: updatedReport._id
                },
                { $set: { avgRevisions: revisionsAvg } },
                function (error, finalUpdatedReport) {
                  if (error) {
                    return logger.error(error);
                  }
                }
              );
            }
          );
        }
      }

      foundOrder.vendor = vendor;
      foundOrder.jbaPONum = jbaPONum;
      if (latestShipDate) {
        foundOrder.latestShipDate = dayjs(latestShipDate).set('hour', 7).format("YYYY-MM-DD HH:mm:ss");
      }

      if (latestInHand) {
        foundOrder.latestInHand = dayjs(latestInHand).set('hour', 7).format("YYYY-MM-DD HH:mm:ss");
      }

      if (eventDate) {
        foundOrder.eventDate = dayjs(eventDate).set('hour', 7).format("YYYY-MM-DD HH:mm:ss");
      }

      if (foundOrder.balanceOutstanding != null && foundOrder.balanceOutstanding != undefined) {
        if (foundOrder.balanceOutstanding > 0) {
          foundOrder.paymentStatus = "Balance Outstanding";
        } else if (foundOrder.balanceOutstanding < 0) {
          foundOrder.paymentStatus = "Refund Customer";
        } else if (foundOrder.balanceOutstanding == 0) {
          foundOrder.paymentStatus = "Complete";
        }
      }

      foundOrder.save(function (err, updatedOrder) {
        if (err) {
          return logger.error(err);
        } else {
          logger.info(
            `${updatedOrder.orderNum} - update by ${req.user.username}`
          );
          req.flash("success_msg", "Order Updated");
          res.redirect(`/orders/view/${id}`);
        }
      });
    };
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

        foundOrder.save(function (err, updatedOrder) {
          if (err) {
            return logger.error(err);
          } else {
            req.flash("success_msg", "Note Updated");
            res.redirect(`/orders/view/${id}`);
          }
        });
      } else {
        req.flash("error_msg", "Blank Note Ignored - Try again");
        res.redirect(`/orders/view/${id}`);
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
    if (!instruction) {
      req.flash("error_msg", "Instructions required - Try Again");
      res.redirect(`/orders/view/${id}`);
      return;
    }

    let revUser = req.body.isr;
    let currentStatus = "G. Waiting for Revision";
    let revisionRequestDate = dayjs().format();

    Order.findOne({ _id: id }, function (err, foundOrder) {
      if (err) {
        return logger.error(err);
      } else {
        foundOrder.instructions.push({
          instruction,
          instructionType: "Revision",
          user: revUser
        });

        foundOrder.currentStatus = currentStatus;
        foundOrder.currentArtist = "";
        foundOrder.revisionRequestDate = revisionRequestDate;
        foundOrder.revisionCompletionDate = null;

        foundOrder.save(function (err, updatedOrder) {
          if (err) {
            return logger.error(err);
          } else {
            logger.info(`${updatedOrder.orderNum} - revision request by ${req.user.username}`);
            req.flash("success_msg", "Revision Requested");
            res.redirect(`/orders/view/${id}`);
          }
        });
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

    Order.findOne({ _id: id }, function (err, foundOrder) {
      if (err) {
        return logger.error(err);
      } else {
        if (instruction) {
          foundOrder.instructions.push({
            instruction: instruction,
            instructionType: instructionType,
            user: noteUser
          });

          foundOrder.save(function (err, updatedOrder) {
            if (err) {
              return logger.error(err);
            } else {
              req.flash("success_msg", "Note Added");
              res.redirect(`/orders/view/${id}`);
            }
          });
        } else {
          req.flash("error_msg", "Note empty - Try again");
          res.redirect(`/orders/view/${id}`);
        }
      }
    });
  }
);

// @DESC - GETS THE WEEK NUMBER OF CURRENT WEEK
// SEC - PUBLIC FUNCTION
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
      7
    )
  );
};

// @DESC - GETS DATE RANGE FOR CURRENT WEEK
// SEC - PUBLIC FUNCTION
function getDateRangeOfWeek(weekNo, y) {
  var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  d1 = new Date("" + y + "");
  numOfdaysPastSinceLastMonday = d1.getDay() - 1;
  d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
  d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
  rangeIsFrom =
    months[d1.getMonth()] + "-" + d1.getDate() + "-" + d1.getFullYear();
  d1.setDate(d1.getDate() + 6);
  rangeIsTo =
    months[d1.getMonth()] + "-" + d1.getDate() + "-" + d1.getFullYear();
  return rangeIsFrom + " to " + rangeIsTo;
}

module.exports = router;
