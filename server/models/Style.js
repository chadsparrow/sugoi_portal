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
      styleCode:{
        type: String
      },
      autobahnCode: {
        type: String
      },
      jbaCode:{
        type: String
      },
      brand: {
        type: String
      },
      fabric: {
        type: String
      },
      sizeRange: {
        type: String
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
      usaTariff: String,
      cadTariff: String,
      costUSD: [Number]
    }
  ],
  zipperOptions: [String],
  contrastOptions: [String],
  quickDesign: Boolean,
  combinableWith: [String],
  factory: String
});

module.exports = mongoose.model("styles2019", StyleSchema);
