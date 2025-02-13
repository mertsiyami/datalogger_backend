const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  serialNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  deviceId: {
    type: String
  },
  userId: {
    type: String
  },
  maxTemperature: {
    type: Number
  },
  minTemperature: {
    type: Number
  },
  maxHumidity: {
    type: Number
  },
  minHumidity: {
    type: Number
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
