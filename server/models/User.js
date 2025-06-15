const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for JWT auth
  displayName: { type: String },
  firebaseUid: { type: String }, // For Firebase users
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
