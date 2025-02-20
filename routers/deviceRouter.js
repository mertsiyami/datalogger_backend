const express          = require('express')
const { createDevice, createDeviceSecretkey, getDevices } = require('../controllers/deviceController')
const verifyToken    = require("../middlewares/authMiddleware");

const router = express.Router()

router.post('/', createDevice)
router.post('/getDevices', verifyToken, getDevices)
router.post('/createDeviceSecretKey', createDeviceSecretkey)  // this endpoint will be removed, .exe file will access database directly


module.exports = router;
