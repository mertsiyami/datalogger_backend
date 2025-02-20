const {User, Device} = require('../models');
const {encrypt} = require('../helpers')
const jwt       = require("jsonwebtoken");

require("dotenv").config();

const createUser = async (req, res) => {
  try {

    const { username, password, phoneNumber, email, devices } = req.body

    if(!username || !password || !phoneNumber || !email || !devices) 
    {
      return res.status(400).json({message:"Fill all fields!"})
    }
      
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

    const user = req.user;
    const deviceSerialNumber = req.body.deviceSerialNumber

    if (!deviceSerialNumber) {
      return res.status(400).json({ message: "Fill all fields!" })
    }

    const device = await Device.findOne({ serialNumber: deviceSerialNumber })
    if (!device) {
      return res.status(404).json({ message: "Device not found!" })
    }

    if (user.devices.includes(device._id)) {
      return res.status(400).json({ message: "Device already assigned to this user!" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { devices: device._id } },
      { new: true }
    );

    device.userId = user._id;
    await device.save()

    res.status(200).json({ message: "Device added successfully", updatedUser, device })

  } catch (error) {
    console.error("Error adding device to user:", error.message)
    res.status(500).json({ message: "Server error" })
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) 
      return res.status(400).json({ message: "Fill all fields!" })

    const user = await User.findOne({ username })

    if (!user) 
      return res.status(404).json({ message: "User not found!" })

    if (!(user.password == encrypt(password) )) 
      return res.status(401).json({ message: "Invalid credentials!" })

    const token = jwt.sign(
      { userId: user._id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: "Login successful", token })

  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
};




module.exports = { createUser, addDeviceToUser, loginUser }
