const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const videoCollectSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        required: true,
        // 关联users 集合
        ref: 'User'
    },
    video: {
        type: mongoose.ObjectId,
        required: true,
        // 关联 videos 集合
        ref: 'Video'
    },
    ...baseModel
})

module.exports = videoCollectSchema