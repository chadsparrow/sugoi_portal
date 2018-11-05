const express = require("express");
const router = express.Router();
const winston = require("winston");
const LogzioWinstonTransport = require("winston-logzio");
const logzioWinstonTransport = new LogzioWinstonTransport({
  level: "info",
  name: "custom-proofs",
  token: "rmcJlRvMcLYYBkfkKwQlHzvsnDtUtWLO"
});

const logger = winston.createLogger({
  transports: [logzioWinstonTransport]
});

// includes model for mongodb
const Style = require("../models/Style");

// styles route to show all the styles in mongodb
router.get("/", (req, res) => {
  Style.find()
    .sort([["styleNum", "asc"]])
    .then(styles => {
      res.render("styles", {
        styles
      });
    })
    .catch(err => {
      logger.log("error", err);
      req.flash("error_msg", err);
      res.redirect("/user/login");
    });
});

module.exports = router;
