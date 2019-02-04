const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StateSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    abbrev: {
        type: String,
        required: true,
        uppercase: true
    }
});

module.exports = mongoose.model("states", StateSchema);