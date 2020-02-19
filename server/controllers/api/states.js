const logger = require('../../helpers/logs');
const State = require('../../models/State');

module.exports = {
	// @DESC - GETS ALL USA STATES AND TERRITORIES
	// SEC - PUBLIC API
	getStates: async (req, res, next) => {
		try {
			const states = await State.find().sort({ state: 1 });
			res.json(states);
		} catch (err) {
			logger.error(err);
		}
	}
};
