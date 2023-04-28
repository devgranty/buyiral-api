const express = require('express')
const router = express.Router()
const { authUser, authAdmin } = require('../middlewares/auth')

// payments controller
const {
    getPaymentsAdmin,
    verifyPayment
} = require('../controllers/payments.controller')

// payments routes
router.get('/payments/admin/199305ff296f60d11a108baa587afdc3', authAdmin, getPaymentsAdmin)
router.post('/payment/verify', authUser, verifyPayment)

module.exports = router