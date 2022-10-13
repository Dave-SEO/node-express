const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    video: {
       type: mongoose.ObjectId,
       required: true,
       ref: 'Video'
    },
    ...baseModel
})

module.exports = commentSchema

