const express          = require('express')
const { createDevice } = require('../controllers/deviceController')

const router = express.Router()

router.post('/create', createDevice)

module.exports = router;
