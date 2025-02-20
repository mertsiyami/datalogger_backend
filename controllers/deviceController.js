const {Device}         = require('../models');
const { encrypt }    = require('../helpers');
const { v4: uuidv4 } = require('uuid');


const createDevice = async (req, res) => {
  try {
    const serialNumber = uuidv4()
    
    const newDevice = new Device({
        serialNumber,
        name : "New Device",
        maxTemperature : null,
        minTemperature : null,
        maxHumidity : null,
        minHumidity : null
    });

    await newDevice.save();

    res.status(201).json({ message: 'Device created successfully', deviceId: newDevice._id, serialNumber : newDevice.serialNumber });

  } catch (error) {
    
    console.error('Error creating device:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// TO-DO bu endpointi bir helper gibi değerlendirip createDevice altında kullanıcıya sercretKey dönsek daha iyi olur.
const createDeviceSecretkey = async (req, res) => {
  try {

    const { deviceSerialNumber } = req.body

    const device = await Device.findOne({ serialNumber : deviceSerialNumber})

    if(!device)
      return res.status(404).json({message : "Device not found!"})

    let secretKey = `${device._id}|${deviceSerialNumber}`
    
    secretKey = encrypt(secretKey)

    //the code 200 is more appropriate since we are not creating a new resource in the database 
    res.status(200).json({ message: 'Device secret key created successfully', secretKey });

  } catch (error) {
    
    console.error('Error creating device secret key:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const getDevices = async (req, res) => {

  try{

    const user = req.user

    const devices = await Device.find({userId : user._id})

    if(!devices)
      res.json(null);

    res.status(200).json({devices})


  }catch (error)
  {
    console.error("--------------------- getDevices ERROR ------------------------",error.message);
    res.status(500).json({ message: 'Server error' });
  }

}






module.exports = { createDevice, createDeviceSecretkey, getDevices };
