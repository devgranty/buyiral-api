const moment = require('moment')
const sendMail = require('../middlewares/nodemailer')
const orderCancelledTemplate = require('../middlewares/mail_templates/order-cancelled-template')
const orderUpdatesTemplate = require('../middlewares/mail_templates/order-updates-template')

const pushOrderHistory = (order_history_string, current_status, order_obj) => {
    let orderHistoryArray = JSON.parse(order_history_string)

    orderHistoryArray.push({
        status: current_status,
        datetime: moment().utc()
    })

    // send mail
    if(current_status === 'order_cancelled'){
        // sendMail(shop_email, `Your order ${order_obj[0].order_id} has been cancelled`, 'order-cancelled-template', {
        //     first_name: '',
        //     order_id: order_obj[0].order_id,
        //     order_unique_id: order_obj[0].id
        // })

        // sendMail(shop_email, `Your order ${order_obj[0].order_id} has been cancelled`, orderCancelledTemplate({
        //     first_name: '',
        //     order_id: order_obj[0].order_id,
        //     order_unique_id: order_obj[0].id
        // }))
    }else{
        // sendMail(shop_email, `Your order ${order_obj[0].order_id} has been updated`, 'order-updates-template', {
        //     first_name: '',
        //     order_id: order_obj[0].order_id,
        //     orders: order_obj
        // })

        // sendMail(shop_email, `Your order ${order_obj[0].order_id} has been updated`, orderUpdatesTemplate({
        //     first_name: '',
        //     order_id: order_obj[0].order_id,
        //     orders: order_obj
        // }))
    }

    return JSON.stringify(orderHistoryArray)
}

module.exports = pushOrderHistory