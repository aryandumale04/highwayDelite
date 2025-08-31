const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  dob: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  notes: [
    {
      title: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
