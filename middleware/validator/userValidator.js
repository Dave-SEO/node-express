const { body } = require('express-validator')
const validator = require('./errorBack')
const {User} = require('../../model/index')
module.exports.register = validator([
    body('username')
        .notEmpty().withMessage('用户名不能为空').bail()
        .isLength({min: 3, max: 10}).withMessage('用户名长度不能小于3个字符并且不能大于10个字符').bail(),
    body('age')
        .notEmpty().withMessage('年龄不能为空').bail(),
    body('email')
        .notEmpty().withMessage('邮箱不能为空').bail()
        .isEmail().withMessage('邮箱格式有误').bail()
        .custom(async val => {
          const emailValidate = await User.findOne({email: val})
          if(emailValidate){
            return Promise.reject('邮箱已注册')
          }
        }).bail(),
    body('phone')
        .notEmpty().withMessage('手机号不能为空').bail()
        .isMobilePhone().withMessage('手机号格式有误').bail()
        .custom(async val => {
          const phoneValidate = await User.findOne({phone: val})
          if(phoneValidate){
            return Promise.reject('手机号已注册')
          }
        })
])


module.exports.update = validator([
    body('username')
        .isLength({min: 3, max: 10}).withMessage('用户名长度不能小于3个字符并且不能大于10个字符').bail()
        .custom(async val => {
          const userValida = await User.findOne({username: val})
          // 不可以改为已经存在的用户名
          if(userValida){
            return Promise.reject({error: '用户名已注册'})
          }
        }),
    body('email')
        .isEmail().withMessage('邮箱格式有误').bail()
        .custom(async val => {
            const emailVallida = await User.findOne({email: val})
            if(emailVallida){
                return Promise.reject({error: '邮箱已注册'})
            }
        }),
    body('phone')
        .custom(async val => {
            const phoneVallida = await User.findOne({phone: val})
            if(phoneVallida){
                return Promise.reject({error: '手机号已注册'})
            }
        })
])