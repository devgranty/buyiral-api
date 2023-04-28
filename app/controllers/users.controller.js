const { Op } = require('sequelize')
const formData = require('form-data')
const Mailgun = require('mailgun.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { User, UserAddresses } = require('../models/Users.model')
const sendMail = require('../middlewares/nodemailer')
const resetPasswordTemplate = require('../middlewares/mail_templates/reset-password-template')
const APP_SECRET = process.env.APP_SECRET
const APP_MAIN_DOMAIN = process.env.APP_MAIN_DOMAIN

/**
 * ------------------------------------------
 * USERS CONTROLLERS
 * ------------------------------------------
 */
 const getUsersAdmin = async (req, res) => {
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
            whereClause.email = { [Op.like]: `%${query}%` }
        }

        let results = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            order: [[order, sort]],
            limit,
            offset: startIndex,
            where: whereClause,
            paranoid: false,
            distinct: true
        })
        
        const totalPages = Math.round(results.count/limit)
        results.limit = limit

        results.totalPages = (totalPages > 0) ? totalPages : 1

        if(endIndex < results.count){
            results.next = page + 1
        }
        if(startIndex > 0){
            results.previous = page - 1
        }

        res.json({ message: 'users retrieved successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getUser = async (req, res) => {
    try {
        const email = req.params.email

        let results = await User.findOne({
            attributes: ['first_name', 'last_name'],
            where: {
                email
            }
        })
        if(results === null){
            res.json({ message: 'user not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'user retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getUserPrivate = async (req, res) => {
    try {
        const idOrEmail = req.params.idOrEmail

        let results = await User.findOne({
            attributes: { exclude: ['password'] },
            order: [['shops', 'id', 'DESC']],
            where: {
                [Op.or]: [
                    { email: idOrEmail },
                    { id: idOrEmail }
                ]
            },
            include: [
                {
                    model: UserAddresses
                },
                'shops'
            ]
        })
        if(results === null){
            res.json({ message: 'user not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'user retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getUserAdmin = async (req, res) => {
    try {
        const id = req.params.id

        let results = await User.findOne({
            attributes: ['first_name', 'last_name', 'email', 'created_at', 'updated_at'],
            where: {
                id
            }
        })
        if(results === null){
            res.json({ message: 'user not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'user retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, email_verified_at, password } = req.body

        let results = await User.create({
            first_name, last_name, email, email_verified_at, password
        })
        res.json({ message: 'user created successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateUser = async (req, res) => {
    try {
        const idOrEmail = req.params.idOrEmail
        const { first_name, last_name, email, email_verified_at, password } = req.body

        let results = await User.update({
            first_name, last_name, email, email_verified_at, password
        }, {
            where: {
                [Op.or]: [
                    { email: idOrEmail },
                    { id: idOrEmail }
                ]
            }
        })
        res.json({ message: 'user updated successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteUser = async (req, res) => {
    try {
        const idOrEmail = req.params.idOrEmail

        let results = await User.destroy({
            where: {
                [Op.or]: [
                    { email: idOrEmail },
                    { id: idOrEmail }
                ]
            }
        })
        res.json({ message: 'user deleted successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * USERS ADDRESS CONTROLLERS
 * ------------------------------------------
 */
 const getAddresses = async (req, res) => {
    try {
        const order = (typeof req.query.order != 'undefined' && req.query.order != '') ? req.query.order : 'id'
        const sort = (typeof req.query.sort != 'undefined' && (req.query.sort === 'desc' || req.query.sort === 'asc')) ? req.query.sort : 'desc'
        
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id >= 0) ? req.query.user_id : ''
        const _default = (typeof req.query.default != 'undefined' && (req.query.default === '1' || req.query.default === '0')) ? req.query.default : ''

        var whereClause = {}
        if(_default != ''){
            whereClause._default = _default
        }

        let results = await UserAddresses.findAndCountAll({
            order: [[order, sort]],
            distinct: true,
            where: {
                user_id,
                ...whereClause
            }
        })

        res.json({ message: 'user addresses retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getAddress = async (req, res) => {
    try {
        const id = req.params.id
        const user_id = (typeof req.query.user_id != 'undefined' && req.query.user_id >= 0) ? req.query.user_id : ''
        const _default = (typeof req.query.default != 'undefined' && (req.query.default === '1' || req.query.default === '0')) ? req.query.default : ''
        
        var whereClause = {}
        if(_default != ''){
            whereClause._default = _default
        }

        let results = await UserAddresses.findOne({
            where: {
                id,
                user_id,
                ...whereClause
            },
        })
        if(results === null){
            res.json({ message: 'user address not found', success: false, error_message: '', results })
        }else{
            res.json({ message: 'user address retrieved successfully', success: true, error_message: '', results })
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createAddress = async (req, res) => {
    try {
        const { user_id, first_name, last_name, address, city, country, state, phone_number, additional_information, _default } = req.body

        let results = await UserAddresses.create({
            user_id, first_name, last_name, address, city, country, state, phone_number, additional_information, _default
        })
        res.json({ message: 'user address created successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateAddress = async (req, res) => {
    try {
        const id = req.params.id
        const { first_name, last_name, address, city, country, state, phone_number, additional_information, _default } = req.body


        let results = await UserAddresses.update({
            first_name, last_name, address, city, country, state, phone_number, additional_information, _default
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'user address updated successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id

        let results = await UserAddresses.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'user address deleted successfully', success: true, error_message: '', results })   
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error, results: null })
    }
}



/**
 * ------------------------------------------
 * USERS PASSWORD CONTROLLER
 * ------------------------------------------
 */
const createPasswordResetToken = (req, res) => {
    try {
        const { email, user_name } = req.body
        const expires_at = moment().utc().add(15, 'minutes').unix()

        const reset_token = jwt.sign({ email, expires_at }, APP_SECRET)

        // send reset token email to user
        // sendMail(email, 'Your password reset link', 'reset-password-template', {
        //     user_name,
        //     password_reset_link: `${APP_MAIN_DOMAIN}/reset-password/?rxttoken=${reset_token}`
        // })

        sendMail(email, 'Your password reset link', resetPasswordTemplate({
            user_name,
            password_reset_link: `${APP_MAIN_DOMAIN}/reset-password/?rxttoken=${reset_token}`
        }))

        res.json({ message: 'reset token successful', success: true, error_message: '', results: reset_token })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const checkPasswordResetToken = (req, res) => {
    const { reset_token } = req.body

    jwt.verify(reset_token, APP_SECRET, (err, decodedResetToken) => {
        if(err){
            res.json({ message: 'invalid token', success: false, error_message: 'TOKENERR', results: null })
        }else{
            // check if link is expired
            if(decodedResetToken.expires_at > moment().utc().unix()){
                res.json({ message: 'valid token', success: true, error_message: '', results: null })
            }else{
                res.json({ message: 'expired token', success: false, error_message: 'TOKENERR', results: null })
            }
        }
    })
}


const resetPassword = async (req, res) => {
    try {
        const { reset_token, new_password } = req.body

        jwt.verify(reset_token, APP_SECRET, async (err, decodedResetToken) => {

            if(err){
                res.json({ message: 'failed to change password', success: false, error_message: 'TOKENERR', results: null })

            }else{
                let results = await User.findOne({
                    where: {
                        email: decodedResetToken.email
                    }
                })

                // user doesn't exist
                if(results === null){
                    res.json({ message: 'failed to change password', success: false, error_message: 'USERERR', results: null })

                }else{
                    let results = await User.update({
                        password: new_password
                    }, {
                        where: {
                            email: decodedResetToken.email
                        }
                    })
                    res.json({ message: 'password changed successfully', success: true, error_message: '', results })
                }  
            }
        })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const changePassword = async (req, res) => {
    try {
        const { user_id, current_password, new_password } = req.body

        let results = await User.findOne({
            where: {
                id: user_id
            }
        })

        // user doesn't exist
        if(results === null){
            res.json({ message: 'failed to change password', success: false, error_message: 'USERERR', results: null })
        }else{
            var auth = await bcrypt.compare(current_password, results.password)

            // update password
            if(auth){
                let results = await User.update({
                    password: new_password
                }, {
                    where: {
                        id: user_id
                    }
                })
                res.json({ message: 'password changed successfully', success: true, error_message: '', results })
            }else{
                res.json({ message: 'failed to change password', success: false, error_message: 'PSWERR', results: null })
            }
        }
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * USERS LOGIN CONTROLLERS
 * ------------------------------------------
 */
 const userAuthStatus = (req, res) => {
    try {
        const BLSID = req.cookies.BLSID

        // check if json web token exists & is verified
        if(BLSID){
            jwt.verify(BLSID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    res.json({ allow: false, user: null, error_message: err })
                }else{
                    res.json({ allow: true, user: decodedToken, error_message: '' })
                }
            })
        }else{
            res.json({ allow: false, user: null, error_message: '' })
        }   
    } catch (error) {
        res.json({ allow: false, user: null, error_message: error.name })
    }
}


const userAuthLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const maxAge = 1 * 24 * 60 * 60 * 1000

        let results = await User.findOne({
            where: {
                email
            }
        })
        if(results === null){
            // incorrect email
            res.json({ allow: false, user: null, error_message: '' })
        }else{
            var auth = await bcrypt.compare(password, results.password)
            if(auth){
                const userData = {
                    user_id: results.id,
                    user_name: results.first_name + ' ' + results.last_name
                }
                const token = jwt.sign(userData, APP_SECRET)
                res.cookie('BLSID', token, { 
                    httpOnly: true,
                    maxAge: maxAge,
                    sameSite: 'Lax',
                    secure: true,
                    domain: APP_MAIN_DOMAIN
                })
                res.json({ allow: true, user: userData })
            }else{
                // incorrect password
                res.json({ allow: false, user: null, error_message: '' })
            }
        }
    } catch (error) {
        res.json({ allow: false, user: null, error_message: error.name })
    }
}


const userAuthLogout = (req, res) => {
    try {
        const BLSID = req.cookies.BLSID

        if(BLSID){
            res.clearCookie('BLSID', { httpOnly: true, sameSite: 'Lax', secure: true, domain: APP_MAIN_DOMAIN })
        }
        res.json({ allow: false, user: null, error_message: '' })
    } catch (error) {
        res.json({ allow: false, user: null, error_message: error })
    }
}



/**
 * ------------------------------------------
 * MEMBER JOIN MAIL LIST
 * ------------------------------------------
 */
const joinMailList = async (req, res) => {
    try {
        const { email } = req.body

        const mailgun = new Mailgun(formData)

        const mg = mailgun.client({ 
            username: 'api',
            key: process.env.MAIL_API_KEY
        })

        const addMember = await mg.lists.members.createMember(process.env.MAIL_LIST_DOMAIN, {
            address: email
        })

        res.json({ message: 'added to mailing list', success: true, error_message: '', results: addMember })
        
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



module.exports = {
    getUsersAdmin,
    getUser,
    getUserPrivate,
    getUserAdmin,
    createUser,
    updateUser,
    deleteUser,

    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,

    createPasswordResetToken,
    checkPasswordResetToken,
    resetPassword,
    changePassword,

    userAuthStatus,
    userAuthLogin,
    userAuthLogout,

    joinMailList
}