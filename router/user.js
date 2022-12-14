const express = require('express')
const router = express.Router()
const controller = require('../controller/userController') 
const userValidator = require('../middleware/validator/userValidator')
const {verifyToken} = require('../utils/jwt')
const multer  = require('multer')
const upload = multer({ dest: 'public/' })
router
.post('/login', controller.login)
.get('/list', verifyToken(), controller.list)
.put('/update', userValidator.update, verifyToken(), controller.update)
.delete('/', controller.delete)
.post('/register', userValidator.register , controller.register)
.post('/uploadimg', verifyToken(), upload.single('uploadimg'), controller.uploadimg)
.post('/subscribe/:channel_id', verifyToken(), controller.subscribe)
.post('/unsubscribe/:channel_id', verifyToken(), controller.unsubscribe)
.get('/getuser/:user_id', verifyToken(false), controller.getUser)
.get('/getsubscribe/:user_id', controller.getSubscribe)
.get('/getchannel', verifyToken(), controller.getChannel)
module.exports = router