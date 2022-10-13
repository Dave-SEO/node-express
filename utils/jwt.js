const {promisify} = require('util')
const jwt = require('jsonwebtoken');
const { uuid } = require('../config/config.default')
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)
module.exports.createJwtToken = async (userinfo) => {
  console.log('userinfo', userinfo)
    const token = await sign({userinfo}, uuid, { expiresIn: 60 * 60 });
    return token
}

module.exports.verifyToken = (required = true) => (
  async (req, res, next) => {
    const bearerToken = req.headers.authorization
    if(bearerToken){
      const token = bearerToken.split('Bearer ')[1]
      try {
        const { userinfo } = await verify(token, uuid)
        req.user = userinfo
        next()
      } catch (error) {
        res.status('402').json({error: '无效token'})
      }
    }else if(required) {
      return res.status(402).json({error: "token不存在"})
    } else {
      next()
    }
  }
)
