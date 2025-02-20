const express        = require('express')
const verifyToken    = require("../middlewares/authMiddleware");
const { createUser, addDeviceToUser, loginUser, updateDevice, myDevices } = require('../controllers/userController')

const router = express.Router()

router.put('/updateDevice', verifyToken, updateDevice)
router.post('/addDevice'      , verifyToken, addDeviceToUser)
router.post('/login'      , loginUser)
router.post('/', createUser)
router.post('/getDevices', verifyToken, myDevices)

module.exports = router;
