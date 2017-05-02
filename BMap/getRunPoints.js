/**
 * Created by Administrator on 2016/12/29.
 */
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