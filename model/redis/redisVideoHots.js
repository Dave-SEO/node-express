const {redis} = require('./index')
const redis_hots_name = 'hotsname'
/**
 * 
 * @param {*} videoid 视频id
 * @param {*} num 热度值
 */
exports.redisVideoHots = async (videoid, num) => {
    let data = await redis.zscore(redis_hots_name, videoid)
    if(data){
      var hots = await redis.zincrby(redis_hots_name, num, videoid)
    }else{
      var hots = await redis.zadd(redis_hots_name, num, videoid)
    }
    return hots
}

/**
 * 
 * @param {*} num 获取条数
 */
exports.getRedisVideoHots = async (num) => {
    const hots = await redis.zrevrange(redis_hots_name, 0, -1, 'withscores')
    // redis 键 值是在一起的，所以需要 * 2
    const video_hots = hots.slice(0, num * 2)
    let obj = {}
    for (let i = 0; i < video_hots.length; i ++){
        // [f,1,g,0,k,8] 偶数下标为键 奇数下标为值
        if(i % 2 === 0){
            obj[video_hots[i]] = video_hots[i + 1]
        }
    }
    return obj
}
