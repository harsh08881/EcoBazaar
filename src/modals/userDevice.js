const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceType: {
    type: String,
    required: true // e.g., iPhone, Android, Web
  },
  os: {
    type: String,
    required: true // e.g., iOS, Android, Windows
  },
  osVersion: {
    type: String,
    required: true // e.g., 14.4, 12.0
  },
  deviceModel: {
    type: String,
    required: true // e.g., iPhone 13, Samsung Galaxy S21
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
