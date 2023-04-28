const e = require('express')
const jwt = require('jsonwebtoken')
const APP_SECRET = process.env.APP_SECRET

const authUser = (req, res, next) => {
    try {
        const BLSID = req.cookies.BLSID

        // check if json web token exists & is verified
        if(BLSID){
            jwt.verify(BLSID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    res.status(401).json({ allow: false, user: null })
                }else{
                    next()
                }
            })
        }else{
            res.status(401).json({ allow: false, user: null })
        }   
    } catch (error) {
        res.status(401).json({ allow: false, user: null })
    }
}


const authShop = (req, res, next) => {
    try {
        const SPSID = req.cookies.SPSID

        // check if json web token exists & is verified
        if(SPSID){
            jwt.verify(SPSID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    res.status(401).json({ allow: false, shop: null })
                }else{
                    next()
                }
            })
        }else{
            res.status(401).json({ allow: false, shop: null })
        }   
    } catch (error) {
        res.status(401).json({ allow: false, shop: null })
    }
}


const authAdmin = (req, res, next) => {
    try {
        const BLASID = req.cookies.BLASID

        if(BLASID){
            jwt.verify(BLASID, APP_SECRET, (err, decodedToken) => {
                if(err){
                    res.status(401).json({ allow: false, admin: null })
                }else{
                    next()
                }
            })
        }else{
            res.status(401).json({ allow: false, admin: null })
        }
    } catch (error) {
        res.status(401).json({ allow: false, admin: null })
    }
}


module.exports = { authUser, authShop, authAdmin }