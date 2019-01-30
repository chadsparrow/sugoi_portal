const mongoose = require("mongoose");
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
      usd1: Number,
      usd6: Number,
      usd12: Number,
      usd24: Number,
      usd50: Number,
      usd100: Number,
      usd200: Number,
      usd500: Number,
      cad1: Number,
      cad6: Number,
      cad12: Number,
      cad24: Number,
      cad50: Number,
      cad100: Number,
      cad200: Number,
      cad500: Number,
      minUnits: Number,
      usdTariff: String,
      cadTariff: String,
      costUSD: [Number],
      zap: Boolean
    }
  ],
  zipperOptions: [String],
  contrastOptions: [String],
  quickDesign: Boolean,
  combinableWith: [String],
  factory: String
});

module.exports = mongoose.model("styles2019", StyleSchema);
