//引入功能模块
var createError = require('http-errors');
var express = require('express');//导入express模块
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser = require("body-parser");//获取post请求参数
var cors = require("cors");//解决跨域问题 npm istall cors装一下
// 引入ejs
// var ejs = require('ejs');
//引入路由路径
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//视图引擎设定
app.set('views', path.join(__dirname, 'views'));//__dirname是当前js文件运行的目录
app.set('view engine', 'pug');
// 设置使用html模板,需要把view内的都变成html
// app.engine('html',ejs.__express);
// app.set('view engine','html')

//导入中间件
app.use(logger('dev'));
app.use(express.json());//express.json()内置中间件，处理application/json请求
app.use(express.urlencoded({ extended: false }));//express.urlencoded()内置中间件，处理application/x-www-form-urlencoded请求
app.use(cookieParser());//使用cookie解析器
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源目录
// app.use(bodyParser.json());//处理application/json
// app.use(bodyParser.urlencoded({extended:false}));//处理application/x-www-form-urlencoded
app.use(cors({
    origin:['http://127.0.0.1:8000'],//本地服务器的接口，保证了在浏览器能访问服务器的数据
    methods:["GET","POST"],
    allowHeaders:["Content-Type","Authorization"]
}));

//设置允许跨域请求
// // app.all('*', function(req, res, next) {
// //     res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
// //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
// //     res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
// //     res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
// //     res.header('Content-Type', 'application/json;charset=utf-8');
// //     next();
// // });


//设置路由
app.use('/', indexRouter);//路由是‘/’
app.use('/users', usersRouter);//路由是‘/users’

// catch 404 and forward to error handler
//捕获404并抛给错误处理器
//没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function(req, res, next) {
  console.log('Time:',Date.now());
  next(createError(404));
});

// error handler错误处理器
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    //渲染出错页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;//返回应用对象
