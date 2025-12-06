const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, unique: true },
  password: { type: String },
  wallet: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);
