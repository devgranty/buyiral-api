const express = require('express')
const router = express.Router()
const { authUser, authShop } = require('../middlewares/auth')

const {
    getFile,
    uploadFile,
    moveFile,
    deleteFile
} = require('../controllers/files.controller')

router.get('/file/:subdirectory/:filename', getFile)
router.post('/file/upload/:subdirectory', authUser, uploadFile)
router.patch('/file/move/:todirectory/:filename', authUser, moveFile)
router.delete('/file/delete/:subdirectory/:filename', authUser, deleteFile)

module.exports = router