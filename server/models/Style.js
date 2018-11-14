const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  sizing: {
    type: String
  },
  styleName: {
    type: String,
    required: true
  },
  styleNum: {
    type: String,
    required: true
  },
  fit: {
    type: String
  }
});

module.exports = mongoose.model("styles", StyleSchema);
