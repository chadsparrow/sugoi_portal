const logger = require('../../helpers/logs');
const ProvTax = require('../../models/ProvTax');

module.exports = {
	// @DESC - GETS ALL PROVINCES AND PROVINCIAL TAX AMOUNTS FROM SERVER
	// SEC - PUBLIC API
	getProvinces: async (req, res, next) => {
		try {
			const provs = await ProvTax.find().sort({ province: 1 });
			res.json(provs);
		} catch (err) {
			logger.error(err);
		}
	}
};
