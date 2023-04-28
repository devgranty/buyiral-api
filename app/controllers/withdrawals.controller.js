const Withdrawal = require('../models/Withdrawals.model')
const { Shop } = require('../models/Shops.model')

const getWithdrawalsShop = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''

        let results = await Withdrawal.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            where: {
                shop_id
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

        res.json({ message: 'withdrawals retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })   
    }
}


const getWithdrawalsAdmin = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        let results = await Withdrawal.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            include: [
                {
                    model: Shop,
                    attributes: ['name', 'bank_name', 'account_number', 'account_name']
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

        res.json({ message: 'withdrawals retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })   
    }
}


const getWithdrawalAdmin = async (req, res) => {
    try {
        const id = req.params.id

        let results = await Withdrawal.findOne({
            where: {
                id
            },
            
            include: [
                {
                    model: Shop,
                    attributes: ['name', 'bank_name', 'account_number', 'account_name']
                }
            ]
        })

        res.json({ message: 'withdrawal retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })   
    }
}


const createWithdrawal = async (req, res) => {
    try {
        const { shop_id, currency, amount, transaction_reference, status } = req.body

        let results = await Withdrawal.create({
            shop_id, currency, amount, transaction_reference, status
        })

        res.json({ message: 'withdrawal created successfully', success: true, error_message: '', results })

    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })   
    }
}


const updateWithdrawalAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const { status,  transaction_reference } = req.body

        let results = await Withdrawal.update({
            status, transaction_reference
        }, {
            where: {
                id
            }
        })

        res.json({ message: 'withdrawal updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


module.exports = {
    getWithdrawalsShop,
    getWithdrawalsAdmin,
    getWithdrawalAdmin,
    createWithdrawal,
    updateWithdrawalAdmin
}