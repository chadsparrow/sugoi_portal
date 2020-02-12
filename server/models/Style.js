const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);
const Schema = mongoose.Schema;

// Create Schema
const StyleSchema = new Schema({
	description: String,
	style: String,
	configurations: [
		{
			extendedDescription: {
				type: String
			},
			gender: {
				type: String
			},
			configuration: {
				type: String
			},
			styleCode: {
				type: String,
				uppercase: true
			},
			autobahnCode: {
				type: String,
				uppercase: true
			},
			jbaCode: {
				type: String,
				uppercase: true
			},
			brand: {
				type: String
			},
			fabric: {
				type: String
			},
			sizeRange: {
				type: String,
				uppercase: true
			},
			usd1: {
				type: Float
			},
			usd6: {
				type: Float
			},
			usd6qd: {
				type: Float
			},
			usd12: {
				type: Float
			},
			usd12qd: {
				type: Float
			},
			usd24: {
				type: Float
			},
			usd24qd: {
				type: Float
			},
			usd50: {
				type: Float
			},
			usd100: {
				type: Float
			},
			usd200: {
				type: Float
			},
			usd500: {
				type: Float
			},
			cad1: {
				type: Float
			},
			cad6: {
				type: Float
			},
			cad6qd: {
				type: Float
			},
			cad12: {
				type: Float
			},
			cad12qd: {
				type: Float
			},
			cad24: {
				type: Float
			},
			cad24qd: {
				type: Float
			},
			cad50: {
				type: Float
			},
			cad100: {
				type: Float
			},
			cad200: {
				type: Float
			},
			cad500: {
				type: Float
			},
			minUnits: Number,
			usdTariff: String,
			cadTariff: String,
			costUSD: [Float],
			zap: Boolean
		}
	],
	zipperOptions: [String],
	contrastOptions: [String],
	quickDesign: Boolean,
	combinableWith: [String],
	factory: String
});

module.exports = mongoose.model('styles2019', StyleSchema);
