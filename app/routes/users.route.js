const express = require('express')
const router = express.Router()
const { authUser, authAdmin } = require('../middlewares/auth')

// users controllers
const {
    getUsersAdmin,
    getUser,
    getUserPrivate,
    getUserAdmin,
    createUser, 
    updateUser, 
    deleteUser,

    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,

    createPasswordResetToken,
    checkPasswordResetToken,
    resetPassword,
    changePassword,

    userAuthStatus,
    userAuthLogin,
    userAuthLogout,

    joinMailList
} = require('../controllers/users.controller')

// user routes
router.get('/users/admin/2504228f5fc87cf3fda70980c114fa8e', authAdmin, getUsersAdmin)
router.get('/user/email/:email', getUser)
router.get('/user/private/id/:idOrEmail', authUser, getUserPrivate)
router.get('/user/admin/c114b78c6132afd5999871c26970ac99/id/:id', authAdmin, getUserAdmin)
router.post('/user/create', createUser)
router.patch('/user/id/:idOrEmail/edit', authUser, updateUser)
router.delete('/user/id/:idOrEmail/delete', authUser, deleteUser)

// user address routes
router.get('/user/address', authUser, getAddresses)
router.get('/user/address/id/:id', authUser, getAddress)
router.post('/user/address/create', authUser, createAddress)
router.patch('/user/address/id/:id/edit', authUser, updateAddress)
router.delete('/user/address/id/:id/delete', authUser, deleteAddress)

// new password
router.post('/user/password/token/create', createPasswordResetToken)
router.post('/user/password/token/check', checkPasswordResetToken)
router.patch('/user/password/reset', resetPassword)
router.patch('/user/password/change', authUser, changePassword)

// login user
router.get('/user/auth/status', userAuthStatus)
router.post('/user/auth/login', userAuthLogin)
router.get('/user/auth/logout', userAuthLogout)

// join mailing list
router.post('/member/add/mailinglist', joinMailList)

module.exports = router