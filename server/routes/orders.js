const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// styles route to show all the styles in mongodb
router.get("/", ensureAuthenticated, (req, res) => {
  Order.find().then(orders => {
    res.render("orders/orders", {
      orders
    });
  });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("orders/addorder");
});

router.get("/:orderNum", (req, res) => {
  res.send("Loaded order: " + req.params.orderNum);
});

module.exports = router;
