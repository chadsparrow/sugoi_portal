const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

// includes model for mongodb
const CustomRep = require("../../models/CustomRep");

// @DESC - GETS ALL THE REPS AT SUGOI OR LG Based on who's logged in.
// SEC - PUBLIC API
router.get("/", async (req, res) => {
    try {
        let reps = [];
        if (req.user.lgUser) {
            reps = await CustomRep.find({ office: "LG" });
        } else {
            reps = await CustomRep.find({ office: "SUGOI" });
        }
        res.json(reps);
    } catch (error) {
        logger.log(error);
    }
});

module.exports = router;
