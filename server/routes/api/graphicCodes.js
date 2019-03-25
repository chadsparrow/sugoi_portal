const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const GraphicCode = require("../../models/GraphicCode");

// @DESC - GETS ALL QD GRAPHIC CODES FROM THE SERVER
// SEC - PUBLIC API
router.get("/", (req, res) => {
  GraphicCode.find()
    .then(graphicCodes => {
      res.json(graphicCodes);
    })
    .catch(err => {
      logger.error(err);
    });
});

module.exports = router;
