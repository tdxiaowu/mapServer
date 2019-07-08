var fs = require('fs');

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

module.exports = checkFormat;