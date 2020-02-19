const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/api/states');

router.route('/').get(statesController.getStates);

module.exports = router;
