const express        = require('express')
const verifyToken = require("../middlewares/authMiddleware");
const { createUser, addDeviceToUser, loginUser } = require('../controllers/userController')

const router = express.Router()

router.post('/login'    , loginUser)
router.post('/addDevice', verifyToken, addDeviceToUser)
router.post('/', createUser)

module.exports = router;
