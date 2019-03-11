const express = require("express");
const router = express.Router();
const DateDiff = require("date-diff");
const moment = require("moment-timezone");
const dayjs = require('dayjs');
const logger = require("../helpers/logs");
const jsonxml = require('jsontoxml');
const { ensureAuthenticated, ensureEditOrders, ensureAdmin } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");
const Report = require("../models/Report");
const Proof = require("../models/Proof");
const CustomArtist = require('../models/CustomArtist');
const CustomRep = require('../models/CustomRep');

const d = new Date().toISOString();

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

router.get("/po/:orderNum", [ensureAuthenticated, ensureAdmin], (req, res) => {
  let pageTitle = `${req.params.orderNum} PO`;
  let poDate = dayjs().format('MM/DD/YYYY');
  let items = [];
  Order.findOne({ orderNum: req.params.orderNum }).then(order => {
    for (let orderLine of order.orderLines) {
      if (!orderLine.cancelled) {
        for (let item of orderLine.items) {
          if (!item.cancelled) {
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
  });
});

router.get("/xml/:orderNum", ensureAuthenticated, (req, res) => {
  let items = [];
  Order.findOne({ orderNum: req.params.orderNum })
    .then(order => {
      const newOrderObject = {};
      newOrderObject.SAP = [];

      let client = order.client;
      if (client) {
        client.replace(/&/g, '&amp;');
        client.replace(/</g, '&lt;');
        client.replace(/>/g, '&gt;');
        client.replace(/"/g, '&quot;');
        client.replace(/'/g, '&apos;');
      }

      for (let orderLine of order.orderLines) {
        if (!orderLine.cancelled) {
          for (let item of orderLine.items) {
            if (!item.cancelled) {
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
              extendedDescription.replace(/&/g, '&amp;');
              extendedDescription.replace(/</g, '&lt;');
              extendedDescription.replace(/>/g, '&gt;');
              extendedDescription.replace(/"/g, '&quot;');
              extendedDescription.replace(/'/g, '&apos;');

              let customerPO = order.orderNotes;
              if (order.orderNotes) {
                customerPO.replace(/&/g, '&amp;');
                customerPO.replace(/</g, '&lt;');
                customerPO.replace(/>/g, '&gt;');
                customerPO.replace(/"/g, '&quot;');
                customerPO.replace(/'/g, '&apos;');
              } else {
                customerPO = '.'
              }

              newOrderObject.SAP.push({
                'item': {
                  'SALESORDER': order.orderNum,
                  'CLIENT': client,
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
                  'CUSTOMERPO': customerPO,
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
  Order.findOne({})
    .sort('-orderNum')
    .exec((err, order) => {
      CustomRep.find().then(customReps => {
        const orderNum = (parseInt(order.orderNum) + 1).toString();
        const priority = "";
        const currentStatus = "";
        const isr = "";
        const instruction = "";
        const vendor = "";
        res.render("orders/add", {
          orderNum,
          priority,
          currentStatus,
          isr,
          instruction,
          vendor,
          customReps
        });
      }).catch(err => logger.error(err));
    });
});

// @DESC - POSTS A NEW ORDER INTO COLLECTION BASED ON ADD ORDER PAGE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE EDIT ORDERS ACCESS
router.post("/add", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  let {
    orderNum,
    priority,
    isr,
    instruction,
    vendor
  } = req.body;
  orderNum = orderNum.toString();
  isr = isr.toUpperCase();
  const proofRequestDate = dayjs(d).format();

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
        priority,
        isr,
        instructions,
        vendor,
        proofRequestDate
      });

      newOrder
        .save()
        .then(order => {
          logger.info(`${order.orderNum} added to database by ${req.user.username}`);
          req.flash("success_msg", "Order Saved");
          if (order.currentStatus === "1. Initial") {
            res.redirect("/orders/initial");
          } else {
            res.redirect("/orders");
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
    priority,
    currentArtist,
    currentStatus,
    vendor,
    jbaPONum,
    latestShipDate
  } = req.body;

  Order.findOne({ _id: id }, function (err, foundOrder) {
    if (err) {
      return logger.error(err);
    } else {
      foundOrder.currentArtist = currentArtist;
      foundOrder.priority = priority;

      foundOrder.currentStatus = currentStatus;
      if (foundOrder.currentStatus === "A. Waiting for Proof") {
        if (foundOrder.proofRequestDate === null) {
          foundOrder.proofRequestDate = dayjs(d).format();
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
          req.flash("error_msg", "Order has not been signed off yet");
          res.redirect("/orders");
          return;
        }
        if (foundOrder.uploadDate === null) {
          foundOrder.uploadDate = dayjs(d).format();
          foundOrder.sentVendor = null;
          let date1 = dayjs(foundOrder.uploadDate);
          let date2 = dayjs(foundOrder.signedOffDate);
          let diff = new DateDiff(date1, date2);
          const outputTurnaround = parseInt(diff.days() + 1);
          foundOrder.outputTurnaround = outputTurnaround;
          let reportWeek = moment(dayjs(d).format()).format("W");
          let reportYear = dayjs(d).format("YYYY");
          let reportMonth = moment(dayjs(d).format()).format("M");
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
          req.flash("error_msg", "Order has not been signed off");
          res.redirect("/orders");
          return;
        }
        if (foundOrder.sentVendor === null) {
          foundOrder.sentVendor = dayjs(d).format();
        }
      } else if (foundOrder.currentStatus === "M. Waiting for Output") {
        if (foundOrder.signedOffDate === null) {
          foundOrder.signedOffDate = dayjs(d).format();
          let reportWeek = moment(dayjs(d).format()).format("W");
          let reportYear = dayjs(d).format("YYYY");
          let reportMonth = moment(dayjs(d).format()).format("M");

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
          foundOrder.proofCompletionDate = dayjs(d).format();
          let date1 = dayjs(foundOrder.proofCompletionDate);
          let date2 = dayjs(foundOrder.proofRequestDate);
          let diff = new DateDiff(date1, date2);
          const proofTurnaround = parseInt(diff.days() + 1);
          foundOrder.proofTurnaround = proofTurnaround;

          let reportWeek = moment(dayjs(d).format()).format("W");
          let reportYear = dayjs(d).format("YYYY");
          let reportMonth = moment(dayjs(d).format()).format("M");

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
          foundOrder.revisionCompletionDate = dayjs(d).format();

          let date1 = dayjs(foundOrder.revisionCompletionDate);
          let date2 = dayjs(foundOrder.revisionRequestDate);
          let diff = new DateDiff(date1, date2);
          const revisionTurnaround = parseInt(diff.days() + 1);

          let reportWeek = moment(dayjs(d).format()).format("W");
          let reportYear = dayjs(d).format("YYYY");
          let reportMonth = moment(dayjs(d).format()).format("M");

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
      foundOrder.latestShipDate = latestShipDate;

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
          res.redirect("/orders");
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
    let revisionRequestDate = dayjs(d).format();

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
