//获取元素的引用
let userName = document.getElementById('username');
let email = document.getElementById('eml');
let passwordFirst = document.getElementById('pwd1');
let passwordSecond = document.getElementById('pwd2');
let btn = document.querySelector('button');

// 在数据提交前对数据进行验证
//用户名校验
function checkName(){
    // 得到对象引用
    let ckNameInfo = document.getElementById("checkNameInfo");
    // 获取文本框输入的值
    let name = userName.value;

    //将文字区域写为空
    ckNameInfo.textContent= "";
    if (name === "") {
        ckNameInfo.textContent = "用户名不能为空！";
        // 将光标放入文本框
        userName.focus();
        return false;
    }
    if (name.length < 4 || name.length > 10) {
        ckNameInfo.textContent = "长度为4-10数字或字母！";
        userName.select();
        return false;
    }
    //可优化成正则表达式
    name = name.toLowerCase();
    for (let i = 0; i < name.length; i++) {
        let char = name.charAt(i);
        if ((!(char >= 0 && char <= 9)) && (!(char >= 'a' && char <= 'z'))) {
            ckNameInfo.textContent = "用户名包含非法字符:"+ char;
            userName.select();
            return false;
        }
    }
    return true;
}

//邮箱校验
function checkEmail(){
    let ckEmailInfo = document.getElementById('checkEmlInfo');
    ckEmailInfo.textContent = "";
    let emailInput = email.value;
    let sw = emailInput.indexOf("@", 0);
    let sw1 = emailInput.indexOf(".", 0);
    let tt = sw1 - sw;
    if (emailInput.length === 0) {
        ckEmailInfo.textContent = "邮箱不能为空";
        email.focus();
        return false;
    }

    if (emailInput.indexOf("@", 0) === -1) {
        ckEmailInfo.textContent = "必须包含@符号";
        email.select();
        return false;
    }

    if (emailInput.indexOf(".", 0) === -1) {
        ckEmailInfo.textContent = "必须包含.符号";
        email.select();
        return false;
    }

    if (tt === 1) {
        ckEmailInfo.textContent = "@和.不能一起";
        email.select();
        return false;
    }

    if (sw > sw1) {
        ckEmailInfo.textContent  = "@符号必须在.之前";
        email.select();
        return false;
    }
    let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!reg.test(emailInput)) {
        ckEmailInfo.textContent  = "不是一个有效的 e-mail 地址";
        email.select();
        return false;
    }
    return true;
}

// 密码校验
function checkPassword(){
    let ckPasswordInfo = document.getElementById("checkPwdOne");
    let passwordOne = passwordFirst.value;

    ckPasswordInfo.textContent = "";

    if (passwordOne === "") {
        ckPasswordInfo.textContent = "密码不能为空";
        passwordFirst.focus();
        return false;
    }

    if (passwordOne.length < 7 || passwordOne.length > 16) {
        ckPasswordInfo.textContent = "密码长度为7-16位";
        passwordFirst.select();
        return false;
    }
    return true;
}
// 第二次密码验证
function reCheckPassword(){
    let ckPasswordInfo = document.getElementById("checkPwdTwo");
    // 获取两个密码值
    let passwordOne = passwordFirst.value;
    let passwordTwo = passwordSecond.value;

    ckPasswordInfo.textContent = "";

    if (passwordTwo === "") {
        ckPasswordInfo.textContent = "密码不能为空";
        passwordSecond.focus();
        return false;
    }
    if (passwordOne !== passwordTwo) {
        ckPasswordInfo.textContent = "密码不一致";
        passwordSecond.select();
        return false;
    }
    return true;
}

// // 在移开input框时，进行名字检查
// userName.onblur = checkName;
// // 在移开input框时，进行邮箱检查
// email.onblur = checkEmail;
// // 在移开input框时，进行密码检查
// passwordFirst.onblur = checkPassword;
// passwordSecond.onblur = reCheckPassword;

// 依次检查每一项,否则停留在原处
function check() {
    if(checkName() && checkEmail() && checkPassword() && reCheckPassword()){
        return true;
    }else {
        return false;
    }
}

// 执行输入检查代码
// 在移开input框时，进行名字检查
userName.onblur = check;
// 在移开input框时，进行邮箱检查
email.onblur = check;
// 在移开input框时，进行密码检查
passwordFirst.onblur = check;
passwordSecond.onblur = check;



// 注册信息提交代码
function registerButton() {
    //在输入全部合格后进行提交处理
    if (check())
    {
        let username_r = userName.value;
        let email_r = email.value;
        let password_r = passwordSecond.value;

        let psw1_r = $.md5(password_r);
        // 将注册数据构造成json对象
        let userData = {
            "username_r":username_r,
            "email_r":email_r,
            "psw1_r":psw1_r
        };
        // 将json对象转换成json字符串
        const jsonStr = JSON.stringify(userData);
        console.log('username_r'+ userData.username_r);
        console.log('email_r'+ userData.email_r);
        console.log('psw1_r'+ userData.psw1_r);
        console.log(jsonStr);

        // alert('username:'+username_r+'\n'+'email:'+email_r+'\n'+'password:'+psw1_r);
        //提交注册数据
        // 获取http对象
        // let request = new  XMLHttpRequest();
        // request.open('POST','http://localhost:3000/rig',true);
        // request.setRequestHeader("Content-type","application/json");
        // request.send(jsonStr);
        // request.onreadystatechange = function () {
        //     if(request.readyState===4  && request.status === 200){
                    //console.log(request.responseText);
        //         let res = JSON.parse(request.responseText);
        //         if(res.response==="1321"){
        //             alert("注册成功"); }
        //         if(res.response==="1320"){
        //             alert("用户名或邮箱格式不正确"); }
        //         if(res.response==="1322"){
        //             alert("用户名或邮箱已被占用"); }
        //     }else{
        //         alert('error')
        //     }
        // }

        $.ajax({

            type:"POST",
            url:"/register",
            headers:{
                "CONTENT_TYPE": "application/json",
            },
            data:jsonStr,
            dataType:"json",//预期服务器返回的数据类型
            contentType:"application/json",
            complete:function(){
              console.log('request complete')
            },
            success:function (result) {
                console.log(result);
                if(result.response === 1321){
                    alert("注册成功");
                    window.location.href="/login.pug";
                    }
                if(result.response === 1320){
                    alert("用户名或邮箱格式不正确"); }
                if(result.response === 1322){
                    alert("用户名或邮箱已被占用"); }
            },

            statusCode: {404: function() {
                    alert('page not found');}},
            error:function(result) {
                alert('request error!');
            },

        });

    }
}

btn.onclick = registerButton;