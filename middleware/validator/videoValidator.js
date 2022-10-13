const { body } = require('express-validator')
const validator = require('./errorBack')


module.exports.videoValida = validator([
    body('title')
    .notEmpty().withMessage('标题不能为空').bail()
    .isLength({min: 3, max: 10}).withMessage('用户名长度不能小于3个字符并且不能大于10个字符').bail(),
    body('vodvideoId')
    .notEmpty().withMessage('视频vod不能为空').bail()
])