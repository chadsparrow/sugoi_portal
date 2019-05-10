const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../../helpers/auth");

// includes model for mongodb
const Order = require("../../models/Order");

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/:orderNum", ensureAuthenticated, (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum }, { checkpoints: 0, instructions: 0 })
    .then(order => {
      res.json(order);
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
      foundOrder.orderLines.push({ lineNumber: req.params.lineNumber });
      foundOrder.save((err, savedOrder) => {
        if (err) {
          logger.error(err);
          return;
        }
        res.json(savedOrder);
      })
    }).catch(err => {
      logger.error(err);
    })
});

// @DESC - ADDS ITEM TO LINE BASED ON LINE NUMBER
// SEC - MUST BE LOGGED IN
router.put('/:orderNum/:lineNumber/:itemNumber', [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum })
    .then(foundOrder => {
      let newItemNumber = `${foundOrder.orderNum}-${foundOrder.orderLines[req.params.lineNumber].lineNumber}-${req.params.itemNumber}`;
      foundOrder.orderLines[req.params.lineNumber].items.push({ itemNumber: newItemNumber });
      foundOrder.save((err, savedOrder) => {
        if (err) {
          logger.error(err);
          return;
        }
        res.json(savedOrder);
      })
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
