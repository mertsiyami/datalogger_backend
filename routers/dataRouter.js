const express    = require('express')
const {logData, logsByUserId} = require('../controllers/dataController')
const verifyToken    = require("../middlewares/authMiddleware");


const router = express.Router()

router.post('/logdata', logData)
router.post('/logsByDeviceId', verifyToken, logsByUserId)


module.exports = router;
