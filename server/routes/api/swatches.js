const express = require('express');
const router = express.Router();
const swatchController = require('../../controllers/api/swatches');

// includes model for mongodb

router.route('/').get(swatchController.getSwatches);

module.exports = router;
