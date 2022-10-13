const express = require('express')

const router = express.Router()

router
.use('/user', require('./user'))
.use('/video', require('./video'))

module.exports = router