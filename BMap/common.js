/**
 * Created by Administrator on 2017/5/3.
 */
/**
 * 获取id DOM节点
 * */
function $$(id) {
    return document.getElementById(id)
}
/**
 * 设置起点终点名称
 * */
function setStart(name) {
    console.log(name);
    var obj = $$('startP');
    for (var i = 0; i < obj.options.length; i++) {
        var optionName = obj.options[i].text;
        if (optionName == name) {
            obj.options[i].selected = true
        }
    }
}
function setEnd(name) {
    console.log(name);
    var obj = $$('endP');
    for (var i = 0; i < obj.options.length; i++) {
        var optionName = obj.options[i].text;
        if (optionName == name) {
            obj.options[i].selected = true
        }
    }
}

/**
 * 获取线
 * */
function getRunPoints(callback) {
    $.ajax({
        url: 'runPoints',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        console.log("data",data);
        for(var i=0;i<data.length;i++){
            callback(data[i].points);
        }
    });
}
/**
 * 获取天气数据
 * */
function searchPointByName(area,callback) {
    var weatherData={};
    $.ajax({
        url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + area,
        type: 'POST',
        dataType: 'jsonp',
    }).done(function (data) {
        if (data.status == '1002') {
            alert('没有找到该城市,请重新选择');
            return false
        } else {
            weatherData = {
                status : true,
                forecast : data.data.forecast,
                ganmao : data.data.ganmao,
                wendu : data.data.wendu,
                yesterday :  data.data.yesterday,
                city : data.data.city
            };
            callback(weatherData);
        }
    });
}
/**
 * 显示detail
 * */
function showDetail(id) {
    var selectDetail={};
    for(var k=0;k<points.length;k++){
        if (points[k].id==id){
            selectDetail=points[k].detail;
            break
        }
    }
    console.log(selectDetail);
    $$('sider').innerHTML="";
    var tableContent="<table class='table'>";
    for(var j in selectDetail){
        tableContent+="<tr><td>"+j+"</td><td>"+selectDetail[j]+"</td></tr>"
    }
    tableContent+="</table>";

    $$('sider').innerHTML=tableContent;
}