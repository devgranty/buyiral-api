const express = require('express')
const router = express.Router()
const { authUser } = require('../middlewares/auth')

// item ratings and review controller
const {
    getItemReviews,
    getRatingsAndReviewsStat,
    createItemRatingAndReview,
    updateItemRatingAndReview,
    deleteItemRatingAndReview
} = require('../controllers/ItemRatingsAndReviews.controller')

// item rating and reviews routes
router.get('/ratingsandreviews', getItemReviews)
router.get('/ratingsandreviews/stat', getRatingsAndReviewsStat)
router.post('/ratingsandreviews/create', authUser, createItemRatingAndReview)
router.patch('/ratingsandreviews/id/:id/edit', authUser, updateItemRatingAndReview)
router.delete('/ratingsandreviews/id/:id/delete', authUser, deleteItemRatingAndReview)

module.exports = router