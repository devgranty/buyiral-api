const { Op } = require('sequelize')
const moment = require('moment')
const Cart = require('../models/Carts.model')
const { Item, ItemImage } = require('../models/Items.model')
const { Shop, ShopSubscription } = require('../models/Shops.model')

const getCartItems = async (req, res) => {
    try {
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id != '') ? req.query.user_id : ''

        let results = await Cart.findAndCountAll({
            order: [['id', 'desc']],
            where: {
                user_id
            },
            include: [
                {
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price', 'compare_at_price', 'discount_price', 'discount_percent', 'quantity', 'stock'],
                    where: {
                        id: {
                            [Op.not]: null
                        }
                    },
                    include: [
                        {
                            model: ItemImage,
                            separate: true
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
                }
            ]
        })
        res.json({ message: 'cart items retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const checkCartItem = async (req, res) => {
    try {
        const item_id = (typeof req.query.item_id != 'undefined' && req.query.item_id >= 0) ? req.query.item_id : ''
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id != '') ? req.query.user_id : ''
        const attributes = (typeof req.query.attributes != 'undefined' && req.query.attributes != '') ? req.query.attributes : null

        var whereClause = {}

        if(attributes){
            whereClause.attributes = attributes
        }

        let results = await Cart.findOne({
            where: {
                item_id,
                user_id,
                ...whereClause
            }
        })
        res.json({ message: 'cart item retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getCartItemSum = async (req, res) => {
    try {
        const item_id = (typeof req.query.item_id != 'undefined' && req.query.item_id >= 0) ? req.query.item_id : ''
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id != '') ? req.query.user_id : ''

        var whereClause = {}
        if(item_id != ''){
            whereClause.item_id = item_id
        }

        let results = await Cart.sum('quantity', {
            where: {
                user_id,
                ...whereClause
            }
        })
        res.json({ message: 'cart item sum retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createCartItem = async (req, res) => {
    try {
        const { user_id, item_id, quantity, attributes } = req.body

        let results = await Cart.create({
            user_id, item_id, quantity, attributes
        })
        res.json({ message: 'cart item created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error, results: null })
    }
}


const updateCartUserId = async (req, res) => {
    try {
        const temp_user_id = (typeof req.query.temp_user_id != 'undefined' && req.query.temp_user_id != '') ? req.query.temp_user_id : ''
        const { user_id } = req.body

        let results = await Cart.update({
            user_id
        }, {
            where: {
                user_id: temp_user_id
            }
        })
        res.json({ message: 'cart user id updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateCartItem = async (req, res) => {
    try {
        const id = req.params.id
        const { quantity } = req.body

        let results = await Cart.update({
            quantity
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'cart item updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteCartItem = async (req, res) => {
    try {
        const id = req.params.id

        let results = await Cart.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'cart item deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}

const clearCart = async (req, res) => {
    try {
        const user_id = req.params.user_id

        let results = await Cart.destroy({
            where: {
                user_id
            }
        })
        res.json({ message: 'user cart cleared successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


module.exports = {
    getCartItems,
    checkCartItem,
    getCartItemSum,
    createCartItem,
    updateCartUserId,
    updateCartItem,
    deleteCartItem,
    clearCart
}