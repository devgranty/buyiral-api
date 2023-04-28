const express = require('express')
const router = express.Router()
const { authUser, authShop, authAdmin } = require('../middlewares/auth')

const {
    getWithdrawalsShop,
    getWithdrawalsAdmin,
    getWithdrawalAdmin,
    createWithdrawal,
    updateWithdrawalAdmin
} = require('../controllers/withdrawals.controller')

router.get('/withdrawals', [authUser, authShop], getWithdrawalsShop)
router.get('/withdrawals/admin/211845a58ec7ce0527836d7191cef725', authAdmin, getWithdrawalsAdmin)
router.get('/withdrawal/admin/cd976aa500a728ebfa0404e5588bb60c/id/:id', authAdmin, getWithdrawalAdmin)
router.post('/withdrawal/create', [authUser, authShop], createWithdrawal)
router.patch('/withdrawal/admin/5ada1bf6752f0d45a3d11c9adabab6b0/id/:id/edit', authAdmin, updateWithdrawalAdmin)

module.exports = router