const logger = require('../../helpers/logs');
const CustomRep = require('../../models/CustomRep');

module.exports = {
	// @DESC - GETS ALL THE REPS AT SUGOI OR LG Based on who's logged in.
	// SEC - PUBLIC API.
	getReps: async (req, res, next) => {
		try {
			let reps = [];
			if (req.user.lgUser) {
				reps = await CustomRep.find({ office: 'LG' }).sort('text');
			} else {
				reps = await CustomRep.find({ office: 'SUGOI' }).sort('text');
			}
			res.json(reps);
		} catch (err) {
			logger.error(err);
		}
	}
};
