const express          = require('express')
const { createDevice, createDeviceSecretkey } = require('../controllers/deviceController')

const router = express.Router()

router.post('/create', createDevice)
router.post('/createDeviceSecretKey', createDeviceSecretkey)


module.exports = router;
