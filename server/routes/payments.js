const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");
const Proof = require("../models/Proof");

router.get("/", [ensureAuthenticated, ensureEditOrders], (req, res) => {
  Order.find().then(orders => {
    res.render("payments/", {
      orders
    });
  });
});

module.exports = router;
