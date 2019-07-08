// 调用高度地图API创建地图，地图名称：LoRaMap
let LoRaMap = new AMap.Map('container',{
    resizeEnable: true,//是否监控地图容器尺寸变化
    rotateEnable:true,//地图是否可旋转，3D视图默认为true
    pitchEnable:true,
    zoom: 17,//初始化地图层级
    pitch:30,//俯仰角度
    rotation:0,
    viewMode:'3D',//开启3D视图,默认为关闭
    buildingAnimation:true,//楼块出现是否带动画

    expandZoomRange:true,//是否支持可以扩展最大缩放级别,和zooms属性配合使用
    zooms:[3,20],//地图显示的缩放级别范围
    center:[117.170419,39.109169]//中心点
});


// 添加地图控件
// 添加UI基础控件
//设置DomLibrary 是jQuery
AMapUI.setDomLibrary($);
//加载BasicControl(模块名：ui/control/BasicControl)
AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
    //缩放控件，显示Zoom值
    LoRaMap.addControl(new BasicControl.Zoom({
        position: 'lb',//控件位置 left bottom,左下角
        showZoomNum: true,
    }));

    //图层切换控件
    LoRaMap.addControl(new BasicControl.LayerSwitcher({
        position: 'rt',//right top,右上角
    }));
});
// 添加3D控制控件
LoRaMap.addControl(new AMap.ControlBar({
    showZoomBar:false,//是否显示缩放按钮
    showControlButton:true,//是否显示倾斜、旋转按钮
    // 控制显示位置
    position:{
        right:'10px',
        top:'80px'
    }
}));
// // 添加比例尺控件
// AMap.plugin('AMap.Scale',function(){
//     LoRaMap.addControl(new AMap.Scale(),{
//     })
// });

/*暂时取消定位功能
        // 使用浏览器自动精确定位IP所在地点
        //火狐，谷歌及套壳浏览器在国外，失败率较高
        AMap.plugin('AMap.Geolocation', function() {
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            //添加定位控件
            LoRaMap.addControl(geolocation);
            //定位当前位置
            geolocation.getCurrentPosition();
            // 设置地图定位监听事件
            AMap.event.addListener(geolocation, 'complete', onComplete);
            AMap.event.addListener(geolocation, 'error', onError);

            //定位成功则解析定位结果data
            function onComplete(data) {
                //获取定位结果对象的经纬度并在显示框中显示出来
                document.querySelector(".input-item-text").textContent ='定位成功! 经度：'+ data.position.getLng() + '维度：' + data.position.getLat() + '。';
                regeoCode(data.position);//逆编码为具体地址信息
            }

            //解析定位错误信息
            function onError(data) {
                LoRaMap.setCenter([117.170419,39.109169]);//在定位失败后，设置地图中心位置
                log.success('定位失败:'+data.message);
            }
        });
*/
/*************************************************************************/
// 添加节点标记
/*标记点数据格式，用数组来存储，每一个元素是一个json格式数据
日期：date
序号：num
数据：data
以每一个节点存一个数组

* */
//创建一个点标记
let markerOne = new AMap.Marker({
    map: LoRaMap,//点标记的所属地图
    position: [117.170465, 39.108561],//点标记的位置
    animation:'AMAP_ANIMATION_DROP',//点标记不添加动画效果
    title:'1',//点标记标题，当鼠标放在点标记上进行显示
});
let markerTwo = new AMap.Marker({
    map: LoRaMap,
    position: [117.168499, 39.108248],
    animation:'AMAP_ANIMATION_DROP',
    title:'2',
});

let markerThree= new AMap.Marker({
    map: LoRaMap,
    position: [117.169169, 39.109714],
    animation:'AMAP_ANIMATION_DROP',
    title:'3',
});
let markerFour = new AMap.Marker({
    map: LoRaMap,
    position: [117.17119, 39.111111],
    animation:'AMAP_ANIMATION_DROP',
    title:'4',
});
LoRaMap.add([markerOne, markerTwo, markerThree, markerFour]);//给地图上添加四个标记点
//给点标记添加事件
markerOne.on('click',showInfo);
markerTwo.on('click',showInfo);
markerThree.on('click',showInfo);
markerFour.on('click',showInfo);
//显示数据函数
function showInfo(e){
    //获取位置信息
    let text = '您所在位置的经度：'+e.lnglat.getLng()+'，'+'维度：'+e.lnglat.getLat()+'。';//获取点击对象的经纬度
    document.querySelector(".input-item-text").innerText = text;//显示经纬度信息
    //获取测量信息
    let number = document.getElementById('num');
    let data = document.getElementById('data');
    let url = '/users/getData?id='+ e.target.getTitle();//获取访问地址:/users/1~4

    //在sessionStorage中获取token
    let token = sessionStorage.getItem('Token');
    //向服务端url地址发送GET请求,带有token
    $.ajax({
        type:"GET",//请求类型
        url:url,//url地址
        dataType:"json",//请求数据类型
        beforeSend:function(request){
            //在请求header中添加认证信息token
            request.setRequestHeader('Authorization',token);
        },
        //请求成功触发的函数
        success:function(result){//获得结果对象
             if(result.status === 0) {
                    //token 失败或过期
                    alert('token验证失败请求重新登录');
                    location.href = '/login.pug';
             }else{
                 console.log(result);//
                 number.value = result.number;//取序号
                 data.value = result.data;//取数据
             }

        },
        //页面无法访问触发函数
        statusCode:{404:function () {
                console.log("the get page not found！")
            }},
        //GET请求失败提醒
        error:function () {
            alert("get error!");
        }
    })
};
/***********************************************************/
// 显示经纬度和信息逆编码
let markerLngLatMeasure;//声明一个标记变量
// 逆地理编码
let geocoder;//声明一个逆编码的变量
/*对经纬度信息进行逆编码显示地址信息
* 参数：lnglat需要解码的经纬度信息*/
function regeoCode(lnglat) {
    if(!geocoder){
        //创建初始解码对象
        geocoder = new AMap.Geocoder({
            city: "010", //城市设为北京，默认：“全国”
            radius: 1000 //范围，默认：500
        });
    }
    geocoder.getAddress(lnglat, function(status, result) {
        if (status === 'complete'&&result.regeocode) {
            let address = result.regeocode.formattedAddress;//获的逆编码地址信息
            document.getElementById('address').value = address;//在input框中显示解码地址信息
        }else{alert(JSON.stringify(result))}
    });
}


//
// 经纬度测试鼠标click触发事件
function showInfoClick(e){
    let text = '您所在位置的经度：'+e.lnglat.getLng()+'，'+'维度：'+e.lnglat.getLat()+'。';//获取点击对象的经纬度
    document.querySelector(".input-item-text").innerText = text;//显示经纬度信息
    if (!markerLngLatMeasure)//如果没有标记，则创建一个新的标记并添加
    {
        markerLngLatMeasure = new AMap.Marker({
            position: e.lnglat
        });
        LoRaMap.add(markerLngLatMeasure);//增加一个标记点
    }
    else//更新点标记的位置
    {
        markerLngLatMeasure.setPosition(e.lnglat);//设置标记位置
        markerLngLatMeasure.show();//显示标记
    }
    //经纬度逆编码
    regeoCode(e.lnglat);

};


//增加鼠标控制插件，用于距离测量
let mouseTool = new AMap.MouseTool(LoRaMap);//创建鼠标对象

function draw(type){
    switch(type){
        case 'rule':{
            LoRaMap.off('click',showInfoClick);//关闭鼠标的点击事件
            mouseTool.rule({
                startMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
                    })
                },
                endMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
                    }),
                    offset: new AMap.Pixel(-9, -31)
                },
                midMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
                    }),
                    offset: new AMap.Pixel(-9, -31)
                },
                lineOptions : {//可缺省
                    strokeStyle: "solid",
                    strokeColor: "#FF33FF",
                    strokeOpacity: 1,
                    strokeWeight: 2
                }
                //同 RangingTool 的 自定义 设置，缺省为默认样式
            });
            break;
        }
        case 'lnglatMeasure':{
            mouseTool.close(true);//关闭鼠标
            LoRaMap.on('click', showInfoClick);//打开鼠标click事件获取鼠标点击处的经纬度坐标
        }
    }
}

let radios = document.getElementsByName('func');//取出选择按钮对象
//对所有选择点进行检查是否状态改变，并执行相应的事件
for(let i=0;i<radios.length;i+=1){
    radios[i].onchange = function(e){
        draw(e.target.value);
        if(markerLngLatMeasure)//如果有标记关闭
        {
            markerLngLatMeasure.hide();
        }
    }
}
draw('lnglatMeasure');//启动第一个选定的功能

//点击关闭按钮，触发的事件
document.getElementById('close').onclick = function(){
    mouseTool.close(true);//关闭，并清除覆盖物
    LoRaMap.off('click',showInfoClick);//关闭鼠标的点击事件
    // LoRaMap.remove(marker);//清除所有标记
    if(markerLngLatMeasure)//如果标记存在
    {
        markerLngLatMeasure.hide();//标记隐藏
    }
    document.querySelector(".input-item-text").innerText = '请用鼠标在地图上点击获取经纬度信息';
    document.getElementById('address').value = '';
    for(let i=0;i<radios.length;i+=1){
        radios[i].checked = false;//把所有的选择清空
    }
}