const express = require('express')
const fs = require('fs')
const uuid = require('node-uuid')
const path = require('path')
const qiniu = require('qiniu')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.join(__dirname,'../db/ydf-server.sqlite3'))
// 
router.get('/games',function(req, res) {
    db.all("select * from `game`",[],(err,rows)=>{
        if(err == null){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post("/games",(req,res)=>{
    let json_body = req.body;
    let insert_sql = "INSERT INTO `game` (`id`,`name`,`value`,`rating`,`comment`,`platform`,`image_url`) VALUES ( ?, ?, ?, ?, ?, ?, ? );"
    db.run(insert_sql,[json_body.id,json_body.name,json_body.value,json_body.rating,son_body.comment,json_body.platform],(err,rows)=>{
        if(err == null){
            res.send("执行成功");
        }else{
            res.send(err)
        }
    })
})



router.get('/movies',function(req, res) {

    db.all("select * from `movies`",[],(err,rows)=>{
        if(err == null){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.get('/uploadToken',function(req, res) {
    var accessKey = 'VjWOIa97R7TXTD1_LZokXyFw5wlz4yxaNVQDsJo6';
    var secretKey = 'SPcnx-YOnVr6g1KwuXWsGXuBCCikkd1MR_u81cd5';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: 'ydf-picture',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    res.send(uploadToken)
})

router.post("/movies",(req,res)=>{
    let uniq_id = uuid.v1()
    let json_body = req.body.items;
    console.log(uniq_id)
    let insert_sql = "INSERT INTO `movies` (`id`,`name`,`isRecommend`,`category`,`rating`,`comment`,`release_time`,`image_url`,`type`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );"
    db.run(insert_sql,[uniq_id,json_body.name,json_body.is_Recommend,json_body.category,json_body.rating,json_body.comment,json_body.release_time,json_body.image_url,json_body.type],(err,rows)=>{
        if(err == null){
            res.send("执行成功");
        }else{
            res.send(err)
        }
    })
})

router.post("/upload", (req, res) => {
    //检测是否有文件
    if (!req.files) {
      res.send({
        code: 400,
        msg: "上传文件不能为空",
      });
      return;
    }
  
    //保存文件
    let files = req.files;
    let ret_files = [];
    for (let file of files) {
      //获取名字后缀
      let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
      //使用时间戳作为文件名字
      let file_name = new Date().getTime() + "." + file_ext;
      // 移动文件并且修改文件名字
      fs.renameSync(
        process.cwd() + "/public/temp/" + file.filename,
        process.cwd() + "/public/" + file_name
      );
      ret_files.push("/public/" + file_name);
    }
  
    res.send({
      code: 200,
      msg: "ok",
      data: ret_files,
    });
  
  });

module.exports = router