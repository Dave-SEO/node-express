const mongoose = require('mongoose')
const { Video, User, Comment, Videolike, Collect } = require('../model/index')
const {redisVideoHots, getRedisVideoHots} = require('../model/redis/redisVideoHots')
// 观看 +1 点赞 +2 评论 +2 收藏 +3

/**
 * 创建视频
 */
exports.createVideo = async (req, res) => {
    let body = req.body
    const userid = req.user._id
    body.user = userid
    const dbvideo = new Video(body)
    const dbback = await dbvideo.save()
    res.status(201).json(dbback)
}
exports.videoDetail = async (req, res) => {
    const {video_id} = req.params
    const dbBack = await Video.findById(video_id)
        .populate('user', 'username cover image')
    redisVideoHots(video, 1)
    res.status(200).json(dbBack)
}

exports.videolist = async (req, res) => {
    const {pageNum = 1, pageSize = 10 } = req.body
    const dbdata = await Video.find()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({createAt: -1})
        .populate('user')
    
        const videoCount = await Video.countDocuments()
    res.status(200).json({videolist: dbdata, videoCount})
}

exports.comment = async (req, res) => {
    const user = req.user._id
    const video = req.params.video_id
    const content = req.body.content
    const videodb = await Video.findById(video)
    if(videodb){
        try {
            const dbback = await new Comment({
                user,
                video,
                content
            }).save()
            videodb.videoComment ++
            await videodb.save()
            redisVideoHots(video, 3)
            res.status(200).json(dbback)
        } catch (error) {
            res.status(401).json(error)
        }
    } else {
        res.status(401).json({error: '视频不存在'})
    }   
}

exports.commentlist = async (req, res) => {
    const {pageNum = 1, pageSize = 10} = req.body
    const video_id = req.params.video_id
    const comment = await Comment.find({video: video_id})
    .populate('user', 'username image')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    const count = await Comment.countDocuments({video: video_id})
    console.log('count', count)
    res.status(200).json(comment)
}

exports.commentDelete = async (req, res) => {
    const video_id = req.params.video_id
    const comment_id = req.params.comment_id
    // 视频是否存在
    // 评论是否存在
    // 是否是自己写的评论
    const videodb = await Video.findById(video_id)
    if(!videodb){
        return res.status(401).json({'error': '视频不存在'})
    }

    const commentdb = await Comment.findById(comment_id)
    if(!commentdb){
        return res.status(401).json({'error': '评论不存在'})
    }
    if(!commentdb.user.equals(req.user._id)){
        return res.status(401).json({'error': '评论不可删除'})
    }
    await commentdb.remove()
    videodb.videoCount -- 
    await videodb.save()
    res.status(200).json({'message': '删除成功'})
}

exports.videoLike = async (req, res) => {
    const user = req.user._id
    const video_id = req.params.video_id
    let islike = false
    // 1. 查找视频是否存在
   const video = await Video.findById(video_id)
   if(!video){
    return res.status(401).json({'error': '视频不存在'})
   }
   const videodbBack = await Videolike.findOne({
        user,
        video: video_id
   })
   console.log('videodbBack.like', videodbBack)
   if (videodbBack && videodbBack.like === 1) {
        videodbBack.like = -1
        await videodbBack.save()
        islike = false
   } else if (videodbBack && videodbBack.like === -1) {
        videodbBack.like = 1
        await videodbBack.save()
        redisVideoHots(video_id, 2)
        islike = true
   } else {
        await new Videolike({
            user,
            video: video_id,
            like: 1
        }).save()
        islike = true
        redisVideoHots(video_id, 2)
   }
   video.likeCount = await Videolike.countDocuments({video: video_id, like: 1})
   video.dislikeCount = await Videolike.countDocuments({video: video_id, like: -1})
   const aa= await video.save()
   console.log('aa', aa)
   res.status(200).json({...video.toJSON(), islike})
}

/**
 * @descript 视频收藏
 */
exports.collect = async (req, res) => {
    const video_id = req.params.video_id
    const user_id = req.user._id
    // 1. 判断视频是否存在
   const dbvideo = await Video.findById(video_id)
   if(!dbvideo){
    return res.status(401).json({'error': '视频不存在'})
   }
   // 2. 视频是否已收藏
  const iscollect = await Collect.findOne({
    video: video_id,
    user: user_id
   })
   if(iscollect){
    return res.status(401).json({'error': '视频已收藏'})
   }
   // 3. 未收藏
   const collect = await new Collect({
    video: video_id,
    user: user_id
   }).save()
   redisVideoHots(video_id, 3)
   res.status(201).json(collect)
}

/**
 * @descript 获取推荐的热门视频
 */
exports.getVideoHots = async (req, res) => {
    const num = req.params.num
    const hotlist = await getRedisVideoHots(num)
    res.status(200).json(hotlist)
}