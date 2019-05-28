const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RepsSchema = new Schema({
  value: {
    type: String,
    required: true,
    uppercase: true
  },
  text: {
    type: String,
    required: true
  },
  office: {
    type: String,
    required: true,
    uppercase: true
  }
});

module.exports = mongoose.model("customreps", RepsSchema);