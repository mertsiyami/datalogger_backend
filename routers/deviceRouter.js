const express          = require('express')
const { createDevice, createDeviceSecretkey, getDevices, updateDevice } = require('../controllers/deviceController')
const verifyToken    = require("../middlewares/authMiddleware");

const router = express.Router()

router.post('/', createDevice)
router.put('/', verifyToken, updateDevice)
router.post('/getDevices', verifyToken, getDevices)
router.post('/createDeviceSecretKey', createDeviceSecretkey)  // this endpoint will be removed, .exe file will access database directly


module.exports = router;
