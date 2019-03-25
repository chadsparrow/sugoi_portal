const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const Swatch = require("../../models/Swatch");

// @DESC - GETS ALL SWATCHES FROM SERVER
// SEC - PUBLIC API
router.get("/", (req, res) => {
    Swatch.find()
        .then(swatches => {
            res.json(swatches);
        })
        .catch(err => {
            logger.error(err);
        });
});

module.exports = router;