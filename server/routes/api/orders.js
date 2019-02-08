const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../../helpers/auth");

// includes model for mongodb
const Order = require("../../models/Order");

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
  console.log(requestOrder);
  Order.findOneAndUpdate({ orderNum: req.params.orderNum })
    .then(order => {
      console.log(order);
    })
    .catch(err => {
      logger.error(err);
    })
});

router.put("/:orderNum", (req, res) => {
  console.log(req.body);
});

module.exports = router;
