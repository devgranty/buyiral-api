const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csrf = require('csurf')

// routes
const admins = require('./app/routes/admins.route')
const users = require('./app/routes/users.route')
const shops = require('./app/routes/shops.route')
const items = require('./app/routes/items.route')
const itemratingsandreviews = require('./app/routes/itemratingsandreviews.route')
const saveditems = require('./app/routes/saveditems.route')
const carts = require('./app/routes/carts.route')
const orders = require('./app/routes/orders.route')
const withdrawals = require('./app/routes/withdrawals.route')
const payments = require('./app/routes/payments.route')
const files = require('./app/routes/files.route')
const webhooks = require('./app/routes/webhooks.route')

// init 
const app = express();
const port = process.env.PORT || 5000;

// cors
var whitelist = [process.env.APP_MAIN_DOMAIN, process.env.APP_SHOP_DOMAIN, process.env.APP_ADMIN_DOMAIN];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback('Access denied', false)
            callback(null, true)
        }
    },
    credentials: true
}

// global headers
app.set('x-powered-by', false)

// middlewares => DO NOT RE-ARRANGE
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))
// app.use(csrf({ cookie: true }))
// app.use((req, res, next) => {
    // if(err.code === 'EBADCSRFTOKEN'){
    //     return res.status(403).json({ message: 'Access forbidden', success: false })
    // }
//     res.cookie('CSRFTOKEN', req.csrfToken())
//     next()
// })
app.use('/v1', [admins, users, shops, items, itemratingsandreviews, saveditems, carts, orders, withdrawals, files, webhooks])


app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
    // console.log(require('crypto').createHash('md5').update('Adiele Grant Obioma').digest('hex'))
})


process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.message);
});