const User      = require('../models/userModel')
const Device    = require('../models/deviceModel')
const {encrypt} = require('../cryptoHelper')


const createUser = async (req, res) => {
  try {

    const { username, password, phoneNumber, email, devices} = req.body

    if(!username || !password || !phoneNumber || !email || !devices) 
      return res.status(500).json({message:"Fill all fields!"})

    const encryptedPassword =  encrypt(password)

    const newUser = new User({
      username,
      password: encryptedPassword,
      phoneNumber,
      email,
      devices
    });
    await newUser.save();


    res.status(201).json({ message: 'User created successfully', userId: newUser._id });

  } catch (error) {
    
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const addDeviceToUser = async (req, res) => {
  try {
    const { userId, deviceSerialNumber } = req.body;

    if (!userId || !deviceSerialNumber) {
      return res.status(400).json({ message: "Fill all fields!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const device = await Device.findOne({ serialNumber: deviceSerialNumber });
    if (!device) {
      return res.status(404).json({ message: "Device not found!" });
    }

    if (user.devices.includes(device._id)) {
      return res.status(400).json({ message: "Device already assigned to this user!" });
    }

    user.devices.push(device._id);
    await user.save();

    res.status(200).json({ message: "Device added successfully", user });

  } catch (error) {
    console.error("Error adding device to user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, addDeviceToUser };
