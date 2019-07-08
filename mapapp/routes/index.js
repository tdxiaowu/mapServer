var express = require('express');//加载express构造函数
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');

//用户信息文件路径
let userInfoFilePath = '../public/data/user_data.json';

//token的密钥
let tokenSecretKey = 'lora server';

//创建用户信息对象,用于信息存储
function userInfo(name,email,pwd,time){
    this.username = name;//用户名
    this.email = email;//邮箱
    this.password = pwd;//密码
    this.time = time;//注册时间
};
//创建一个用户对象
let userobj = new userInfo();


//访问map主页面
router.get('/',function (req, res, next) {
    // console.log('get map:' + req.url);
    // console.log('query.username:' + req.query.username);
    // console.log('query.password:' + req.query.password);
    // let username = req.query.username;//获取get中的参数
    // let password = req.query.password;//获取get中的参数
    // let userFile = '../public/data/user_data.json';//定义用户信息的存储路径
    // fs.readFile(userFile, 'utf-8', function (err, data) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     let userData = JSON.parse(data);
    //     //在用户信息数据库中，查找是否有登陆账户
    //     for (let i = 0; i < userData.user.length; i++) {
    //         //用户名和密码都正确
    //         if ((username === userData.user[i].username) && (password === userData.user[i].password)) {
                res.render('map');

    //             return true;
    //         }
    //     }
    //     res.render('login');
    // })
})
/* 访问注册主页. */
router.get('/register.pug', function(req, res, next) {
  res.render('index');
});

// 访问登录页面
router.get('/login.pug',function (req, res, next) {
    res.render('login');
});

//注册信息检查
//信息格式检查
function checkFormat(name,email){
    //长度检查
    if(name.length < 4 || name.length > 10){
        return false;
    };

    //特殊字符检查
    name  = name.toLowerCase();
    for(let i = 0; i < name.length; i++){
        let char = name.charAt(i);
        if((!(char >= 0 && char <= 9)) && (!(char >= 'a' && char <= 'z'))){
            return false;
        }
    }
    //邮箱格式检查
    let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!reg.test(email)){
        return false;
    }
    return true;
};
//信息重复性检查
function checkRepeat(name,email){
    console.log('name:'+name);
    //同步读取数据
        let data = fs.readFileSync(userInfoFilePath);
        let userData = data.toString();
        userData = JSON.parse(userData);
    //遍历所有对象
        for(let i = 0; i < userData.user.length; i++){
            //如果用户名或邮箱相同，返回错误
            console.log('name:'+name+'-----username:'+userData.user[i].username);
            console.log('name:'+email+'-----username:'+userData.user[i].email);
            if((name === userData.user[i].username) || (email === userData.user[i].email)){
                return false;
            }
        }
        return true;
};

/*注册信息服务接口
提交数据类型：json
提交数据格式：username_r:name,
              email_r:email,
              psw1_r:password
* */
router.post('/register',function (req, res, next) {

    console.log(req.body);//显示请求的参数对象
    let name  = req.body.username_r;//提取用户名
    let eml = req.body.email_r;//提取邮箱
    let pwd  = req.body.psw1_r;//提取密码
    res.set('Content-Type', 'application/json');
    //检验用户名和邮箱格式是否正确
    if (!checkFormat(name,eml)){
        //检验不通过
        res.json({response:1320});//给前端发送响应
        console.log('Register information format error!')
    }else if (!checkRepeat(name,eml)){
        res.json({response:1322});//给前端发送响应
        console.log('Register information is repeat!')
    }else{//注册信息合格
        // res.json({response:1321});//给前端发送响应
        console.log('Register information is success!')
        //格式正确
        //更新user对象信息
        userobj.username = name;
        userobj.email = eml;
        userobj.password = pwd;
        userobj.time = Date.now();

        // console.log(JSON.stringify(userobj));//打印组织好的用户信息

        //将注册数据写入user_data.json中
        fs.readFile(userInfoFilePath,function (err,data) {
            //读取失败
            if (err){
                return console.error(err);
            };
            //读取数据处理
            let userData = data.toString();//将读取的二进制数据转换成字符串
            userData = JSON.parse(userData);//将字符串转换成json对象
            userData.user.push(userobj);//将userInfo对象加入数组中
            userData.total = userData.user.length;//更新记录数目信息

            //将更新后的userData对象写入user_data.json中
            let str = JSON.stringify(userData);//将JSON对象转换成字符串
            fs.writeFile(userInfoFilePath,str,function (err) {
                //写入失败
                if (err){
                    return console.error(err);
                }
                res.json({response:1321});//给前端发送注册成功响应
                //写入成功
                console.log('write one userdata success：'+ JSON.stringify(userobj));
            })
        });
    }
})

// 登录按钮post服务
/*登录接口
URL：/users/
请求类型：post;
请求数据P{username:name;psw1_r:password
返回数据：josn格式
{
    response:151.
    reaponse:15
}*/
router.post('/login',function (req, res, next) {
    //在user_data.json中比对登陆信息
    console.log('login:req.body---'+JSON.stringify(req.body));//显示请求的参数对象
    console.log('login:content-type----'+req.get('Content-Type'));
    //提取注册信息
    let username = req.body.username_r;
    let password = req.body.psw1_r;
    //读取用户信息数据库，登陆信息比对
    fs.readFile(userInfoFilePath,'utf-8',function (err,data) {
        if (err){
            return console.error(err);
        }
        let userData = JSON.parse(data);
        //在用户信息数据库中，查找是否有登陆账户
        for(let i = 0;i < userData.user.length; i++ ){
            //用户名和密码都正确
            if ((username === userData.user[i].username) && (password === userData.user[i].password)){
                // 产生token
                let payload = {name:username};//以username作为token的数据区
                //签发token,时限1h
                let token = jwt.sign(payload,tokenSecretKey,{expiresIn:'1h'});
                console.log(token);//显示token
                //响应客户端
                res.json({response:151,token:token});//登陆成功
                return
            }
        }
        //登陆账户信息错误
        res.json({response:150});//用户名或密码错误

    });
})

//这里是把中间件导出，供app.js使用
module.exports = router;
