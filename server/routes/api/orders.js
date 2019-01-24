const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN ORDER TABLE
// SEC - MUST BE LOGGED IN
router.get("/:orderNum", ensureAuthenticated, (req, res) => {
  Order.find({ orderNum: req.params.orderNum }).then(order => {
    res
      .status(200)
      .send(`OrderNum: ${order.orderNum} found! - ${order.client}`);
  });
});

module.exports = router;
