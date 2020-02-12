const express = require('express');
const router = express.Router();
const logger = require('../../helpers/logs');

// includes model for mongodb
const GraphicCode = require('../../models/GraphicCode');

// @DESC - GETS ALL QD GRAPHIC CODES FROM THE SERVER
// SEC - PUBLIC API
router.get('/', async (req, res) => {
	try {
		let graphicCodes = [];
		if (req.user.lgUser) {
			graphicCodes = await GraphicCode.find({
				$or: [{ graphicCode: 'CUSTM' }, { brand: 'Sombrio' }]
			});
		} else {
			graphicCodes = await GraphicCode.find();
		}
		res.json(graphicCodes);
	} catch (err) {
		logger.error(err);
	}
});

module.exports = router;
