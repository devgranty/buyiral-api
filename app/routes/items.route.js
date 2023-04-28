const express = require('express')
const router = express.Router()
const { authUser, authShop, authAdmin } = require('../middlewares/auth')

// items controller
const {
    getItems,
    getItemsAdmin,
    getItem,
    getItemAdmin,
    createItem,
    updateItem,
    updateItemStock,
    deleteItem,

    createItemImage,
    updateItemImage,
    deleteItemImage,

    createItemOption,
    updateItemOption,
    deleteItemOption
} = require('../controllers/items.controller')

// items routes
router.get('/items', getItems)
router.get('/item/id/:idOrSlug', getItem)
router.get('/items/admin/a8708619cdb31bd873a88c652417100b', authAdmin, getItemsAdmin)
router.get('/item/admin/c6d328997ae0807b30d4555a62be393d/id/:id', authAdmin, getItemAdmin)
router.post('/item/create', [authUser, authShop], createItem)
router.patch('/item/id/:idOrSlug/edit', [authUser, authShop], updateItem)
router.patch('/item/stock/id/:id/edit', authUser, updateItemStock)
router.delete('/item/id/:idOrSlug/delete', [authUser, authShop], deleteItem)

// item images routes
router.post('/item/image/create', [authUser, authShop], createItemImage)
router.patch('/item/image/id/:id/edit', [authUser, authShop], updateItemImage)
router.delete('/item/image/id/:id/delete', [authUser, authShop], deleteItemImage)

// item option routes
router.post('/item/option/create', [authUser, authShop], createItemOption)
router.patch('/item/option/id/:id/edit', [authUser, authShop], updateItemOption)
router.delete('/item/option/id/:id/delete', [authUser, authShop], deleteItemOption)

module.exports = router