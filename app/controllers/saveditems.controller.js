const { Op } = require('sequelize')
const moment = require('moment')
const SavedItem = require('../models/SavedItems.model')
const { Item, ItemImage } = require('../models/Items.model')
const { Shop, ShopSubscription } = require('../models/Shops.model')

const getSavedItems = async (req, res) => {
    try {
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id >= 0) ? req.query.user_id : ''

        let results = await SavedItem.findAndCountAll({
            order: [['id', 'desc']],
            distinct: true,
            where: {
                user_id
            },
            include: [
                { 
                    model: Item,
                    attributes: ['id', 'shop_id', 'slug', 'name', 'currency', 'price', 'compare_at_price', 'discount_price', 'discount_percent'],
                    where: {
                        id: {
                            [Op.not]: null
                        }
                    },
                    include: [
                        {
                            model: ItemImage
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
        res.json({ message: 'saved items retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createSavedItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body

        let results = await SavedItem.create({
            item_id, user_id
        })
        res.json({ message: 'saved item created successfully', success: true, error_message: '', results })  
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteSavedItem = async (req, res) => {
    try {
        const id = req.params.id

        let results = await SavedItem.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'saved item deleted successfully', success: true, error_message: '', results }) 
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


module.exports = {
    getSavedItems,
    createSavedItem,
    deleteSavedItem
}