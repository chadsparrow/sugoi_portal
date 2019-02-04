const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ArtistsSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("customartists", ArtistsSchema);