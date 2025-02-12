const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  devices: {
    type: [String], // Cihaz ID'lerini içeren dizi
    default: [],
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
