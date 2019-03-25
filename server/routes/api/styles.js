const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated } = require("../../helpers/auth");

// includes model for mongodb
const Style = require("../../models/Style");

// @DESC - GETS ALL STYLE INFO FROM SERVER
// SEC - MUST BE LOGGED IN
router.get("/", ensureAuthenticated, (req, res) => {
  Style.find()
    .then(styles => {
      res.json(styles);
    })
    .catch(err => {
      logger.error(err);
    });
});

module.exports = router;
