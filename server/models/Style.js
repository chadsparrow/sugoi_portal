const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleSchema = new Schema({
  active: Boolean,
  contrast: [String],
  brand: String,
  gender: String,
  LGstyleNum: String,
  personalized: Boolean,
  prdgrp: String,
  prdgrpName: String,
  quickdesign: Boolean,
  sizing: [String],
  styleName: String,
  styleNum: String,
  fluo: Boolean
});

module.exports = mongoose.model("styles", StyleSchema);
