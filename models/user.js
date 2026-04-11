const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },

  // make these OPTIONAL now
  password: { type: String },
  email: { type: String, sparse: true },

  googleId: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);