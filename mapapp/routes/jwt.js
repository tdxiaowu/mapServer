let jwt = require('jsonwebtoken')

//payload数据
const payload = {
    name:'ccc',
    admin:true
}

//密钥
const secret = 'hello';

// 签发token
const token = jwt.sign(payload,secret,{expiresIn:'1h'});//token有效时间设置为1小时
console.log(token)

//验证token
jwt.verify(token,secret,function (err,decoder) {
    if(err){
        console.log(err.message);
        return
    }
    console.log(decoder)
    console.log(decoder.name)//按对象取值
})
