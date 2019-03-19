const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");
const dayjs = require('dayjs');

const { ensureAuthenticated, ensureEditOrders } = require("../../helpers/auth");

// includes model for mongodb
const Order = require("../../models/Order");

// // @DESC - GETS JSON DATA OF ALL ORDERS
// // SEC - MUST BE LOGGED IN
// router.get("/", ensureAuthenticated, (req, res) => {
//   Order.find({}, { checkpoints: 0, instructions: 0 })
//     .then(orders => {
//       res.json(orders);
//     })
//     .catch(err => {
//       logger.error(err);
//     });
// });

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/:orderNum", ensureAuthenticated, (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum }, { checkpoints: 0, instructions: 0 })
    .then(order => {
      let { signedOffDate, enteredDate } = order;
      if (dayjs(enteredDate).isBefore(dayjs(new Date(2019, 3, 18)))) {
        res.status(403).send('Order was entered prior to switchover');
      } else {
        if (signedOffDate === null || signedOffDate === '' || signedOffDate === undefined) {
          res.json(order);
        } else {
          res.status(403).send('Order is signed off - access Forbidden');
        }
      }
    })
    .catch(err => {
      logger.error(err);
    });
});

// @DESC - ADDS LINE TO ORDER BASED ON ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.put('/:orderNum/:lineNumber', [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum })
    .then(foundOrder => {
      let { signedOffDate } = foundOrder;
      if (signedOffDate === null || signedOffDate === '' || signedOffDate === undefined) {
        foundOrder.orderLines.push({ lineNumber: req.params.lineNumber });
        foundOrder.save((err, savedOrder) => {
          if (err) {
            logger.error(err);
            return;
          }
          res.json(savedOrder);
        })
      } else {
        res.status(403).send('Order is signed off - access Forbidden');
      }
    }).catch(err => {
      logger.error(err);
    })
});

// @DESC - ADDS ITEM TO LINE BASED ON LINE NUMBER
// SEC - MUST BE LOGGED IN
router.put('/:orderNum/:lineNumber/:itemNumber', [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum })
    .then(foundOrder => {
      let { signedOffDate } = foundOrder;
      if (signedOffDate === null || signedOffDate === '' || signedOffDate === undefined) {
        let newItemNumber = `${foundOrder.orderNum}-${foundOrder.orderLines[req.params.lineNumber].lineNumber}-${req.params.itemNumber}`
        foundOrder.orderLines[req.params.lineNumber].items.push({ itemNumber: newItemNumber });
        foundOrder.save((err, savedOrder) => {
          if (err) {
            logger.error(err);
            return;
          }
          res.json(savedOrder);
        })
      } else {
        res.status(403).send('Order is signed off - access Forbidden');
      }
    }).catch(err => {
      logger.error(err);
    })
});

router.put("/:orderNum", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  const requestOrder = req.body;
  Order.findOneAndUpdate({ orderNum: req.params.orderNum }, requestOrder, { new: true, upsert: true })
    .then(order => {
      res.status(200).json(order);
    })
    .catch(err => {
      logger.error(err);
    })
});

module.exports = router;
