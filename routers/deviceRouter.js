const express          = require('express')
const { createDevice, createDeviceSecretkey } = require('../controllers/deviceController')

const router = express.Router()

router.post('/', createDevice)
router.post('/createDeviceSecretKey', createDeviceSecretkey)  // this endpoint will be removed, .exe file will access database directly


module.exports = router;
