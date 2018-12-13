const express = require("express");
const router = express.Router();
const logger = require("../helpers/logs");

router.get("/", (req, res) => res.render("./confirmations/"));

module.exports = router;
