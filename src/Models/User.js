const mongoose = require("mongoose");
const util = require("../lib/commonFunctions");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
    default: util.createExpiryDate(),
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["verified", "nonverified"],
    default: "nonverified",
  },

  userType: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
