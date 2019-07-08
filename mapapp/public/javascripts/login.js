//获取元素的引用
let userName = document.getElementById('username');
let email = document.getElementById('eml');
let passwordFirst = document.getElementById('pwd');
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

// 依次检查每一项,否则停留在原处
function check() {
    if(checkName() && checkPassword()){
        return true;
    }else {
        return false;
    }
}

// 执行输入检查代码
// onblur表示在移开input框时，进行名字检查
userName.onblur = check;
// 在移开input框时，进行密码检查
passwordFirst.onblur = check;



// 注册信息提交代码
function loginButton() {
    //在输入全部合格后进行提交处理
    if (check()){
        let username_r = userName.value;
        let password_r = passwordFirst.value;

        let psw1_r = $.md5(password_r);
        // 将注册数据构造成json对象
        let userData = {
            "username_r":username_r,
            "psw1_r":psw1_r
        };
        // 将json对象转换成json字符串
        const jsonStr = JSON.stringify(userData);
        //控制台显示输入数据
        console.log(jsonStr);
        console.log(userData.username_r);
        console.log(userData.psw1_r);

        $.ajax({
            type:"POST",
            url:"/login",
            headers:{
                "CONTENT_TYPE": "application/json",
            },
            data:jsonStr,
            dataType:"json",//预期服务器返回的数据类型
            contentType:"application/json",
            success:function (result) {
                console.log(result);
                if(result.response === 151 ){
                    //获取token
                    let token = result.token;
                    console.log('login.js ---token:'+ token);
                    //保存token到sessionStorage中，名称为Token
                    sessionStorage.setItem('Token',token);
                    //页面跳转到主页
                    // window.location.href = '/?username='+ username_r+'&password='+psw1_r;
                    location.href = '/';
                    alert("登录成功");
                }
                if(result.response === 150 ){
                    alert('账号或密码错误');
                    //页面跳转到登录页面
                    location.href="login.pug";
                }
            },
            statusCode: {404: function() {
                    alert('page not found');}},
            error:function(result) {
                alert(result.response);
            },

        });

    }
}
//登录按钮触发的事件
btn.onclick = loginButton;