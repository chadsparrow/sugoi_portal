const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleSchema = new Schema({
  active: Boolean,
  contrast: [String],
  gender: String,
  LGstyleNum: String,
  personalized: Boolean,
  prdgrp: String,
  prdgrpName: String,
  quickdesign: Boolean,
  sizing: [String],
  styleName: String,
  styleNum: String
});

module.exports = mongoose.model("styles", StyleSchema);
