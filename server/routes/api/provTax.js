const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const ProvTax = require("../../models/ProvTax");

// @DESC - GETS ALL PROVINCES AND PROVINCIAL TAX AMOUNTS FROM SERVER
// SEC - PUBLIC API
router.get("/", (req, res) => {
    ProvTax.find()
        .sort({ province: 1 })
        .then(provs => {
            res.json(provs);
        })
        .catch(err => {
            logger.error(err);
        });
});

module.exports = router;