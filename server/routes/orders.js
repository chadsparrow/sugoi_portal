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
const CustomArtist = require('../models/CustomArtist');
const CustomRep = require('../models/CustomRep');

// @DESC - GETS ALL ORDERS AND DISPLAYS IN ORDER TABLE
// SEC - MUST BE LOGGED IN
router.get("/all", ensureAuthenticated, (req, res) => {
  let pageTitle = "All";
  Order.find().then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

// @DESC - GETS ALL IN PROGRESS ORDERS
// SEC - MUST BE LOGGED IN
router.get("/", ensureAuthenticated, (req, res) => {
  let pageTitle = "In Progress";
  Order.find({
    currentStatus: {
      $not: { $in: ["V. Sent to Vendor", "W. CANCELLED", "1. Initial", "X. Archived"] }
    }
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

// @DESC - GETS ALL IN INITIAL ORDERS - BEFORE IN PROGRESS
// SEC - MUST BE LOGGED IN
router.get("/initial", ensureAuthenticated, (req, res) => {
  let pageTitle = "Initial Orders";
  Order.find({
    currentStatus: "1. Initial"
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});

// @DESC - GETS ALL IN COMPLETED ORDERS - IN PRODUCTION
// SEC - MUST BE LOGGED IN
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

// @DESC - GETS ALL CANCELLED ORDERS
// SEC - MUST BE LOGGED IN
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

// @DESC - GETS ALL IN ARCHIVED ORDERS - MAINLY NEVER GONE TO PRODUCTION
// SEC - MUST BE LOGGED IN
router.get("/archived", ensureAuthenticated, (req, res) => {
  let pageTitle = "Archived";
  Order.find({
    currentStatus: "X. Archived"
  }).then(orders => {
    res.render("orders/index", {
      orders,
      pageTitle
    });
  });
});


// @DESC - GETS ADD A NEW ORDER PAGE
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.get("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  CustomRep.find().then(customReps => {
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
      vendor,
      customReps
    });
  }).catch(err => logger.error(err));
});

// @DESC - POSTS A NEW ORDER INTO COLLECTION BASED ON ADD ORDER PAGE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.post("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let {
    orderNum,
    accountNum,
    priority,
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

  if (instruction != null || instruction != "") {
    instructions.push({
      instruction: instruction,
      instructionType: "Initial",
      user: isr
    });
  }

  Order.findOne({ orderNum: orderNum }, function (err, order) {
    if (order) {
      req.flash("error_msg", "Order Number already entered");
      res.redirect("/orders/add");
      return;
    } else {
      const newOrder = new Order({
        orderNum,
        accountNum,
        priority,
        eventDate,
        latestInHand,
        isr,
        client,
        instructions,
        vendor,
      });

      newOrder
        .save()
        .then(order => {
          logger.info(`${order.orderNum} added to database by ${req.user.username}`);
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
  Order.findOne({
    _id: req.params.id
  }).then(order => {
    CustomArtist.find().then(customArtists => {
      res.render("orders/edit", {
        order,
        customArtists
      });
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
    latestShipDate
  } = req.body;

  Order.findOne({ _id: id }, function (err, foundOrder) {
    if (err) {
      return logger.error(err);
    } else {
      foundOrder.client = client;
      foundOrder.priority = priority;
      if (currentStatus === foundOrder.currentStatus) {
        foundOrder.currentArtist = currentArtist;
      } else {
        foundOrder.currentStatus = currentStatus;
        if (foundOrder.currentStatus === "A. Waiting for Proof") {
          if (foundOrder.proofRequestDate === null) {
            foundOrder.currentArtist = "";
            foundOrder.proofRequestDate = moment().utc().format();
          }
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
            req.flash("error_msg", "Order has not been signed off yet");
            res.redirect("/orders");
            return;
          } else {
            if (foundOrder.uploadDate === null) {
              foundOrder.uploadDate = moment()
                .utc()
                .format();
              foundOrder.sentVendor = null;
              let date1 = moment(Date.parse(foundOrder.uploadDate));
              let date2 = moment(Date.parse(foundOrder.signedOffDate));
              let diff = new DateDiff(date1, date2);
              const outputTurnaround = parseInt(diff.days() + 1);
              foundOrder.outputTurnaround = outputTurnaround;

              let reportWeek = moment.utc().format("W");
              let reportYear = moment.utc().format("YYYY");
              let reportMonth = moment()
                .utc()
                .format("M");

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
          }
        } else if (foundOrder.currentStatus === "V. Sent to Vendor") {
          if (foundOrder.signedOffDate === null) {
            req.flash("error_msg", "Order has not been signed off");
            res.redirect("/orders");
            return;
          } else {
            if (foundOrder.sentVendor === null) {
              foundOrder.sentVendor = moment()
                .utc()
                .format();
            }
          }
        } else if (foundOrder.currentStatus === "M. Waiting for Output") {
          if (foundOrder.signedOffDate === null) {
            foundOrder.signedOffDate = moment()
              .utc()
              .format();
            let reportWeek = moment()
              .utc()
              .format("W");
            let reportYear = moment()
              .utc()
              .format("YYYY");
            let reportMonth = moment()
              .utc()
              .format("M");

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
        } else if (foundOrder.currentStatus === "F. Proof Complete") {
          if (foundOrder.proofRequestDate === null) {
            req.flash("error_msg", "Proof was not requested");
            res.redirect("/orders");
            return;
          }
          if (foundOrder.proofCompletionDate === null) {
            foundOrder.proofCompletionDate = moment()
              .utc()
              .format();
            let date1 = moment(Date.parse(foundOrder.proofCompletionDate));
            let date2 = moment(Date.parse(foundOrder.proofRequestDate));
            let diff = new DateDiff(date1, date2);
            const proofTurnaround = parseInt(diff.days() + 1);
            foundOrder.proofTurnaround = proofTurnaround;

            let reportWeek = moment()
              .utc()
              .format("W");
            let reportYear = moment()
              .utc()
              .format("YYYY");
            let reportMonth = moment()
              .utc()
              .format("M");

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
            req.flash("error_msg", "Revision not requested");
            res.redirect("/orders");
            return;
          }
          if (foundOrder.revisionCompletionDate === null) {
            foundOrder.revisionCompletionDate = moment()
              .utc()
              .format();

            let date1 = moment(Date.parse(foundOrder.revisionCompletionDate));
            let date2 = moment(Date.parse(foundOrder.revisionRequestDate));
            let diff = new DateDiff(date1, date2);
            const revisionTurnaround = parseInt(diff.days() + 1);

            let reportWeek = moment()
              .utc()
              .format("W");
            let reportYear = moment()
              .utc()
              .format("YYYY");
            let reportMonth = moment()
              .utc()
              .format("M");

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

      foundOrder.save(function (err, updatedOrder) {
        if (err) {
          return logger.error(err);
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

        foundOrder.save(function (err, updatedOrder) {
          if (err) {
            return logger.error(err);
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
    if (instruction === "" || instruction === null) {
      req.flash("error_msg", "Blank Request Ignored");
      res.redirect("/orders/view/" + id);
    }
    let instructionType = "Revision";
    let revUser = req.body.isr;
    let currentStatus = "G. Waiting for Revision";
    let revisionRequestDate = moment()
      .utc()
      .format();

    Order.findOne({ _id: id }, function (err, foundOrder) {
      if (err) {
        return logger.error(err);
      } else {
        foundOrder.instructions.push({
          instruction: instruction,
          instructionType: instructionType,
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
            logger.info(
              `${updatedOrder.orderNum} - revision request by ${
              req.user.username
              }`
            );
            req.flash("success_msg", "Revision Requested");
            res.redirect("/orders/view/" + id);
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
