const { Op } = require('sequelize')
const axios = require('axios')
const Payment = require('../models/Payments.model')

/**
 * ------------------------------------------
 * PAYMENTS CONTROLLERS
 * ------------------------------------------
 */
const getPaymentsAdmin = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''

        var whereClause = {}

        if(query != ''){
            whereClause.transaction_reference = {
                [Op.like]: `%${query}%`
            }
        }

        let results = await Payment.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            where: whereClause
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

        res.json({ message: 'payments retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const verifyPayment = async (req, res) => {
    try {
        const { transaction_reference } = req.body

        const paystackConfigOptions = {
            method: 'get',
            url: `https://api.paystack.co/transaction/verify/${transaction_reference}`,
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            }
        }
        const paystack = await axios(paystackConfigOptions)

        let results = await Payment.findOne({
            where: {
                transaction_reference
            }
        })

        if(paystack.data.data && results){
            if(paystack.data.data.status === "success" && paystack.data.data.reference === results.transaction_reference && paystack.data.data.amount >= results.amount * 100 && paystack.data.data.currency === results.currency){
                res.json({ message: 'payment verification successful', success: true, error_message: '', results })
            }else{
                res.json({ message: 'payment verification failed', success: false, error_message: '', results: null })
            }
        }else{
            res.json({ message: 'transaction not found', success: false, error_message: '', results: null }) 
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}

module.exports = {
    getPaymentsAdmin,
    verifyPayment
}