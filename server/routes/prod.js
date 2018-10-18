const express = require("express");
const router = express.Router();

const {
  ensureAuthenticated,
  ensureEditOrders,
  ensureViewProd,
  ensureEditProd
} = require("../helpers/auth");

// includes model for mongodb
const Order = require("../models/Order");

// @DESC - GETS ALL ORDERS AND DISPLAYS IN PROD TABLE
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/", [ensureAuthenticated, ensureViewProd], (req, res) => {
  Order.find().then(orders => {
    res.render("orders/prod", {
      orders
    });
  });
});

// @DESC - GETS ORDER BY ID# AND DISPLAYS IN MODAL
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/:id", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let id = req.params.id;
  res.send(`View Prod by ID# ${id}`);
});

// @DESC - GETS ORDER BY ID# AND DISPLAYS IN MODAL WITH EDITABLE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get("/edit/:id", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let id = req.params.id;
  res.send(`Edit Prod by ID# ${id}`);
});

// @DESC - UPDATES ORDER BY ID# BASED ON CHANGES TO EDIT FORM
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.put("/edit/:id", [ensureAuthenticated, ensureViewProd], (req, res) => {
  let id = req.params.id;
  res.send(`Edit Prod by ID# ${id}`);
});

module.exports = router;
