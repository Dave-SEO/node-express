const express = require('express')
const router = express.Router()
const controller = require('../controller/videoController')
const videoValidator = require('../middleware/validator/videoValidator')
const vodController = require('../controller/vodController')
const videoController = require('../controller/videoController')
const {verifyToken} = require('../utils/jwt')
router
.get('/video_detail/:video_id',verifyToken(false), controller.videoDetail)
.get('/getvod',verifyToken(), vodController.vod)
.post('/createVideo', verifyToken(), videoValidator.videoValida, videoController.createVideo)
.get('/videolist',videoController.videolist)
.post('/video_comment/:video_id', verifyToken(), videoController.comment)
.delete('/comment/:video_id/:comment_id', verifyToken(), videoController.commentDelete)
.get('/commentlist/:video_id', videoController.commentlist)
.post('/videolike/:video_id', verifyToken(), videoController.videoLike)
.post('/collect/:video_id', verifyToken(), videoController.collect)
.post('/videohots/:num', videoController.getVideoHots)
module.exports = router