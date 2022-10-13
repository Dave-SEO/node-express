const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./router')
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.static('public'))
// 记录日志-开发环境
app.use(morgan('dev'))
app.use('/api/v1', router)
const PORT = process.env.PORT || 3000

// 统一处理服务端错误
app.use((err, req, res, next)=> {
  console.log(err)
  res.status(500).send('service Error')
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
