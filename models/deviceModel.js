const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  datalogs: {
    type: [String],
    default: [],
  }
  
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
