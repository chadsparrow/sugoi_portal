const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ThreadSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  }
});

module.exports = mongoose.model("threads", ThreadSchema);
