const logger = require('../../helpers/logs');
// includes model for mongodb
const GraphicCode = require('../../models/GraphicCode');

module.exports = {
	getGraphicCodes: async (req, res, next) => {
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
	}
};
