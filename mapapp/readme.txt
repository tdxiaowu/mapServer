2019.5.29
1访问map页面需要登录信息username和password，无登录信息，页面跳转至登录页面；
2 map页面中的访问接口无身份认证，可以直接查看每个节点的数据；
3 访问首页是map，但map需要登录才能访问；
2019.5.31
1 设置访问首页map可以直接访问；
2 登录服务器端验证信息正确后产生token，并将token以响应方式返回给客户端；
3 在客户端map页面中，访问节点信息需要访问权限，经信息确认后获得token才能进行数据的访问，token时间是1小时，超过时间后需要
重新获取；
更改：map.js中function showInfo(e)对ajax访问头部添加了token
index.js中router.post('/login',function (req, res, next) 增加token的下发；
user.js中router.get('/getData',function (req, res, next) 增加token的认证；
