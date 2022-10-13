const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const videolikeSchema = new mongoose.Schema({
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
    like: {
        type: Number,
        enum: [1, -1],
        required: true
    },
    ...baseModel
})

module.exports = videolikeSchema