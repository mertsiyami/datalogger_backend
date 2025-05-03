const {User, Device} = require('../models');
const {encrypt, decrypt} = require('../helpers')
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
    // deviceSerialNumber parametresini doğrudan alıyoruz
    const { deviceSerialNumber } = req.body;

    if (!deviceSerialNumber) {
      return res.status(400).json({ message: "Cihaz seri numarası gereklidir!" });
    }

    // Cihazı seri numarasına göre bul
    const device = await Device.findOne({ serialNumber: deviceSerialNumber });

    if (!device) {
      return res.status(404).json({ message: "Cihaz bulunamadı!" });
    }

    // Cihaz zaten bu kullanıcıya atanmış mı kontrol et
    if (user.devices.includes(device._id)) {
      return res.status(400).json({ message: "Bu cihaz zaten kullanıcınıza atanmış!" });
    }

    // Cihaz başka bir kullanıcıya atanmış mı kontrol et
    if (device.userId && String(device.userId) !== String(user._id)) {
      return res.status(400).json({ message: "Bu cihaz başka bir kullanıcıya atanmış!" });
    }

    // Kullanıcının cihaz listesine yeni cihazı ekle
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { devices: device._id } },
      { new: true }
    );

    // Cihaza kullanıcı ID'sini ekle
    device.userId = user._id;
    await device.save();

    res.status(200).json({ 
      success: true,
      message: "Cihaz başarıyla eklendi", 
      updatedUser, 
      device 
    });
  } catch (error) {
    console.error("Kullanıcıya cihaz eklerken hata:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
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

const getUserInfo = async (req, res) => {

  res.json(req.user);

}

const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { username, phoneNumber, email } = req.body;
    
    // Güncelleme için en az bir alan gönderilmiş mi kontrolü
    if (!username && !phoneNumber && !email) {
      return res.status(400).json({ message: "En az bir alanı güncellemelisiniz!" });
    }

    // Güncellenecek alanları içeren obje
    const updateFields = {};
    
    if (username) updateFields.username = username;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (email) updateFields.email = email;

    // Eğer username güncellenmek isteniyorsa, bu kullanıcı adının zaten alınıp alınmadığını kontrol et
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanımda!" });
      }
    }

    // Eğer email güncellenmek isteniyorsa, bu emailin zaten alınıp alınmadığını kontrol et
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda!" });
      }
    }

    // Kullanıcıyı güncelle
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password'); // Şifreyi response'a dahil etme

    res.status(200).json({ 
      success: true,
      message: "Kullanıcı bilgileri başarıyla güncellendi", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};




module.exports = { createUser, addDeviceToUser, loginUser, getUserInfo, updateUser }
