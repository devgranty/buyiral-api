const _ = require('lodash');
const crypto = require('crypto');
const Order = require('../models/Orders.model');
const sendMail = require('../middlewares/nodemailer');
const subscriptionCancelledTemplate = require('../middlewares/mail_templates/subscription-cancelled-template')
const pushOrderHistory = require('../middlewares/order_history');
const subscription = require('../middlewares/subscription');
const createPayment = require('../middlewares/create_payment');

const paystackWebHook = async (req, res) => {
    try {
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

        if(hash === req.headers['x-paystack-signature']){

            const paystack = req.body;

            // tell paystack that we got the data
            res.status(200).json({ message: 'Thank you Paystack!' });


            /**
             * ---------------------------------
             * CHARGE.SUCCESS EVENT
             * ---------------------------------
             * any charges made via our payment channel
             * ---------------------------------
             */
            if(paystack.event === 'charge.success' && paystack.data.status === 'success'){
                // [1] for subscription plans
                if(!_.isEmpty(paystack.data.plan)){
                    createPayment(paystack.data.reference, 'subscription_name', paystack.data.customer.email, paystack.data.currency, paystack.data.amount/100)

                    subscription(paystack.data.plan.name, paystack.data.customer.email, paystack.data.plan.currency, paystack.data.plan.amount/100, paystack.data.reference, { months: 1 })
                }
                

                // for orders
                if(_.isEmpty(paystack.data.plan)){
                    createPayment(paystack.data.reference, 'order_id', paystack.data.customer.email, paystack.data.currency, paystack.data.amount/100)
                    
                    // update the order with the reference, 
                    // we use payment reference to identify the
                    // order we want to update
                    const status = 'order_processing'

                    let order = await Order.findAll({
                        where: {
                            transaction_reference: paystack.data.reference
                        }
                    })

                    const status_history = pushOrderHistory(order[0].status_history, status, order)

                    let results = await Order.update({
                        status, status_history
                    }, {
                        where: {
                            transaction_reference: paystack.data.reference
                        }
                    })
                }
            }


            /**
             * ---------------------------------
             * SUBSCRIPTION.NOT_RENEW EVENT
             * ---------------------------------
             * for subscription cancelled for a user via our payment channel, for subscription.create event refer to [1]
             * ---------------------------------
             */
            if(paystack.event === 'subscription.not_renew'){
                // sendMail(paystack.data.customer.email, 'Your subscription has been cancelled successfully and will not renew', 'subscription-cancelled-template', {
                //     shop_name: '',
                //     plan_link: '',
                // })

                sendMail(paystack.data.customer.email, 'Your subscription has been cancelled successfully and will not renew', subscriptionCancelledTemplate({
                    shop_name: '',
                    plan_link: '',
                }))
            }

        }else{
            return res.json({ message: 'Trying something fishy?!' })
        }

    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}

module.exports = {
    paystackWebHook
}