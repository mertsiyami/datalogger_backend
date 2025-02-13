const {Data, Device, User} = require('../models');
const {decrypt, sendWarningSMS} = require('../helpers')

const logData = async (req, res) => {
  try {
    const { secretKey, temperature, humidity} = req.body;
    
    // if the value is null the typeof statement will return 'object' not 'undefined'
    // so we should use loose equality and handle both null and undefined cases
    if (secretKey == null || temperature == null || humidity == null)
    {
      return res.status(400).json({ message: "Fill all fields!" });
    }
      
    const decryptedSecretKey = decrypt(secretKey);

    const parts = decryptedSecretKey.split("|");

    if(parts.length !== 2) 
    {
      return res.status(400).json({ message: "Invalid secret key format!" });
    }
      
    // using array destructuring
    const [deviceId, deviceSerialNumber] = parts;

    const device = await Device.findOne({serialNumber : deviceSerialNumber, _id : deviceId});

    if(!device)
    {
      return res.status(404).json({message : "Device not found!"});
    }

    if(!device.userId)
    {
      // if the user id is null the device shouldn't log data
      return res.status(400).json({ message: "The device is not owned by an user!" });
    }
      
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
    const { phoneNumber } = user
    const { maxTemperature, minTemperature, maxHumidity, minHumidity } = device

    // this validation can be improvised
    if(maxTemperature <= temperature || minTemperature > temperature || maxHumidity <= humidity || minHumidity > humidity)
    {
      console.log(`Temperature or Humidity is out of range! Temperature:${temperature}, Humidity: ${humidity}`);  // this line could be remove
      sendWarningSMS(temperature, humidity, phoneNumber)
    }
    res.status(201).json({ message: 'Data created successfully', newData })
  } catch (error) {
    console.error('Error creating Data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
};


module.exports = { logData };
