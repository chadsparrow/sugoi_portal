const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Report = require("../models/Report");

router.get("/", (req, res) => {
  Report.find().then(reports => {
    res.json(reports);
  });
});

module.exports = router;
