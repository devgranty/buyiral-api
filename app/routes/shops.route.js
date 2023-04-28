const express = require('express')
const router = express.Router()
const { authUser, authShop, authAdmin } = require('../middlewares/auth')

// shops controller
const {
    getShopsAdmin,
    getShop,
    getShopPrivate,
    getShopAdmin,
    getShopStat,
    createShop,
    resendNewShopVerifyLink,
    verifyNewShop,
    updateShop,
    verifyBankDetails,
    deleteShop,

    getShopSubscriptions,
    createShopSubscription,

    inviteShopEmployee,
    checkShopEmployeeInvite,
    createShopEmployee,
    deleteShopEmployee,

    shopAuthStatus,
    shopAuthLogin,
    shopAuthLogout
} = require('../controllers/shops.controller')

// shops routes
router.get('/shops/admin/97c3fbf1aca45783c4bba6770c9f3bbd', authAdmin, getShopsAdmin)
router.get('/shop/id/:slugOrEmail', getShop)
router.get('/shop/private/id/:shop_id', [authUser, authShop], getShopPrivate)
router.get('/shop/admin/b5c8b9eb871c808edc22053323a223ba/id/:id', authAdmin, getShopAdmin)
router.get('/shop/stat', getShopStat)

router.post('/shop/create', authUser, createShop)
router.post('/shop/create/resendverifylink', authUser, resendNewShopVerifyLink)
router.post('/shop/create/verifynewshop', authUser, verifyNewShop)
router.post('/shop/bank/verify', [authUser, authShop], verifyBankDetails)
router.patch('/shop/id/:idOrSlug/edit', [authUser, authShop], updateShop)
router.delete('/shop/id/:idOrSlug/delete', [authUser, authShop], deleteShop)

// shop subscription routes
router.get('/shop/subscriptions', [authUser, authShop], getShopSubscriptions)
router.post('/shop/subscription/create', authUser, createShopSubscription)

// shop employees routes
router.post('/shop/employee/checkinvite', authUser, checkShopEmployeeInvite)
router.post('/shop/employee/invite', [authUser, authShop], inviteShopEmployee)
router.post('/shop/employee/create', authUser, createShopEmployee)
router.delete('/shop/employee/id/:id/delete', [authUser, authShop], deleteShopEmployee)

// login shop
router.get('/shop/auth/status', shopAuthStatus)
router.post('/shop/auth/login', authUser, shopAuthLogin)
router.get('/shop/auth/logout', shopAuthLogout)

module.exports = router