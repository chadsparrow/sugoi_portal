const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 2);
const Schema = mongoose.Schema;

// Create Schema
const SGPrices2019Schema = new Schema({
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
  cad6: {
    type: Float,
    default: 0.0
  },
  cad12: {
    type: Float,
    default: 0.0
  },
  cad24: {
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
  cad200: {
    type: Float,
    default: 0.0
  },
  cad500: {
    type: Float,
    default: 0.0
  },
  cadTariff: {
    type: String,
    required: true
  },
  usd1: {
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
  usd24: {
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
  usd200: {
    type: Float,
    default: 0.0
  },
  usd500: {
    type: Float,
    default: 0.0
  },
  usdTariff: {
    type: String,
    required: true
  },
  costUSD: {
    type: Float,
    default: 0.0
  }
});

module.exports = mongoose.model("sgprices2019", SGPrices2019Schema);
