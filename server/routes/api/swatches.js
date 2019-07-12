const express = require('express');
const router = express.Router();
const logger = require('../../helpers/logs');

// includes model for mongodb
const Swatch = require('../../models/Swatch');

// @DESC - GETS ALL SWATCHES FROM SERVER
// SEC - PUBLIC API
router.get('/', async (req, res) => {
  try {
    const swatches = await Swatch.find();
    res.json(swatches);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = router;
