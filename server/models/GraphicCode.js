const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GraphicCodeSchema = new Schema({
	graphicCode: String,
	graphicName: String,
	colours: Number,
	colourWays: [
		{
			code: String
		}
	]
});

module.exports = mongoose.model('graphiccodes', GraphicCodeSchema);
