const express = require('express')
const router = express.Router()

const {
    getCartItems,
    getCartItemSum,
    checkCartItem,
    createCartItem,
    updateCartUserId,
    updateCartItem,
    deleteCartItem,
    clearCart
} = require('../controllers/carts.controller')

// order routes
router.get('/carts', getCartItems)
router.get('/cart/check', checkCartItem)
router.get('/cart/sum', getCartItemSum)
router.post('/cart/create', createCartItem)
router.patch('/cart/user/edit', updateCartUserId)
router.patch('/cart/id/:id/edit', updateCartItem)
router.delete('/cart/id/:id/delete', deleteCartItem)
router.delete('/cart/clear/id/:user_id', clearCart)

module.exports = router