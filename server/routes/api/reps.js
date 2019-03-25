const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const CustomRep = require("../../models/CustomRep");

// @DESC - GETS ALL THE REPS AT SUGOI
// SEC - PUBLIC API
router.get("/", (req, res) => {
    CustomRep.find()
        .then(reps => {
            res.json(reps);
        })
        .catch(err => {
            logger.error(err);
        });
});

module.exports = router;
