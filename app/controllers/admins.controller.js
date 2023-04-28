const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sequelize = require('../config/db.config')
const { Admin, AdminLog } = require('../models/Admin.model')
const APP_SECRET = process.env.APP_SECRET
const APP_MAIN_DOMAIN = process.env.APP_MAIN_DOMAIN

const getAdmin = async (req, res) => {
    try {
        const idOrEmail = req.params.idOrEmail

        let results = await Admin.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                [Op.or]: [
                    { email: idOrEmail },
                    { id: idOrEmail }
                ]
            }
        })
        res.json({ message: 'admin retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const getStatAdmin = async (req, res) => {
    try {
        let results = await Admin.findOne({
            
            attributes: [
                // withdrawal counts
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM withdrawals
                    WHERE
                    status = 'pending'
                )`),
                'total_pending_withdrawal'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM withdrawals
                    WHERE
                    status = 'completed'
                )`),
                'total_compeleted_withdrawal'],

                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM withdrawals
                    WHERE
                    status = 'cancelled'
                )`),
                'total_cancelled_withdrawal'],

                // item count
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM items
                )`),
                'total_items'],

                // shop count
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM shops
                )`),
                'total_shops'],

                // user count
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM users
                )`),
                'total_users'],

                // order counts
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM orders
                    WHERE status = 'order_pending'
                )`),
                'total_pending_orders'],

                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM orders
                    WHERE status = 'order_cancelled'
                )`),
                'total_cancelled_orders'],

                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM orders
                    WHERE status = 'order_processing'
                )`),
                'total_processing_orders'],

                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM orders
                    WHERE status = 'order_shipped'
                )`),
                'total_shipped_orders'],

                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM orders
                    WHERE status = 'order_delivered'
                )`),
                'total_delivered_orders']
            ]
        })
        res.json({ message: 'stat retrieved successfully', success: true, error_message: '', results })

    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const createAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, address, city, country, state, department, password } = req.body

        let results = await Admin.create({
            first_name, last_name, email, phone_number, address, city, country, state, department, password
        })
        res.json({ message: 'admin created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const updateAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const { first_name, last_name, phone_number } = req.body

        let results = await Admin.update({
            first_name, last_name, phone_number
        }, {
            where: {
                id
            }
        })
        res.json({ message: 'admin updated successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}


const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id

        let results = await Admin.destroy({
            where: {
                id
            }
        })
        res.json({ message: 'admin deleted successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}



/**
 * ------------------------------------------
 * ADMIN PASSWORD CONTROLLER
 * ------------------------------------------
 */
 const changePassword = async (req, res) => {
    try {
        const { admin_id, current_password, new_password } = req.body

        let results = await Admin.findOne({
            where: {
                id: admin_id
            }
        })

        // admin doesn't exist
        if(results === null){
            res.json({ message: 'failed to change password', success: false, error_message: 'ADMINERR', results: null })
        }else{
            var auth = await bcrypt.compare(current_password, results.password)

            // update password
            if(auth){
                let results = await Admin.update({
                    password: new_password
                }, {
                    where: {
                        id: admin_id
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
 * ADMIN LOGS CONTROLLER
 * ------------------------------------------
 */
 const getAdminLogs = async (req, res) => {
    try {
        const page = (typeof req.query.page != 'undefined' && req.query.page != '' && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (typeof req.query.limit != 'undefined' && req.query.limit != '' && req.query.limit <= 50) ? parseInt(req.query.limit) : 50
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        let results = await AdminLog.findAndCountAll({
            order: [['id', 'desc']],
            limit,
            offset: startIndex,
            include: [
                {
                    model: Admin,
                    attributes: ['first_name', 'last_name', 'department']
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

        res.json({ message: 'admin log retrieved successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.name, results: null })
    }
}

const createAdminLog = async (req, res) => {
    try {
        const { action, admin_id } = req.body

        let results = await AdminLog.create({
            action, admin_id
        })
        res.json({ message: 'admin log created successfully', success: true, error_message: '', results })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error, results: null })
    }
}



/**
 * ------------------------------------------
 * ADMIN LOGIN CONTROLLERS
 * ------------------------------------------
 */
const adminAuthStatus = (req, res) => {
    try {
        const BLASID = req.cookies.BLASID

        // check if json web token exists & is verified
        if(BLASID){
            jwt.verify(BLASID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    res.json({ allow: false, admin: null, error_message: err })
                }else{
                    res.json({ allow: true, admin: decodedToken, error_message: '' })
                }
            })
        }else{
            res.json({ allow: false, admin: null, error_message: '' })
        }   
    } catch (error) {
        res.json({ allow: false, admin: null, error_message: error.name })
    }
}


const adminAuthLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const maxAge = 1 * 24 * 60 * 60 * 1000

        let results = await Admin.findOne({
            where: {
                email
            }
        })
        if(results === null){
            // incorrect email
            res.json({ allow: false, admin: null, error_message: '' })
        }else{
            var auth = await bcrypt.compare(password, results.password)
            if(auth){
                const userData = { 
                    admin_id: results.id,
                    user_name: results.first_name + ' ' + results.last_name,
                    admin_department: results.department
                }
                const token = jwt.sign(userData, APP_SECRET)
                res.cookie('BLASID', token, {
                    httpOnly: true,
                    maxAge: maxAge,
                    sameSite: 'Lax',
                    secure: true,
                    domain: APP_MAIN_DOMAIN
                })
                res.json({ allow: true, admin: userData, error_message: '' })
            }else{
                // incorrect password
                res.json({ allow: false, admin: null, error_message: '' })
            }
        }
    } catch (error) {
        res.json({ allow: false, admin: null, error_message: error.name })
    }
}


const adminAuthLogout = (req, res) => {
    try {
        const BLASID = req.cookies.BLASID

        if(BLASID){
            res.clearCookie('BLASID', { httpOnly: true, sameSite: 'Lax', secure: true, domain: APP_MAIN_DOMAIN })
        }
        res.json({ allow: false, admin: null, error_message: '' })
    } catch (error) {
        res.json({ allow: false, admin: null, error_message: error })
    }
}


module.exports = {
    getAdmin,
    getStatAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,

    getAdminLogs,
    createAdminLog,

    adminAuthStatus,
    adminAuthLogin,
    adminAuthLogout
}