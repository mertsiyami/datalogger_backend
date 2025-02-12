const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  deviceSerialNumber: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type : Number,
    required : true
  },
  date: {
    type : Date,
    required: true
  }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
