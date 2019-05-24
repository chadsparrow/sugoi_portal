const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  },
  editOrders: {
    type: Boolean,
    required: true
  },
  editProofs: {
    type: Boolean,
    required: true
  },
  viewProd: {
    type: Boolean,
    required: true
  },
  editProd: {
    type: Boolean,
    required: true
  },
  lgUser: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("users", UserSchema);
