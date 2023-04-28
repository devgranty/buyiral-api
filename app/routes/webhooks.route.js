const express = require('express')
const router = express.Router()

const { paystackWebHook } = require('../controllers/webhooks.controller')

router.post('/webhook/b2f4fa39efff8c9dd34311972f2b42f6', paystackWebHook)

module.exports = router