const { Op, Sequelize } = require('sequelize')
const moment = require('moment')
const sequelize = require('../config/db.config')
const { Item, ItemImage, ItemOption } = require('../models/Items.model')
const { Shop, ShopSubscription } = require('../models/Shops.model')
const SavedItem = require('../models/SavedItems.model')
const ItemRatingsAndReview = require('../models/ItemRatingsAndReviews.model')

/**
 * ------------------------------------------
 * ITEMS CONTROLLERS
 * ------------------------------------------
 */
const getItems = async (req, res) => {
    try {
        const order = (typeof req.query.order != 'undefined' && req.query.order != '') ? req.query.order : 'id'
        const sort = (typeof req.query.sort != 'undefined' && (req.query.sort === 'desc' || req.query.sort === 'asc')) ? req.query.sort : 'desc'
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const personalization_id = (typeof req.query.personalization_id != 'undefined' && req.query.personalization_id >= 0) ? req.query.personalization_id : 0
        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''
        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''
        const category = (typeof req.query.category != 'undefined' && req.query.category != '') ? req.query.category : 'all'
        const min_price = (typeof req.query.minprice != 'undefined') ? req.query.minprice : ''
        const max_price = (typeof req.query.maxprice != 'undefined') ? req.query.maxprice : ''
        const condition = (typeof req.query.condition != 'undefined' && req.query.condition != '') ? req.query.condition : 'all'
        const customer_rating = (typeof req.query.customer_rating != 'undefined' && req.query.customer_rating != '' && req.query.customer_rating <= 5) ? req.query.customer_rating : 0
        const featured = (typeof req.query.featured != 'undefined' && (req.query.featured === '1' || req.query.featured === '0')) ? req.query.featured : ''
        
        var whereClause = {}
    
        if(order === 'random'){
            var itemOrder = sequelize.random()
        }else{
            var itemOrder = [order, sort]
        }
        if(shop_id != ''){
            whereClause.shop_id = shop_id
        }
        if(query != ''){
            whereClause.name = {
                [Op.like]: `%${query}%`
            }
        }
        if(category != 'all'){
            whereClause.category = category
        }
        if(condition != 'all'){
            whereClause.item_condition = condition
        }
        if(min_price != '' && max_price != ''){
            whereClause.price = {
                [Op.between]: [min_price, max_price]
            }
        }
        if(featured != ''){
            whereClause.featured = featured
        }

        let results = await Item.findAndCountAll({
            attributes: { 
                exclude: ['description', 'note']
            },
            order: [itemOrder],
            limit,
            offset: startIndex,
            distinct: true,
            where: whereClause,
            include: [
                { 
                    model: Shop,
                    attributes: ['id', 'slug', 'name', 'logo', 'tagline', 'description', 'created_at'],
                    required: true,
                    include: {
                        model: ShopSubscription,
                        attributes: ['expires_on'],
                        where: {
                            expires_on: {
                                [Op.gte]: moment().utc()
                            }
                        }
                    }
                },

                { 
                    model: ItemImage,
                    separate: true
                },

                {
                    model: ItemOption
                },

                {
                    model: ItemRatingsAndReview,
                    attributes: [
                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'total_rating_count'],

                        [sequelize.literal(`(
                            SELECT FORMAT( AVG(star_rating), 1 )
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'avg_star_rating']
                    ],
                    
                    // where: sequelize.where(sequelize.literal(`(
                    //     SELECT AVG(star_rating)
                    //     FROM item_ratings_and_reviews AS item_ratings_and_review
                    //     WHERE
                    //     item_ratings_and_review.item_id = item.id
                    // )`), Op.gte, customer_rating)
                },

                {
                    model: SavedItem,
                    required: false,
                    where: {
                        user_id: personalization_id
                    }
                }
            ]
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

        res.json({ message: 'items retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getItemsAdmin = async (req, res) => {
    try {
        const order = (typeof req.query.order != 'undefined' && req.query.order != '') ? req.query.order : 'id'
        const sort = (typeof req.query.sort != 'undefined' && (req.query.sort === 'desc' || req.query.sort === 'asc')) ? req.query.sort : 'desc'
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''

        var whereClause = {}

        if(query != ''){
            whereClause.name = {
                [Op.like]: `%${query}%`
            }
        }

        let results = await Item.findAndCountAll({
            order: [[order, sort]],
            limit,
            offset: startIndex,
            where: whereClause,
            paranoid: false,
            distinct: true,
            include: [
                {
                    model: ItemRatingsAndReview,
                    attributes: [
                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'total_rating_count'],

                        [sequelize.literal(`(
                            SELECT FORMAT( AVG(star_rating), 1 )
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'avg_star_rating']
                    ]
                }
            ]
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

        res.json({ message: 'items retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getItem = async (req, res) => {
    try {
        const idOrSlug = req.params.idOrSlug
        const personalization_id = (typeof req.query.personalization_id != 'undefined' && req.query.personalization_id >= 0) ? req.query.personalization_id : 0
        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''
        const featured = (typeof req.query.featured != 'undefined' && (req.query.featured === '1' || req.query.featured === '0')) ? req.query.featured : ''

        var whereClause = {}
        if(shop_id != ''){
            whereClause.shop_id = shop_id
        }
        if(featured != ''){
            whereClause.featured = featured
        }
        let results = await Item.findOne({
            where: {
                [Op.or]: [
                    { slug: idOrSlug },
                    { id: idOrSlug }
                ],
                ...whereClause
            },
            include: [
                { 
                    model: ItemImage,
                    separate: true
                },

                {
                    model: ItemOption
                },

                {
                    model: ItemRatingsAndReview,
                    attributes: [
                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'total_rating_count'],

                        [sequelize.literal(`(
                            SELECT FORMAT( AVG(star_rating), 1 )
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.item_id = item.id
                        )`),
                        'avg_star_rating'],

                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.star_rating = 5
                                AND
                                item_ratings_and_review.item_id = item.id
                        )`),
                        'five_star_count'],

                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.star_rating = 4
                                AND
                                item_ratings_and_review.item_id = item.id
                        )`),
                        'four_star_count'],

                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.star_rating = 3
                                AND
                                item_ratings_and_review.item_id = item.id
                        )`),
                        'three_star_count'],

                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.star_rating = 2
                                AND
                                item_ratings_and_review.item_id = item.id
                        )`),
                        'two_star_count'],

                        [sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM item_ratings_and_reviews AS item_ratings_and_review
                            WHERE
                            item_ratings_and_review.star_rating = 1
                                AND
                                item_ratings_and_review.item_id = item.id
                        )`),
                        'one_star_count']
                    ]
                },

                {
                    model: SavedItem,
                    where: {
                        user_id: personalization_id
                    },
                    required: false
                },

                { 
                    model: Shop,
                    attributes: ['id', 'slug', 'name', 'logo', 'tagline', 'description', 'created_at'],
                    required: true,
                    include: {
                        model: ShopSubscription,
                        attributes: ['expires_on'],
                        where: {
                            expires_on: {
                                [Op.gte]: moment().utc()
                            }
                        }
                    }
                }
            ]
        })
        if(results === null){
            res.json({ message: 'item not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'item retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getItemAdmin = async (req, res) => {
    try {
        const id = req.params.id

        let results = await Item.findOne({
            attributes: ['name', 'slug', 'brand', 'category', 'item_condition', 'currency', 'price', 'compare_at_price', 'quantity', 'stock', 'featured', 'created_at', 'updated_at'],
            where: {
                id
            },
            include: [
                // { 
                //     model: ItemImage,
                //     separate: true
                // },

                {
                    model: ItemOption
                },

                { 
                    model: Shop,
                    attributes: ['name'],
                    include: {
                        model: ShopSubscription,
                        attributes: ['expires_on']
                    }
                }
            ]
        })
        if(results === null){
            res.json({ message: 'item not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'item retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createItem = async (req, res) => {
    try {
        const { shop_id, name, slug, description, note, brand, category, item_condition, currency, price, compare_at_price, discount_price, discount_percent, quantity, stock, featured } = req.body

        let results = await Item.create({
            shop_id, slug: slug + '-' + moment().utc().unix(), name, description, note, brand, category, item_condition, currency, price, compare_at_price, discount_price, discount_percent, quantity, stock, featured
        })
        res.json({ message: 'item created successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateItem = async (req, res) => {
    try {
        const idOrSlug = req.params.idOrSlug
        const { name, description, note, brand, category, item_condition, currency, price, compare_at_price, discount_price, discount_percent, quantity, stock, featured } = req.body

        let results = await Item.update({
            name, description, note, brand, category, item_condition, currency, price, compare_at_price, discount_price, discount_percent, quantity, stock, featured
        }, {
            where: {
                [Op.or]: [
                    { slug: idOrSlug },
                    { id: idOrSlug }
                ]
            }
        })
        res.json({ message: 'item updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateItemStock = async (req, res) => {
    try {
        const id = req.params.id
        const { stock } = req.body

        let results = await Item.update({
            stock
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'item quantity updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteItem = async (req, res) => {
    try {
        const idOrSlug = req.params.idOrSlug

        let results = await Item.destroy({
            where: {
                [Op.or]: [
                    { slug: idOrSlug },
                    { id: idOrSlug }
                ]
            }
        })
        res.json({ message: 'item deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * ITEMS IMAGE CONTROLLERS
 * ------------------------------------------
 */
const createItemImage = async (req, res) => {
    try {
        const { item_id, image } = req.body

        let results = await ItemImage.create({
            item_id, image
        })
        res.json({ message: 'item image created successfully', success: true, error_message: error.name, results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateItemImage = async (req, res) => {
    try {
        const id = req.params.id
        const image = req.body.image

        let results = await ItemImage.update({
            image
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'item image updated successfully', success: true, error_message: '', results }) 
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteItemImage = async (req, res) => {
    try {
        const id = req.params.id

        let results = await ItemImage.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'item image deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * ITEMS OPTIONS CONTROLLERS
 * ------------------------------------------
 */
const createItemOption = async (req, res) => {
    try {
        const { item_id, name, options } = req.body

        let results = await ItemOption.create({
            item_id, name, options
        })
        res.json({ message: 'item option created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateItemOption = async (req, res) => {
    try {
        const id = req.params.id
        const { name, options } = req.body

        let results = await ItemOption.update({
            name, options
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'item option updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteItemOption = async (req, res) => {
    try {
        const id = req.params.id

        let results = await ItemOption.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'item option deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}




module.exports = {
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
}