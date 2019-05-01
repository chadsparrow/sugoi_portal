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
      usd1: {
        type: Number
      },
      usd6: {
        type: Number
      },
      usd6qd: {
        type: Number
      },
      usd12: {
        type: Number
      },
      usd12qd: {
        type: Number
      },
      usd24: {
        type: Number
      },
      usd24qd: {
        type: Number
      },
      usd50: {
        type: Number
      },
      usd100: {
        type: Number
      },
      usd200: {
        type: Number
      },
      usd500: {
        type: Number
      },
      cad1: {
        type: Number
      },
      cad6: {
        type: Number
      },
      cad6qd: {
        type: Number
      },
      cad12: {
        type: Number
      },
      cad12qd: {
        type: Number
      },
      cad24: {
        type: Number
      },
      cad24qd: {
        type: Number
      },
      cad50: {
        type: Number
      },
      cad100: {
        type: Number
      },
      cad200: {
        type: Number
      },
      cad500: {
        type: Number
      },
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
