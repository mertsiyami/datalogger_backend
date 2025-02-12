const Data   = require('../models/dataModel')
const Device = require('../models/deviceModel')

const {decrypt} = require('../cryptoHelper')

const logData = async (req, res) => {
  try {
    const { secretKey, temperature, humidity} = req.body
    
    if (typeof secretKey === "undefined" || typeof temperature === "undefined" || typeof humidity === "undefined")
      return res.status(400).json({ message: "Fill all fields!" })
    
    decryptedSecretKey = decrypt(secretKey)

    const parts = decryptedSecretKey.split("|");

    if(parts.length !== 2) 
      return res.status(400).json({ message: "Invalid secret key format!" })
    
    const deviceId = parts[0]
    const deviceSerialNumber = parts[1]

    const device = await Device.findOne({serialNumber : deviceSerialNumber, _id : deviceId}) 

    if(!device)
      return res.status(404).json({message : "Device not found!"})

    const newData = new Data({
      deviceId : device._id,
      deviceSerialNumber,
      temperature,
      humidity,
      date : new Date()
    })

    await newData.save()

    res.status(201).json({ message: 'Data created successfully', newData })
  } catch (error) {
    console.error('Error creating Data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
};


module.exports = { logData };
