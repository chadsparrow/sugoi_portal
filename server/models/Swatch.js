const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SwatchSchema = new Schema({
  swatchName: {
    type: String
  }
});

module.exports = mongoose.model("swatches", SwatchSchema);
