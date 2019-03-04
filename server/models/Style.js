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
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd6: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd12: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd24: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd50: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd100: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd200: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      usd500: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad1: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad6: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad12: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad24: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad50: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad100: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad200: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
      },
      cad500: {
        type: Number,
        get: v => v.toFixed(2),
        set: v => v.toFixed(2)
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
