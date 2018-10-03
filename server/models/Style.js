const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleSchema = new Schema({
  active: {
    type: Boolean
  },
  contrast: [{ type: String }],
  brand: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  LGstyleNum: {
    type: String,
    required: true
  },
  personalized: {
    type: Boolean
  },
  prdgrp: {
    type: String,
    required: true
  },
  prdgrpName: {
    type: String,
    required: true
  },
  quickdesign: {
    type: Boolean
  },
  sizing: [
    {
      type: String
    }
  ],
  styleName: {
    type: String,
    required: true
  },
  styleNum: {
    type: String,
    required: true
  },
  fluo: {
    type: Boolean
  }
});

module.exports = mongoose.model("styles", StyleSchema);