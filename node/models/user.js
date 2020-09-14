var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  google_id: String,
  name: String,
  email: String,
  admin: {
    type: Boolean,
    default: false,
  },
  imageUrl: String,
  wallet: String,
});

var user = mongoose.model("user", userSchema);

module.exports = user;
