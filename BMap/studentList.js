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