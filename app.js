const express = require('express')
const path = require('path')
const multer = require('multer')
const app = express()
const port = 1998

const upload = multer({
    dest:'./public/temp'
})
app.use(upload.any())

// 解析json数据
app.use(express.json())
// 静态文件
// app.use(express.static(''))

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'content-type')
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
    if(req.method == 'OPTIONS') res.sendStatus(200)
    else next()
})
const options = [
    {id:1,imgUrl:'aa',rating:1},
    {id:2,imgUrl:'dd',rating:2},
    {id:3,imgUrl:'ss',rating:4},
]
app.use('/v1', require('./router/router'))

app.get('/movie',(req, res) => {
    console.log(req.query.type)
    // req.query.type
    if(req.query.type === '1') {
        res.send(options)
    }
    res.send('Hello world')
})

app.post('/movie',(req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`${port} is occupied`)
})