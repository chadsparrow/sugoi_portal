const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
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
  editProd: {
    type: Boolean,
    required: true
  }
});

mongoose.model("users", UserSchema);
