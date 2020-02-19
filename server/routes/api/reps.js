const express = require('express');
const router = express.Router();
const repsController = require('../../controllers/api/reps');

router.route('/').get(repsController.getReps);

module.exports = router;
