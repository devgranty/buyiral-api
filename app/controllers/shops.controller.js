const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const axios = require('axios')
const { Shop, ShopSubscription, ShopEmployee } = require('../models/Shops.model')
const { User } = require('../models/Users.model')
const Order  = require('../models/Orders.model')
const Withdrawal = require('../models/Withdrawals.model')
const sendMail = require('../middlewares/nodemailer')
const shopVerificationTemplate = require('../middlewares/mail_templates/shop-verification-template')
const employeeInviteTemplate = require('../middlewares/mail_templates/employee-invite-template')
const subscription = require('../middlewares/subscription')
const sequelize = require('sequelize')
const APP_SECRET = process.env.APP_SECRET
const APP_MAIN_DOMAIN = process.env.APP_MAIN_DOMAIN

/**
 * ------------------------------------------
 * SHOPS CONTROLLERS
 * ------------------------------------------
 */
 const getShopsAdmin = async (req, res) => {    
    try {
        const order = (typeof req.query.order != 'undefined' && req.query.order != '') ? req.query.order : 'id'
        const sort = (typeof req.query.sort != 'undefined' && (req.query.sort === 'desc' || req.query.sort === 'asc')) ? req.query.sort : 'desc'
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const query = (typeof req.query.query != 'undefined') ? req.query.query : ''

        var whereClause = {}

        if(query != ''){
            whereClause.name = { [Op.like]: `%${query}%` }
        }

        let results = await Shop.findAndCountAll({
            order: [[order, sort]],
            limit,
            offset: startIndex,
            where: whereClause,
            paranoid: false,
            distinct: true
        })

        const totalPages = Math.ceil(results.count/limit)
        results.limit = limit

        results.totalPages = (totalPages > 0) ? totalPages : 1

        if(endIndex < results.count){
            results.next = page + 1
        }
        if(startIndex > 0){
            results.previous = page - 1
        }

        res.json({ message: 'shops retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getShop = async (req, res) => {
    try {
        const slugOrEmail = req.params.slugOrEmail
        
        let results = await Shop.findOne({
            attributes: ['id', 'slug', 'name', 'logo', 'tagline', 'description', 'created_at'],
            where: {
                [Op.or]: [
                    { slug: slugOrEmail },
                    { email: slugOrEmail }
                ]
            },
            include: [
                {
                    model: ShopSubscription
                }
            ]
        })
        if(results === null){
            res.json({ message: 'shop not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'shop retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getShopPrivate = async (req, res) => {
    try {
        const shop_id = req.params.shop_id

        let results = await Shop.findOne({
            where: {
                id: shop_id
            },
            include: [
                {
                    model: ShopSubscription
                },
                { 
                    model: User,
                    attributes: ['first_name', 'last_name', 'email']
                },
                {
                    model: Order,
                    attributes: [
                        [sequelize.literal(`(
                            SELECT SUM(amount)
                            FROM orders
                            WHERE
                            shop_id = ${shop_id} AND status = 'order_delivered'
                        )`),
                        'total_credit'],

                        [sequelize.literal(`(
                            SELECT SUM(amount)
                            FROM orders
                            WHERE
                            shop_id = ${shop_id} AND status NOT IN('order_cancelled', 'order_delivered')
                        )`),
                        'pending_credit']
                    ]
                },
                {
                    model: Withdrawal,
                    attributes: [
                        [sequelize.literal(`(
                            SELECT SUM(amount)
                            FROM withdrawals
                            WHERE
                            shop_id = ${shop_id} AND status NOT IN('cancelled')
                        )`),
                        'total_debit']
                    ]
                }
            ]
        })
        if(results === null){
            res.json({ message: 'shop not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'shop retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getShopAdmin = async (req, res) => {
    try {
        const id = req.params.id
        
        let results = await Shop.findOne({
            attributes: ['name', 'tagline', 'description', 'email', 'email_verified_at', 'phone_number', 'whatsapp', 'twitter', 'country', 'state', 'address', 'created_at', 'updated_at'],
            where: {
                id
            },
            include: [
                {
                    model: ShopSubscription
                }
            ]
        })
        if(results === null){
            res.json({ message: 'shop not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'shop retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



const getShopStat = async (req, res) => {
    try {
        const shop_id = (typeof req.query.shop_id != 'undefined' && req.query.shop_id >= 0) ? req.query.shop_id : ''

        let results = await Shop.findOne({
            attributes: [
                [sequelize.literal(`(
                    SELECT count(*) FROM items AS item WHERE (item.deleted_at IS NULL AND item.shop_id = ${shop_id})
                )`), 
                'total_shop_items'],

                [sequelize.literal(`(
                    SELECT FORMAT( AVG(item_ratings_and_reviews.star_rating), 1 ) FROM item_ratings_and_reviews AS item_ratings_and_reviews INNER JOIN items AS item ON item_ratings_and_reviews.item_id = item.id AND (item.deleted_at IS NULL AND item.shop_id = ${shop_id})
                )`), 
                'avg_shop_rating']
            ],
        })

        res.json({ message: 'shop avg rating retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



const createShop = async (req, res) => {
    try {
        const { name, slug, logo, tagline, description, email, email_verified_at, phone_number, whatsapp, twitter, country, state, address, currency } = req.body

        let results = await Shop.create({
            name, slug, logo, tagline, description, email, email_verified_at, phone_number, whatsapp, twitter, country, state, address, currency
        })
        const token = jwt.sign({'shop_id': results.id, 'shop_email': results.email}, APP_SECRET)

        // sendMail(results.email, 'Verify your shop email', 'shop-verification-template', {
        //     verify_email_link: `${APP_MAIN_DOMAIN}/verify-email/?vftoken=${token}`
        // })

        sendMail(results.email, 'Verify your shop email', shopVerificationTemplate({
            verify_email_link: `${APP_MAIN_DOMAIN}/verify-email/?vftoken=${token}`
        }))

        res.json({ message: 'shop created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const resendNewShopVerifyLink = (req, res) => {
    try {
        const { shop_email, shop_id } = req.body
        const token = jwt.sign({shop_id, 'shop_email': shop_email}, APP_SECRET)

        // sendMail(shop_email, 'Verify your shop email', 'shop-verification-template', {
        //     verify_email_link: `${APP_MAIN_DOMAIN}/verify-email/?vftoken=${token}`
        // })

        sendMail(shop_email, 'Verify your shop email', shopVerificationTemplate({
            verify_email_link: `${APP_MAIN_DOMAIN}/verify-email/?vftoken=${token}`
        }))
        
        res.json({ message: 'shop verification link resent successfully', success: true, error_message: '', results: 1 })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const verifyNewShop = (req, res) => {
    try {
        const token = req.body.token

        jwt.verify(token, APP_SECRET, async (err, decodeVerificationToken) => {
            if(err){
                return res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
            }else{
                // verify shop
                let results = await Shop.update({
                    email_verified_at: moment().utc()
                }, {
                    where: {
                        [Op.and]: [
                            { id: decodeVerificationToken.shop_id },
                            { email: decodeVerificationToken.shop_email },
                            { email_verified_at: null }
                        ]
                    }
                })
                if(results[0] === 1){
                    return res.json({ message: 'shop email verified successfully', success: true, error_message: '', results })
                }else{
                    return res.json({ message: 'shop email already verified', success: false, error_message: 'cannot complete request. shop email already verified', results })
                }
            }
        })
    } catch (error) {
        return res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateShop = async (req, res) => {
    try {
        const idOrSlug = req.params.idOrSlug
        const { name, slug, logo, tagline, description, email, email_verified_at, phone_number, whatsapp, twitter, country, state, address, bank_name, account_number, account_name } = req.body

        let results = await Shop.update({
            name, slug, logo, tagline, description, email, email_verified_at, phone_number, whatsapp, twitter, country, state, address, bank_name, account_number, account_name
        }, {
            where: {
                [Op.or]: [
                    { slug: idOrSlug },
                    { id: idOrSlug }
                ]
            }
        })
        res.json({ message: 'shop updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const verifyBankDetails = async (req, res) => {
    try {
        const { bank_code, account_number } = req.body

        const paystackConfigOptions = {
            method: 'get',
            url: `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            }
        }
        const response = await axios(paystackConfigOptions)

        res.json({ message: 'verification details retrieved successfully', success: true, error_message: '', results: response.data })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error, results: null })
    }
}


const deleteShop = async (req, res) => {
    try {
        const idOrSlug = req.params.idOrSlug

        let results = await Shop.destroy({
            where: {
                [Op.or]: [
                    { slug: idOrSlug },
                    { id: idOrSlug }
                ]
            }
        })
        res.json({ message: 'shop deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * SHOPS SUBSCRIPTIONS CONTROLLERS
 * ------------------------------------------
 */
const getShopSubscriptions = async (req, res) => {
    try {
        const shop_id = req.query.shop_id
        
        const results = await ShopSubscription.findAndCountAll({
            order: [['id', 'desc']],
            where: {
                shop_id
            }
        })
        res.json({ message: 'shop subscription retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createShopSubscription = async (req, res) => {
    try {
        const { name, email, currency, amount, transaction_reference, expires } = req.body

        let results = await subscription(name, email, currency, amount, transaction_reference, expires)
        if(results === null){
            res.json({ message: 'shop subscription was not created', success: false, error_message: '', results })
        }else{
            res.json({ message: 'shop subscription created successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * SHOPS EMPLOYEES CONTROLLERS
 * ------------------------------------------
 */
const inviteShopEmployee = async (req, res) => {
    try {
        const { shop_name, email, role, shop_id } = req.body
        const expires_at = moment().utc().add(15, 'minutes').unix()

        const invite_token = jwt.sign({ email, role, shop_id, expires_at }, APP_SECRET)

        // send invite token email to user
        // sendMail(email, 'Your employee invite link', 'employee-invite-template', {
        //     shop_name,
        //     invite_link: `${APP_MAIN_DOMAIN}/employee-invite/?invite=${invite_token}`
        // })

        sendMail(email, 'Your employee invite link', employeeInviteTemplate({
            shop_name,
            email,
            invite_link: `${APP_MAIN_DOMAIN}/employee-invite/?invite=${invite_token}`
        }))

        res.json({ message: 'invite token successful', success: true, error_message: '', results: invite_token })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const checkShopEmployeeInvite = async (req, res) => {
    try {
        const { invite_token, user_id } = req.body

        //check user ID
        let results = await User.findOne({
            where: {
                id: user_id
            }
        })
        if(results === null){
            return res.json({ message: 'cannot complete request', success: false, error_message: 'USERERR', results: null })
        }

        // check invite token
        jwt.verify(invite_token, APP_SECRET, async (err, decodedInviteToken) => {
            if(err){
                return res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
            }else{

                // check if link is expired
                if(decodedInviteToken.expires_at < moment().utc().unix()){
                    return res.json({ message: 'expired token', success: false, error_message: 'TOKENERR', results: null })
                }else{

                    // check if token email matches user email
                    if(results.email !== decodedInviteToken.email){
                        return res.json({ message: 'cannot complete request', success: false, error_message: 'USERERR', results: null })
                    }else{
                        // get shop name
                        let results = await Shop.findOne({
                            where: {
                                id: decodedInviteToken.shop_id
                            }
                        })
                        decodedInviteToken.shop_name = results.name
                        return res.json({ message: 'invite token valid', success: true, error_message: '', results: decodedInviteToken })
                    }

                }
            }
        })
        
    } catch (error) {
        return res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createShopEmployee = async (req, res) => {
    try {
        const { shop_id, user_id, role } = req.body

        let results = await ShopEmployee.create({
            shop_id, user_id, role
        })
        res.json({ message: 'shop employee created successfully', success: true, error_message: '', results })        
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteShopEmployee = async (req, res) => {
    try {
        const id = req.params.id
        
        let results = await ShopEmployee.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'shop employee deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * SHOPS LOGIN CONTROLLERS
 * ------------------------------------------
 */
 const shopAuthStatus = async (req, res) => {
    try {
        const SPSID = req.cookies.SPSID

        if(SPSID){
            jwt.verify(SPSID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    return res.json({ allow: false, shop: null, error_message: err })
                }else{
                    return res.json({ allow: true, shop: decodedToken, error_message: '' })
                }
            })
        }else{
            return res.json({ allow: false, shop: null, error_message: '' })
        }   
    } catch (error) {
        return res.json({ allow: false, shop: null, error_message: error.name })
    }
}



const shopAuthLogin = async (req, res) => {
    try {
        const { shop_id, user_email } = req.body
        const maxAge = 1 * 24 * 60 * 60 * 1000

        let results = await Shop.findOne({
            where: {
                id: shop_id
            },
            include: [
                {
                    model: ShopSubscription
                },
                {
                    model: User,
                    attributes: ['first_name', 'last_name', 'email'],
                    required: true,
                    where: {
                        email: user_email
                    }
                }
            ]
        })

        // assign shop subscription status
        if(results.shop_subscription === null){
            var shop_sub = false
        }else{
            var shop_sub = ( moment(results.shop_subscription.expires_on).utc().add(1, 'day').diff(moment().utc()) < 0 ) ? false : true
        }
        
        if(results === null){
            // incorrect shop
            return res.json({ allow: false, shop: null, error_message: '' })
        }else{
            const shopData = { 
                shop_id: results.id,
                shop_name: results.name,
                shop_slug: results.slug,
                shop_sub,
                user_role: results.users[0].shop_employees.role
            }
            const token = jwt.sign(shopData, APP_SECRET)
            res.cookie('SPSID', token, { 
                httpOnly: true,
                maxAge: maxAge,
                sameSite: 'Lax',
                secure: true,
                domain: APP_MAIN_DOMAIN
            })
            return res.json({ allow: true, shop: shopData, error_message: '' })
        }
    } catch (error) {
        return res.json({ allow: false, shop: null, error_message: error.name })
    }
}


const shopAuthLogout = async (req, res) => {
    try {
        const SPSID = req.cookies.SPSID
        
        if(SPSID){
            return res.clearCookie('SPSID', { httpOnly: true, sameSite: 'Lax', secure: true, domain: APP_MAIN_DOMAIN })
        }
        return res.json({ allow: false, shop: null, error_message: '' })
    } catch (error) {
        return res.json({ allow: false, shop: null, error_message: error.name })
    }
}



module.exports = {
    getShopsAdmin,
    getShop,
    getShopPrivate,
    getShopAdmin,
    getShopStat,
    createShop,
    resendNewShopVerifyLink,
    verifyNewShop,
    updateShop,
    verifyBankDetails,
    deleteShop,

    getShopSubscriptions,
    createShopSubscription,

    inviteShopEmployee,
    checkShopEmployeeInvite,
    createShopEmployee,
    deleteShopEmployee,

    shopAuthStatus,
    shopAuthLogin,
    shopAuthLogout
}