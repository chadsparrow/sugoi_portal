const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../../helpers/auth");

// includes model for mongodb
const Order = require("../../models/Order");

// @DESC - GETS JSON DATA OF ALL ORDERS
// SEC - MUST BE LOGGED IN
router.get("/", (req, res) => {
  Order.find({}, { checkpoints: 0, instructions: 0 })
    .then(orders => {
      res.json(orders);
    })
    .catch(err => {
      logger.error(err);
    });
});

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/:orderNum", (req, res) => {
  Order.findOne({ orderNum: req.params.orderNum }, { checkpoints: 0, instructions: 0 })
    .then(order => {
      res.json(order);
    })
    .catch(err => {
      logger.error(err);
    });
});

router.put("/:orderNum", (req, res) => {
  const requestOrder = req.body;
  Order.findOneAndUpdate({ orderNum: req.params.orderNum }, requestOrder, { new: true, upsert: true })
    .then(order => {
      res.status(200).json(order);
    })
    .catch(err => {
      logger.error(err);
    })
});

router.put("/:orderNum", (req, res) => {
  console.log(req.body);
});

module.exports = router;
