const Data   = require('../models/dataModel')
const Device = require('../models/deviceModel')
const User   = require('../models/userModel')

const {decrypt}        = require('../cryptoHelper')
const {sendWarningSMS} = require('../smsHelper')

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

    const now = new Date()
    now.setUTCHours(now.getUTCHours() + 3)   // GMT+0 to GMT+3

    const newData = new Data({
      deviceId : device._id,
      deviceSerialNumber,
      temperature,
      humidity,
      date : now
    })

    await newData.save()

    // control max-min limits and send sms if needed

    const user  = await User.findOne({_id : device.userId})
    const {maxTemperature, minTemperature, maxHumidity, minHumidity, phoneNumber} = user;

    if(maxTemperature <= temperature || minTemperature > temperature || maxHumidity <= humidity || minHumidity > humidity)
      console.log(`Temperature or Humidity is out of range! Temperature:${temperature}, Humidity: ${humidity}`);  // this line could be remove
      sendWarningSMS(temperature, humidity, phoneNumber)

    res.status(201).json({ message: 'Data created successfully', newData })
  } catch (error) {
    console.error('Error creating Data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
};


module.exports = { logData };
