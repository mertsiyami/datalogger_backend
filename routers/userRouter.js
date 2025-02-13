const express        = require('express')
const verifyToken    = require("../middlewares/authMiddleware");
const { createUser, addDeviceToUser, loginUser, updateThresholds } = require('../controllers/userController')

const router = express.Router()

router.post('/addDevice'  , verifyToken, addDeviceToUser)
router.put('/changeThresholds', verifyToken, updateThresholds)
router.post('/login'      , loginUser)
router.post('/', createUser)

module.exports = router;
