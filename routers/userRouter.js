const express        = require('express')
const verifyToken    = require("../middlewares/authMiddleware");
const { createUser, addDeviceToUser, loginUser, getUserInfo, updateUser} = require('../controllers/userController')

const router = express.Router()


router.post('/addDevice'      , verifyToken, addDeviceToUser)
router.post('/login'      , loginUser)
router.post('/', createUser)
router.get('/getDetails',verifyToken, getUserInfo)
router.put('/update',verifyToken, updateUser)

module.exports = router;
