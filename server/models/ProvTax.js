const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProvTaxSchema = new Schema({
    province: {
        type: String,
        required: true
    },
    abbrev: {
        type: String,
        required: true,
        uppercase: true
    },
    tax: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("provs", ProvTaxSchema);