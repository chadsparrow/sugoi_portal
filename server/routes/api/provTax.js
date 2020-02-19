const express = require('express');
const router = express.Router();
const provtaxController = require('../../controllers/api/provtax');

router.route('/').get(provtaxController.getProvinces);

module.exports = router;
