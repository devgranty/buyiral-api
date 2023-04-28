const { Op } = require('sequelize')
const moment = require('moment')
const sequelize = require('../config/db.config')
const Order = require('../models/Orders.model')
const { User } = require('../models/Users.model')
const { Item, ItemImage } = require('../models/Items.model')
const { Shop } = require('../models/Shops.model')
const ItemRatingsAndReview = require('../models/ItemRatingsAndReviews.model')
const pushOrderHistory = require('../middlewares/order_history')

const getOrders = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id >= 0) ? req.query.user_id : ''
        const order_id = (typeof req.query.order_id != 'undefined') ? req.query.order_id : ''

        var whereClause = {}

        if(order_id != ''){
            whereClause.order_id = order_id
        }

        let results = await Order.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            distinct: true,
            where: {
                user_id,
                ...whereClause
            },
            include: [
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price'],
                    include: [
                        {
                            model: ItemImage,
                            separate: true
                        },
                        
                        {
                            model: Shop,
                            attributes: ['id', 'slug', 'name', 'logo', 'tagline', 'description', 'created_at'],
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: ItemRatingsAndReview,
                    required: false,
                    where: {
                        user_id
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

        res.json({ message: 'orders retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getOrdersShop = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''
        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''
        const status = (typeof req.query.status != 'undefined' && req.query.status != '') ? req.query.status : 'order_all'
        const start_date = (typeof req.query.start_date != 'undefined' && req.query.start_date != '') ? req.query.start_date : ''
        const end_date = (typeof req.query.end_date != 'undefined' && req.query.end_date != '') ? req.query.end_date : ''

        var whereClause = {}

        if(query != ''){
            whereClause.order_id = {
                [Op.like]: `%${query}%`
            }
        }
        if(status != 'order_all'){
            whereClause.status = status
        }
        if(start_date != ''){
            whereClause.created_at = {
                [Op.gte]: start_date
            }
        }
        if(end_date != ''){
            whereClause.created_at = {
                [Op.lte]: end_date
            }
        }

        let results = await Order.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            distinct: true,
            where: {
                shop_id,
                ...whereClause
            },
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price'],
                    include: [
                        {
                            model: ItemImage
                        }
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

        res.json({ message: 'orders retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error, results: null })
    }
}


const getOrdersAdmin = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''
        const country = (typeof req.query.country != 'undefined' && req.query.country != '') ? req.query.country : ''
        const state = (typeof req.query.state != 'undefined' && req.query.state != '') ? req.query.state : ''
        const status = (typeof req.query.status != 'undefined' && req.query.status != '') ? req.query.status : 'order_all'
        const start_date = (typeof req.query.start_date != 'undefined' && req.query.start_date != '') ? req.query.start_date : ''
        const end_date = (typeof req.query.end_date != 'undefined' && req.query.end_date != '') ? req.query.end_date : ''

        var whereClause = {}

        if(query != ''){
            whereClause.order_id = {
                [Op.like]: `%${query}%`
            }
        }
        if(status != 'order_all'){
            whereClause.status = status
        }
        if(start_date != ''){
            whereClause.created_at = {
                [Op.gte]: start_date
            }
        }
        if(end_date != ''){
            whereClause.created_at = {
                [Op.lte]: end_date
            }
        }

        let results = await Order.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            distinct: true,
            where: {
                country,
                state,
                ...whereClause
            },
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price'],
                    include: [
                        {
                            model: ItemImage
                        }
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

        res.json({ message: 'orders retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getOrderShop = async (req, res) => {
    try {
        const id = req.params.id
        
        let results = await Order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price'],
                    include: [
                        {
                            model: ItemImage
                        }
                    ]
                }
            ]
        })
        res.json({ message: 'order retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getOrderAdmin = async (req, res) => {
    try {
        const id = req.params.id

        let results = await Order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name', 'email']
                },
                {
                    model: Shop,
                    attributes: ['id', 'slug', 'name', 'logo', 'email', 'phone_number', 'whatsapp', 'twitter', 'state', 'country', 'address', 'tagline', 'description', 'created_at']
                },
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price'],
                    include: [
                        {
                            model: ItemImage
                        }
                    ]
                }
            ]
        })
        res.json({ message: 'order retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getOrdersStat = async (req, res) => {
    try {
        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''

        let results = await Order.findOne({
            attributes: [
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM orders
                    WHERE
                    orders.shop_id = ${shop_id} AND status = 'order_delivered'
                )`), 'total_sales'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM orders
                    WHERE
                    orders.shop_id = ${shop_id}
                )`), 'total_orders']
            ]
        })
        res.json({ message: 'orders count retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createOrder = async (req, res) => {
    try {
        const { order_id, user_id, shop_id, item_id, transaction_reference, currency, amount, attributes, quantity, country, state, shipping_address, shipping_method, shipping_fee, delivery_date, status } = req.body
        const status_history = JSON.stringify([{
            status,
            datetime: moment().utc()
        }])

        let results = await Order.create({
            order_id, user_id, shop_id, item_id, transaction_reference, currency, amount, attributes, quantity, country, state, shipping_address, shipping_method, shipping_fee, delivery_date, status, status_history
        })
        res.json({ message: 'order created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateOrder = async (req, res) => {
    try {
        const order_id = req.params.order_id
        const { status } = req.body

        let order = await Order.findAll({
            where: {
                order_id
            }
        })
        const status_history = pushOrderHistory(order[0].status_history, status, order)

        let results = await Order.update({
            status, status_history
        }, {
            where: {
                order_id
            }
        })
        res.json({ message: 'order updated successfully', success: true, error_message: '', results })  
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateOrderAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        let order = await Order.findAll({
            where: {
                id
            }
        })
        const status_history = pushOrderHistory(order[0].status_history, status, order)

        let results = await Order.update({
            status, status_history
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'order updated successfully', success: true, error_message: '', results })  
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


module.exports = {
    getOrders,
    getOrdersShop,
    getOrdersAdmin,
    getOrderShop,
    getOrderAdmin,
    getOrdersStat,
    createOrder,
    updateOrder,
    updateOrderAdmin
}