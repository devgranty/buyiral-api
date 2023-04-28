const moment = require('moment')
const { Shop, ShopSubscription } = require('../models/Shops.model')
const sendMail = require('./nodemailer')
const subscriptionConfirmationTemplate = require('./mail_templates/subscription-confirmation-template')

const subscription = async (name, email, currency, amount, transaction_reference, expires) => {

    try {
        
        const expires_on = moment().add(expires)

        let check = await ShopSubscription.findOne({
            where: {
                transaction_reference
            }
        })

        let shop = await Shop.findOne({
            where: {
                email
            }
        })

        if(check === null && shop !== null){
            let results = await ShopSubscription.create({
                shop_id: shop.id, name, email, currency, amount, transaction_reference, expires_on
            })
            if(results){
                // sendMail(email, 'Subscription confirmation', 'subscription-confirmation-template', {
                //     shop_name: shop.name,
                //     plan_name: results.name,
                //     plan_currency: currency,
                //     plan_amount: results.amount,
                //     plan_created_at: moment(results.created_at).utc().format('MMM DD, YYYY'),
                //     plan_expires_on: moment(results.expires_on).utc().format('MMM DD, YYYY'),
                //     premium_plan: (results.name === 'Premium')
                // })

                sendMail(email, 'Subscription confirmation', subscriptionConfirmationTemplate({
                    shop_name: shop.name,
                    plan_name: results.name,
                    plan_currency: currency,
                    plan_amount: results.amount,
                    plan_created_at: moment(results.created_at).utc().format('MMM DD, YYYY'),
                    plan_expires_on: moment(results.expires_on).utc().format('MMM DD, YYYY'),
                    premium_plan: (results.name === 'Premium')
                }))
                
            }
            return results
        }

    } catch (error) {
        return error.name
    }
}

module.exports = subscription