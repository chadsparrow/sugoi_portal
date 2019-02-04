const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Order = require("../models/Order");

router.get("/:orderNum", [ensureAuthenticated, ensureAdmin], (req, res) => {

});

module.exports = router;
