var express = require('express');
var fs = require('fs');//引入文件模块
var jwt = require('jsonwebtoken');
var router = express.Router();

//token的密钥
let tokenSecretKey = 'lora server';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end('respond with a resource');
});

//节点上传数据到服务器
/* 数据格式：结点序号和数据
服务端就收到数据后，记录接收到的时间，将接收对象写入txt中保存
* */
//创建节点对象，节点具有的属性：序号，数据，日期（获得数据的日期）。
function nodeInfo(num, data, time){
    this.number = num;
    this.data = data;
    this.time = time;
};

//使用JSON文件存储数据，向文件中增加一个接收数据node对象
//json文件的增删改，亦可通过此法进行实现
function addDataToJSON(nodeObj){
    //最初文档路径
    let fileData = '../public/data/data.json';
    fs.readFile(fileData,function(err,data){
        if(err){
            return console.error(err);
        }

        let tempData = data.toString();//将读取的二进制数据转换为字符串
        tempData = JSON.parse(tempData);//将字符串转换为JSON对象

        tempData.data.push(nodeObj);//将params对象push到数组中
        tempData.total = tempData.data.length;//更新数据长度记录
        // console.log(tempData);//显示更新后的JSON内容

        var str = JSON.stringify(tempData);//因为nodejs的写入只能是字符串或二进制数据，故将JSON对象转换为字符串用于写入
        fs.writeFile(fileData,str,function(err){
            //写入失败
            if(err){
                return console.error(err);
            }else{
                //写入成功
                console.log('write data.json success：'+ JSON.stringify(nodeObj));
            }
        });//write
    });//read


    /*如需使用，要在data文件夹中创建各个节点的文档，并完成初始化。
    根据收到的节点序号，选择对应的文档路径
     */
    let filePath = '../public/data/node_' + nodeObj.number +'.json';

    //读出节点json文档数据，进行新对象的添加
    fs.readFile(filePath,function(err,data){
        if(err){
            return console.error(err);
        }
        //获得json对象
        let tempData = data.toString();//将读取的二进制数据转换为字符串
        tempData = JSON.parse(tempData);//将字符串转换为JSON对象
        //添加数据
        tempData.data.push(nodeObj);//将params对象push到数组中
        tempData.total = tempData.data.length;//更新数据长度记录
        // console.log(tempData);//显示更新后的JSON内容

        //将添加后的对象保存
        var str = JSON.stringify(tempData);//因为nodejs的写入只能是字符串或二进制数据，故将JSON对象转换为字符串用于写入
        fs.writeFile(filePath,str,function(err){
            //写入失败
            if(err){
                return console.error(err);
            }else{
                //写入成功
                console.log('write data.json success：'+ JSON.stringify(nodeObj));
            }
        });//write
    });//read
};//addDataToJSON


//post上传数据，上传数据格式是json格式，接收到的数据也是json格式
//head使用Content-Type：application/json
router.post('/dataUpload',function (req, res, next) {
    console.log('req.body:'+ JSON.stringify(req.body));
    let num = req.body.number;
    let data = req.body.data;
    //生成一个节点数据对象
    let node = new nodeInfo(num,data,new Date().getTime());
    //向data.json中储存数据
    addDataToJSON(node);

    //更新相应节点的json文件，将获取的信息写入json文件
    let file = '../public/data/'+num+'.json';//获取要更新文件的路径
    let str = JSON.stringify(node);//因为nodejs的写入只能是字符串或二进制数据，故将JSON对象转换为字符串用于写入
    //异步写文件操作
    fs.writeFile(file,str,function(err){
        //写入失败时，返回错误信息
        if(err){
            return console.error(err);
        }else{
            console.log('write ' + num +'.json success!');
            res.send('received post data');
        }
    });//write
});


// map.js中get节点数据接口
router.get('/getData',function (req, res, next) {
    // 验证token
    //提取请求Authorization中的token
    let token = req.get('Authorization');
    console.log('/getDate token:'+token);
    //解析token
    jwt.verify(token,tokenSecretKey,function (err,decoder) {
        if(err){//token没有通过验证
            res.json({status:0});
            return;
        }
        //token通过了验证
        console.log('get number node is :'+req.query.id);//显示请求的参数
        //根据请求的参数得到要访问文件的路径
        let file = '../public/data/'+req.query.id+'.json';
        //读取文件信息
        fs.readFile(file,'utf-8',function (err,data) {
            if (err) {
                return console.log('read failed.');
            }
            //给客户端响应数据
            let resData = JSON.parse(data);//将读取的字符串转换成json对象
            res.json(resData);//给节点返回数据
        })
    })
});

//把中间件导出，供app.js使用
module.exports = router;
