const express = require('express');
const router = express.Router();
const logger = require('../../helpers/logs');

// includes model for mongodb
const ProvTax = require('../../models/ProvTax');

// @DESC - GETS ALL PROVINCES AND PROVINCIAL TAX AMOUNTS FROM SERVER
// SEC - PUBLIC API
router.get('/', async (req, res) => {
  try {
    const provs = await ProvTax.find().sort({ province: 1 });
    res.json(provs);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = router;
