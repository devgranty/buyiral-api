const { Op } = require('sequelize')
const sequelize = require('../config/db.config')
const ItemRatingsAndReview = require('../models/ItemRatingsAndReviews.model')

/**
 * ------------------------------------------
 * ITEMS RATING AND REVIEWS CONTROLLERS
 * ------------------------------------------
 */
 const getItemReviews = async (req, res) => {
    try {
        const order = (typeof req.query.order != 'undefined' && req.query.order != '') ? req.query.order : 'id'
        const sort = (typeof req.query.sort != 'undefined' && (req.query.sort === 'desc' || req.query.sort === 'asc')) ? req.query.sort : 'desc'
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const item_id = (typeof req.query.item_id != 'undefined' && req.query.item_id >= 0) ? req.query.item_id : ''

        let results = await ItemRatingsAndReview.findAndCountAll({
            order: [[order, sort]],
            limit,
            offset: startIndex,
            distinct: true,
            where: {
                [Op.and]: [
                    { item_id },
                    { review_title: {
                            [Op.not]: ''
                        }
                    }
                ]
            }
        })

        results.limit = limit

        const totalPages = Math.ceil(results.count/limit)
        results.totalPages = (totalPages > 0) ? totalPages : 1

        if(endIndex < results.count){
            results.next = page + 1
        }
        if(startIndex > 0){
            results.previous = page - 1
        }

        res.json({ message: 'item rating and review retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getRatingsAndReviewsStat = async (req, res) => {
    try {
        const item_id = (typeof req.query.item_id != 'undefined' && req.query.item_id >= 0) ? req.query.item_id : ''

        let results = await ItemRatingsAndReview.findOne({
            attributes: [
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.item_id = ${item_id}
                )`),
                'total_rating_count'],

                [sequelize.literal(`(
                    SELECT FORMAT( AVG(star_rating), 1 )
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.item_id = ${item_id}
                )`),
                'avg_star_rating'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.star_rating = 5
                        AND
                        item_ratings_and_review.item_id = ${item_id}
                )`),
                'five_star_count'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.star_rating = 4
                        AND
                        item_ratings_and_review.item_id = ${item_id}
                )`),
                'four_star_count'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.star_rating = 3
                        AND
                        item_ratings_and_review.item_id = ${item_id}
                )`),
                'three_star_count'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.star_rating = 2
                        AND
                        item_ratings_and_review.item_id = ${item_id}
                )`),
                'two_star_count'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM item_ratings_and_reviews AS item_ratings_and_review
                    WHERE
                    item_ratings_and_review.star_rating = 1
                        AND
                        item_ratings_and_review.item_id = ${item_id}
                )`),
                'one_star_count']
            ]
        })

        res.json({ message: 'item rating and review count retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createItemRatingAndReview = async (req, res) => {
    try {
        const { user_id, item_id, order_id, star_rating, review_title, review, review_name }  = req.body

        let results = await ItemRatingsAndReview.create({
            user_id, item_id, order_id, star_rating, review_title, review, review_name
        })
        res.json({ message: 'item rating and review created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateItemRatingAndReview = async (req, res) => {
    try {
        const { star_rating, review_title, review, review_name }  = req.body

        let results = await ItemRatingsAndReview.update({
           star_rating, review_title, review, review_name
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'item rating and review created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteItemRatingAndReview = async (req, res) => {
    try {
        const id = req.params.id

        let results = await ItemRatingsAndReview.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'item rating and review created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


module.exports = {
    getItemReviews,
    getRatingsAndReviewsStat,
    createItemRatingAndReview,
    updateItemRatingAndReview,
    deleteItemRatingAndReview
}