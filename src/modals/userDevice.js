const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceType: {
    type: String,
    required: true 
  },
  os: {
    type: String,
    required: true 
  },
  osVersion: {
    type: String,
    required: true 
  },
  deviceModel: {
    type: String,
    required: true 
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
