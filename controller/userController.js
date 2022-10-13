const { User, Subscribe } = require('../model/index')
const {createJwtToken} = require('../utils/jwt')
const fs = require('fs')
const {promisify} = require('util')
const rename = promisify(fs.rename)
const lodash = require('lodash')
exports.register = async (req, res) => {
   const userdb = await new User(req.body)
   const dbBack = await userdb.save()
   const user = dbBack.toJSON()
   delete user.password
   res.status(201).send(user)
}

exports.login = async (req, res) => {
   const dbUser = await User.findOne(req.body)
   console.log('dbUser', dbUser)
   if(!dbUser){
    return res.send({'error': '用户名或密码错误'})
   }
   const user = dbUser.toJSON()
   const token = await createJwtToken(dbUser)
   user.token = token
   res.json(user)
}

exports.list = async (req, res) => {    
    res.send('/list')
}

exports.update = async (req, res) => {
    const userid = req.user._id
    // 更新id为xxx的数据   new:true 返回更新后的数据，默认返回更新前的数据
    const updatedb = await User.findByIdAndUpdate(userid, req.body, {new: true})
    res.send(updatedb)
}

exports.delete = async (req, res) => {

}

exports.uploadimg = async (req, res) => {
    const filename = req.file.filename
    const path = `public/${filename}`
    const originalname = req.file.originalname.split('.')
    const fix = originalname[originalname.length - 1]

    await rename(path, `${path}.${fix}`)
    res.status(201).json({url: `${filename}.${fix}`})
}


exports.subscribe = async (req, res) => {
    // 1. 自己不能关注自己 当前登陆的id 比较 传过来的id
    const userid = req.user._id
    const channel_id = req.params.channel_id
    if(userid === channel_id){
        return res.status(401).json({error: '不能关注自己'})
    }
    // 2. 判断 用户是否已经关注过此用户 channel_id 
    const subscribe = await Subscribe.findOne({
        user: userid,
        channel: channel_id
    })
    if(subscribe){
        return res.status(401).json({error: '已经关注过了'})
    }
    // 3. 未关注 存入数据库，并使被关注的粉丝加1
    const insertdb = new Subscribe({
        user: userid,
        channel: channel_id
    })
    try {
        const insertResult = await insertdb.save()
        const user = await User.findById(channel_id)
        console.log(user)
        user.subscribecount ++
        const db = await user.save()
        res.status(200).json({message: '关注成功'})
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.unsubscribe = async (req, res) => {
    const userid = req.user._id
    const channel_id = req.params.channel_id
    if(userid === channel_id){
        return res.status(401).json({error: '不能取消关注自己'})
    }

    const subscribe = await Subscribe.findOne({
        user: userid,
        channel: channel_id
    })
    if(subscribe){
       await subscribe.remove()
       const user = await User.findById(channel_id)
       user.subscribecount --
       const db = await user.save()
       res.status(200).json({'message': "取消成功"})
    }else {
        return res.status(401).json({error: '还没关注过'})
    }
}

// A 查询 B 的信息
/**
 * 获取频道信息
 */
exports.getUser = async (req, res) => {
    let isSubscribe = false
    if(req.user){
      const record = await Subscribe.findOne({
            user: req.user._id,
            channel: req.params.user_id
        })

        isSubscribe = record ? true : false
    }
    const user = await User.findById(req.params.user_id)
    let formatObj = lodash.pick(user, ['username', 'image', 'cover', 'subscribecount', 'age'])
    res.status(200).json({
        ...formatObj,
        isSubscribe
    })
}

// 搜索某用户 关注过谁
exports.getSubscribe = async (req, res) => {
    let subscribeList = await Subscribe.find({
        user: req.params.user_id
    }).populate('channel')
    console.log('subscribeList', subscribeList)
    subscribeList = subscribeList.map(item => {
        return lodash.pick(item.channel, ['username', 'cover', 'image', 'subscribecount', 'channeldes'])
    })

    res.status(200).json(subscribeList)
}

// 查看谁关注过我
exports.getChannel = async (req, res) => {
  let channelList = await Subscribe.find({
        channel: req.user._id
    }).populate('user')
    channelList = channelList.map(item => {
        return lodash.pick(item.user, ['username', 'cover', 'image', 'subscribecount', 'channeldes'] )
    })
    res.status(200).json(channelList)
}