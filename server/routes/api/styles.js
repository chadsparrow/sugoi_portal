const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const Style = require("../../models/Style");

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/", (req, res) => {
  Style.find()
    .then(styles => {
      res.json(styles);
    })
    .catch(err => {
      logger.error(err);
    });
});

module.exports = router;
