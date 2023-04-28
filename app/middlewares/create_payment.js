const Payment = require('../models/Payments.model')

const createPayment = async (transaction_reference, meta, email, currency, amount) => {
    try {
        await Payment.create({
            transaction_reference, meta, email, currency, amount, status: 'successful'
        })
        return results
    } catch (error) {
        return error.name
    }
}

module.exports = createPayment