const express    = require('express')
const {logData} = require('../controllers/dataController')

const router = express.Router()

router.post('/logdata', logData)


module.exports = router;
