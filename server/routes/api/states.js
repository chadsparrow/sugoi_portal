const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const State = require("../../models/State");

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/", (req, res) => {
    State.find()
        .sort({ state: 1 })
        .then(states => {
            res.json(states);
        })
        .catch(err => {
            logger.error(err);
        });
});

module.exports = router;