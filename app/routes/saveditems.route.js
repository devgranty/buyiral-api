const express = require('express')
const router = express.Router()
const { authUser } = require('../middlewares/auth')

const {
    getSavedItems,
    createSavedItem,
    deleteSavedItem
} = require('../controllers/saveditems.controller')

// order routes
router.get('/saveditems', authUser, getSavedItems)
router.post('/saveditem/create', authUser, createSavedItem)
router.delete('/saveditem/id/:id/delete', authUser, deleteSavedItem)

module.exports = router