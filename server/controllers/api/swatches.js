const logger = require('../../helpers/logs');
const Swatch = require('../../models/Swatch');

module.exports = {
	// @DESC - GETS ALL SWATCHES FROM SERVER
	// SEC - PUBLIC API
	getSwatches: async (req, res, next) => {
		try {
			const swatches = await Swatch.find();
			res.json(swatches);
		} catch (err) {
			logger.error(err);
		}
	}
};
