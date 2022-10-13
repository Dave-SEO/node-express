const mongoose = require('mongoose');

async function main(){
   await mongoose.connect('mongodb://localhost:27017/video');
}

main()
.then(res => {
    console.log('mongodb 已连接')
})
.catch(e => console.log(e))

module.exports = {
    User: mongoose.model('User', require('./userModel')),
    Video: mongoose.model('Video', require('./videoModel')),
    Subscribe: mongoose.model('Subscribe', require('./subscribeModel')),
    Comment: mongoose.model('Comment', require('./commentModel')),
    Videolike: mongoose.model('Videolike', require('./videolikeModel')),
    Collect: mongoose.model('Collection', require('./collectionModel'))
}


// const user = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//         required: true
//     }
// })
// // mongo 会自动把u改为小写，最后加一个s
// const userModel = mongoose.model('User', user)

// const u = new userModel({username: 'lisi', age: 12})
// u.save()
