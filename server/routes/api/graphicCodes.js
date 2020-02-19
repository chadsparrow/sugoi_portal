const express = require('express');
const router = express.Router();
const graphiccodesController = require('../../controllers/api/graphiccodes');

router.route('/').get(graphiccodesController.getGraphicCodes);

module.exports = router;
