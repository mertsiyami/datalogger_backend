const express    = require('express')
const {logData, logsByDeviceId} = require('../controllers/dataController')
const verifyToken    = require("../middlewares/authMiddleware");


const router = express.Router()

router.post('/logdata', logData)
router.post('/logsByDeviceId', verifyToken, logsByDeviceId)


module.exports = router;
