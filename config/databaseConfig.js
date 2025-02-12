const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB bağlantı URL'si
    const mongoURI = process.env.MONGO_URI;

    // Bağlantı
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Uygulamayı durdur
  }
};

module.exports = connectDB;
