
exports.vod = async (req, res) => {
    var querystring = require("querystring");
    var crypto = require('crypto');
    // 确定 app 的云 API 密钥
    var secret_id = "AKIDd9SXP4UVJuHRP9h06yd3SffQzMahgdVF";
    var secret_key = "d6RhKF4mLl2BATdgaN2Y3PbfeVHwTr5A";
    // 确定签名的当前时间和失效时间
    var current = parseInt((new Date()).getTime() / 1000)
    var expired = current + 86400;  // 签名有效期：1天
    // 向参数列表填入参数
    var arg_list = {
    secretId : secret_id,
    currentTimeStamp : current,
    expireTime : expired,
    random : Math.round(Math.random() * Math.pow(2, 32))
    }
    // 计算签名
    const orignal = querystring.stringify(arg_list);
    const orignal_buffer = Buffer.from(orignal, 'utf-8')
    const hmac = crypto.createHmac("sha1", secret_key);
    const hmac_buffer = hmac.update(orignal_buffer).digest();
    const signature = Buffer.concat([hmac_buffer, orignal_buffer]).toString("base64");
    res.status(200).json({sign: signature})
}

