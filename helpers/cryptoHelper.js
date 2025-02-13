const crypto = require("crypto");
require('dotenv').config();

const encryptionKey = process.env.ENCRYPTION_KEY;   // 32 karakter uzunluğunda olmalı
const iv            = process.env.IV;               // 16 karakter uzunluğunda olmalı

const encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
