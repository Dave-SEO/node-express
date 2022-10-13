const Redis = require('ioredis')
const redis = new Redis(6379, '192.168.1.2', {password: 'root'})

redis.on('error', (err) => {
    if(err){
        console.log('redis连接错误')
        console.log(err)
    }
})
redis.on('ready', () => console.log('redis 连接成功'))

exports.redis = redis