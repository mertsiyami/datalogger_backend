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
    
    console.error('Error creating device:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createDeviceSecretkey = async (req, res) => {
  try {

    const { deviceSerialNumber } = req.body

    const device = await Device.findOne({ serialNumber : deviceSerialNumber})

    if(!device)
      return res.status(404).json({message : "Device not found!"})

    const secretKey = `${deviceSerialNumber}@${device._id}` // This secretKey creation method will change after code review :)

    res.status(201).json({ message: 'Device secret key created successfully', secretKey });

  } catch (error) {
    
    console.error('Error creating device secret key:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = { createDevice, createDeviceSecretkey };
