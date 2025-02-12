const Data   = require('../models/dataModel')
const Device = require('../models/deviceModel')

const {decrypt} = require('../cryptoHelper')

const logData = async (req, res) => {
  try {
    const { deviceSerialNumber, temperature, humidity} = req.body;
    
    if(!deviceSerialNumber || !temperature || !humidity)
      return res.status(500).json({message: "Fill all fields!"})
    
    //decryptedSerialNumber = decrypt(deviceSerialNumber);                   // after creating serialnumber string for device, now serialnumber is not encrypted

    const device = await Device.findOne({serialNumber : deviceSerialNumber}) // serialNumber : decryptedSerialNumber

    if(!device)
      return res.status(404).json({message : "Device not found!"})

    const newData = new Data({
      deviceId : device._id,
      deviceSerialNumber,                                                     // after creating serialnumber string for device use decryptedSerialNumber  
      temperature,
      humidity,
      date : new Date()
    })

    await newData.save()

    res.status(201).json({ message: 'Data created successfully', newData });
  } catch (error) {
    console.error('Error creating Data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { logData };
