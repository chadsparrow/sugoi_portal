const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);
const Schema = mongoose.Schema;

// Create Schema
const SGPrices2020Schema = new Schema({
	styleCode: {
		type: String,
		required: true
	},
	costCAD: {
		type: Float,
		default: 0.0
	},
	cad1: {
		type: Float,
		default: 0.0
	},
	cad2: {
		type: Float,
		default: 0.0
	},
	cad6: {
		type: Float,
		default: 0.0
	},
	cad12: {
		type: Float,
		default: 0.0
	},
	cad50: {
		type: Float,
		default: 0.0
	},
	cad100: {
		type: Float,
		default: 0.0
	},
	cad250: {
		type: Float,
		default: 0.0
	},
	cad500: {
		type: Float,
		default: 0.0
	},
	usd1: {
		type: Float,
		default: 0.0
	},
	usd2: {
		type: Float,
		default: 0.0
	},
	usd6: {
		type: Float,
		default: 0.0
	},
	usd12: {
		type: Float,
		default: 0.0
	},
	usd50: {
		type: Float,
		default: 0.0
	},
	usd100: {
		type: Float,
		default: 0.0
	},
	usd250: {
		type: Float,
		default: 0.0
	},
	usd500: {
		type: Float,
		default: 0.0
	},
	costUSD: {
		type: Float,
		default: 0.0
	},
	cadTariff: {
		type: String,
		required: true
	},
	usdTariff: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('sgprices2020', SGPrices2020Schema);
