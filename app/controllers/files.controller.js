const multer = require('multer')
const mv = require('mv')
const randomstring = require('randomstring')
const path = require('path')
const fs = require('fs')


// Init multer
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        let subdirectory = req.params.subdirectory
        let path = `./uploads/${subdirectory}`
        callback(null, path)
    },
    filename: function(req, file, callback) {
        callback(null, randomstring.generate(50) + path.extname(file.originalname))
    }
})
const upload = multer({
    storage,
    limits: { fileSize: 2000000000000 },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4'){
            return callback(null, false)
        }
        return callback(null, true)
    }
}).single('file')
  

/**
 * ------------------------------------------
 * UPLOADS CONTROLLERS
 * ------------------------------------------
 */
const getFile = (req, res) => {    
    try {
        const { subdirectory, filename } = req.params
        const filePath = path.resolve(`./uploads/${subdirectory}/${filename}`)

        fs.access(filePath, function(err){
            if(!err){
                res.sendFile(filePath)
            }else{
                res.status(400).json({ message: 'bad request' })
            }
        })
    } catch (error) {
        res.json({ message: 'cannot complete request', success: false, error_message: error.message, results: null })
    }
}


const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if(!err){
            res.json({ message: 'file uploaded successfully', success: true, error_message: '', results: req.file })
        }else{
            res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
        }
    })
}


const moveFile = (req, res) => {
    try {
        const { todirectory, filename } = req.params
        const from = path.resolve(`./uploads/tmp/${filename}`)
        const dest = path.resolve(`./uploads/${todirectory}/${filename}`)

        mv(from, dest, (err) => {
            if(!err){
                res.json({ message: 'file moved successfully', success: true, error_message: '', results: 1 })
            }else{
                res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
            }
        })
    } catch (error) {
         res.json({ message: 'cannot complete request', success: false, error_message: error.message, results: null })
    }
}


const deleteFile = (req, res) => {
    const { subdirectory, filename } = req.params
    const filePath = path.resolve(`./uploads/${subdirectory}/${filename}`)
    
    fs.access(filePath, function(err){
        if(!err){
            fs.unlink(filePath, (err) => {
                if(!err){
                    res.json({ message: 'file deleted successfully', success: true, error_message: '', results: 1 })
                }else{
                    res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
                }
            })
        }else{
            res.json({ message: 'cannot complete request', success: false, error_message: err, results: null })
        }
    })
}


module.exports = {
    getFile,
    uploadFile,
    moveFile,
    deleteFile
}