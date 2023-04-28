const express = require('express')
const router = express.Router()
const { authAdmin } = require('../middlewares/auth')

const {
    getAdmin,
    getStatAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,

    getAdminLogs,
    createAdminLog,

    adminAuthStatus,
    adminAuthLogin,
    adminAuthLogout
} = require('../controllers/admins.controller')


router.get('/admin/id/:idOrEmail/5f46d3724f7cd4086ffe5e1bf3ecd138', authAdmin, getAdmin)
router.get('/admin/stat/dd95031d85cd7e95dbc7eb37a9d92522', authAdmin, getStatAdmin)
router.post('/admin/create/c2cbf0e4ebae03c3f063b09135094e13', authAdmin, createAdmin)
router.patch('/admin/update/id/:id/ecb02fbc64abe8bfb1e5889c2c80a2ff', authAdmin, updateAdmin)
router.delete('/admin/delete/id/:id/5df7572c1940cc0bba34410b32c9a2c1', authAdmin, deleteAdmin)
router.patch('/admin/password/change/a1f11cccf4164df48e26eda6508cb686', authAdmin, changePassword)

router.get('/admin/logs/a50d7f22f94779c1f8b1b243f80c8417', authAdmin, getAdminLogs)
router.post('/admin/log/create/5c34f759675a85b6077c97d816f29be7', authAdmin, createAdminLog)

router.get('/admin/auth/status/aeb3c5055b3dc936802a1e22838a6602', adminAuthStatus)
router.post('/admin/auth/login/2035b5b6e9d10224168524656e7e349a', adminAuthLogin)
router.get('/admin/auth/logout/d72ab741546ea4046a371c5f8a50b68b', adminAuthLogout)

module.exports = router