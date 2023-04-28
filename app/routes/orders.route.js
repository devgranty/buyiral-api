const express = require('express')
const router = express.Router()
const { authUser, authShop, authAdmin } = require('../middlewares/auth')

const {
    getOrders,
    getOrdersShop,
    getOrdersAdmin,
    getOrderShop,
    getOrderAdmin,
    getOrdersStat,
    createOrder,
    updateOrder,
    updateOrderAdmin
} = require('../controllers/orders.controller')

// order routes
router.get('/orders', authUser, getOrders)
router.get('/orders/shop', [authUser, authShop], getOrdersShop)
router.get('/orders/admin/a453f572b56f71000bd117af687d1537', authAdmin, getOrdersAdmin)
router.get('/order/id/:id', [authUser, authShop], getOrderShop)
router.get('/order/admin/2e6ed4c086125d07e7fa346eb8434eb2/id/:id', authAdmin, getOrderAdmin)
router.get('/orders/stat', [authUser, authShop], getOrdersStat)
router.post('/order/create', authUser, createOrder)
router.patch('/order/id/:order_id/edit', authUser, updateOrder)
router.patch('/order/admin/fd475ed5fc7c9baa1d5fe94372dea6ce/id/:id/edit', authAdmin, updateOrderAdmin)

module.exports = router