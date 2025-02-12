const Device         = require('../models/deviceModel')
const { v4: uuidv4 } = require('uuid');

const createDevice = async (req, res) => {
  try {

    const serialNumber = uuidv4()
    const datalogs = []
    
    const newDevice = new Device({
        serialNumber,
        datalogs
    });

    await newDevice.save();

    res.status(201).json({ message: 'Device created successfully', deviceId: newDevice._id, serialNumber : newDevice.serialNumber });

  } catch (error) {
    
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createDevice };
