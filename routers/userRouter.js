const express        = require('express')
const { createUser, addDeviceToUser } = require('../controllers/userController')

const router = express.Router()

router.post('/', createUser)
router.post('/addDevice', addDeviceToUser)

module.exports = router;
