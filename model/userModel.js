const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const md5 = require('../utils/md5')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: value => md5(value),
        select: false
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    cover: {
        type: String,
        default: null
    },
    channeldes: {
        type: String,
        default: null
    },
    subscribecount: {
        type: Number,
        default: 0
    },
    ...baseModel
})

module.exports = userSchema

