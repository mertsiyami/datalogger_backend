const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

require("dotenv").config();

const verifyToken = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({message: "Please login" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({message: "Please login" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({message: "Please login" });
  }
};

module.exports = verifyToken;
