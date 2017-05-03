/**
 * Created by Administrator on 2017/5/3.
 */
;(function (window) {

    function createBMap() {
        this.map=new BMap.Map('allmap');
        this.points=[];
        this.startPoint;
        this.endPoint;
        this.ac;
        this.myCl;
        this.menu = new BMap.ContextMenu();
        this.myIcon = new BMap.Icon("car.png", new BMap.Size(20,20));
        this.pointArray=[];
        this.markerArray=[]
        this.init();

    }
    createBMap.prototype={
        init:function () {
            var that=this;
            var point = new BMap.Point(113.332504, 23.143106);
            this.map.centerAndZoom(point, 14);
            this.map.enableDragging();
            this.map.enableScrollWheelZoom();

            this.map.addControl(new BMap.NavigationControl());
            this.map.addControl(new BMap.ScaleControl());
            this.map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],offset: new BMap.Size(130, 10)}));
            var geoc = new BMap.Geocoder();
            this.map.addEventListener("click", function (e) {
                console.log(e.point.lng + "," + e.point.lat);
                var pt = e.point;
                geoc.getLocation(pt, function(rs){
                    var addComp = rs.addressComponents;
                    console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                });
            });
            this.ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {
                    "input" : "address",
                    "location" : this.map
                }
            );
            this.ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                $$("searchResultPanel").innerHTML = str;
            });
            var myValue;
            this.ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                $$("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                that.setPlace(myValue);
            });
            // 创建CityList对象，并放在citylist_container节点内
            this.myCl = new BMapLib.CityList({container : "citylist_container", map : this.map});

            // 给城市点击时，添加相关操作
            this.myCl.addEventListener("cityclick", function(e) {
                // 修改当前城市显示
                $$("curCity").innerHTML = e.name;
                // 点击后隐藏城市列表
               $$("cityList").style.display = "none";
                var area=e.name;
                var weatherContent='<ul>';
                var weatherData;
                searchPointByName(area,function (data) {
                    weatherData=data;
                    weatherContent+='<li>'+weatherData.ganmao+'</li>';
                    weatherContent+='<li>'+weatherData.wendu+'</li>';
                    weatherContent+='<li>'+weatherData.city+'</li>';
                    weatherContent+='</ul>';
                    var lngAlatPeo= new BMap.Point(e.center.lng,e.center.lat);
                    var marker = new BMap.Marker(lngAlatPeo); // 创建点
                    that.map.addOverlay(marker);    //增加点
                    var infoWindowPeo = new BMap.InfoWindow(weatherContent);  // 创建信息窗口对象
                    that.map.openInfoWindow(infoWindowPeo,lngAlatPeo); //开启信息窗口
                });

            });
            // 给“更换城市”链接添加点击操作
            $$("curCityText").onclick = function() {
                var cl =$$("cityList");
                if (cl.style.display == "none") {
                    cl.style.display = "";
                } else {
                    cl.style.display = "none";
                }
            };
            // 给城市列表上的关闭按钮添加点击操作
            $$("popup_close").onclick = function() {
                var cl = $$("cityList");
                if (cl.style.display == "none") {
                    cl.style.display = "";
                } else {
                    cl.style.display = "none";
                }
            };


            this.createPerson(30);
            this.personListClick();
            this.setTxtMenuItem();
            this.setCarLine();
            this.setLine();
        },
        setPlace:function (myValue) {
            var that=this;
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                that.map.centerAndZoom(pp, 12);
                that.map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(that.map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        },
        createPerson:function (quantity) {
            for (var i = 0; i < quantity; i++) {
                var id = i;
                this.points.push({
                    id:id,
                    lng: 113.266604 + Math.random() * 0.2,
                    lat: 23.131006 + Math.random() * -0.1,
                    name: "张三" + id,
                    address: '鸭子桥北里14' + id + '号楼',
                    info: '查看详情',
                    detail: {
                        SupplierPartNumber1: "supplier_part_number_1" + id,
                        Supplier1: "supplier_1" + id,
                        ManufacturerPartNumber: "manufacturer_part_number" + id,
                        Manufacturer: "manufacturer" + id,
                        Category: "category",
                        RoHS: "rohs",
                        Description: "description",
                        Stock1: "stock_1",
                        pricing_1: "Pricing 1",
                        packaging: "Packaging",
                        part_status: "Part Status",
                        mounting_type: "Mounting Type",
                        library_ref: "Library Ref",
                        componentLink1url: "ComponentLink1URL",
                        ComponentLink1Description: "componentLink1description"
                    },
                    img: 'img1.jpg'
                });
            }
            this.setPersonInMap()
        },
        setPersonInMap:function () {
            var pointArray =this.pointArray;
            var markerArray = this.markerArray;
            var points=this.points;
            console.log("points",points)
            for (var i = 0; i < points.length; i++) {
                var name = points[i].name;
                var createLi=document.createElement('a');
                createLi.href='javascript:void(0)';
                createLi.classList='list-group-item';
                createLi.textContent=name;
                createLi.dataset.point=JSON.stringify(points[i])
                $$('peopleList').appendChild(createLi)
                var marker = new BMap.Marker(new BMap.Point(points[i].lng, points[i].lat),{icon:this.myIcon}); // 创建点
                var label = new BMap.Label(points[i].name, {offset: new BMap.Size(25, 15)});
                marker.setLabel(label);
                markerArray.push(marker);
                this.map.addOverlay(marker);    //增加点
                pointArray[i] = new BMap.Point(points[i].lng, points[i].lat);
                var point = JSON.stringify(points[i]);
                this.addClickHandler(point, marker);
                var lngAlat = JSON.stringify({lng: points[i].lng, lat: points[i].lat});
                var startPopt = new Option(name, lngAlat);
                var endPopt = new Option(name, lngAlat);
                $$('startP').options.add(startPopt);
                $$('endP').options.add(endPopt);
            }
            this.map.setViewport(pointArray);
            new BMapLib.MarkerClusterer(this.map, {markers: markerArray});
        },
        addClickHandler:function (point, marker) {
            console.log('handle');
            var that=this;
            marker.addEventListener("click", function (e) {
                that.showInfo(e, point)
            });
        },
        showInfo:function (e, point) {
            var p = e.target;
            var parsePoint = JSON.parse(point);
            var dot = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var stringfyDetail=JSON.stringify(parsePoint.detail);
            var content = '<div class="infowin"><p><b>' + parsePoint.name + '</b></p><p>' + parsePoint.address + '</p>' +
                '<p><a class="btn-detail" onclick=showDetail("' + parsePoint.id + '") href="javascript:void(0);"  data-detail="' + stringfyDetail+ '">' + parsePoint.info + '</a></p>' +
                '</div><div><img class="myinfopic" src="' + parsePoint.img + '" />' +
                '<button onclick=setStart("' + parsePoint.name + '") data-name="' + parsePoint.name + '"  class="btn-startP btn btn-primary btn-xs">设为起点</button>' +
                '<button onclick=setEnd("' + parsePoint.name + '")  data-name="' + parsePoint.name + '"  class="btn-endP btn btn-info btn-xs">设为终点</button></button></div>';
            var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
            this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
            document.getElementById('allmap').onload = function (){
                infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
            }
        },
        personListClick:function () {
            var people=document.querySelectorAll('#peopleList a');
            var that=this;
            for(var j=0;j<people.length;j++){
                (function (j) {
                    people[j].onclick=function (e) {
                        var markerPeo=that.markerArray[j-1];
                        console.log(markerPeo);

                        var pointPeo=JSON.parse(e.target.getAttribute('data-point'));
                        var stringfyDetail=JSON.stringify(pointPeo.detail);
                        var lngAlatPeo= new BMap.Point(markerPeo.point.lng, markerPeo.point.lat);
                        var contentPeo = '<div class="infowin"><p><b>' + pointPeo.name + '</b></p><p>' + pointPeo.address + '</p>' +
                            '<p><a class="btn-detail" onclick=showDetail("' + pointPeo.id + '") href="javascript:void(0);"  data-detail="' + stringfyDetail+ '">' + pointPeo.info + '</a></p>' +
                            '</div><div><img class="myinfopic" src="' + pointPeo.img + '" />' +
                            '<button onclick=setStart("' + pointPeo.name + '") data-name="' + pointPeo.name + '"  class="btn-startP btn btn-primary btn-xs">设为起点</button>' +
                            '<button onclick=setEnd("' + pointPeo.name + '")  data-name="' + pointPeo.name + '"  class="btn-endP btn btn-info btn-xs">设为终点</button></button></div>';

                        var infoWindowPeo = new BMap.InfoWindow(contentPeo);  // 创建信息窗口对象
                        that.map.panTo(lngAlatPeo)
                        that.map.openInfoWindow(infoWindowPeo,lngAlatPeo); //开启信息窗口
                        document.getElementById('allmap').onload = function (){
                            infoWindowPeo.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
                        }
                    }
                })(j);

            }
        },
        setTxtMenuItem:function () {
            var that=this;
            var txtMenuItem = [
                {
                    text: '选起点',
                    callback: function (e) {
                        $('startP').value = e.lng + ',' + e.lat;
                        that.startPoint = new BMap.Point(e.lng, e.lat);
                    }
                },
                {
                    text: '选终点',
                    callback: function (e) {
                        $$('endP').value = e.lng + ',' + e.lat;
                        that.endPoint = new BMap.Point(e.lng, e.lat);
                    }
                },
                {
                    text: '添加标注点',
                    callback: function (p) {
                        var marker = new BMap.Marker(p,{icon:that.myIcon}), px = that.map.pointToPixel(p);
                        that.map.addOverlay(marker);
                        marker.enableDragging(true);
                    }
                }

            ];
            for (var i = 0; i < txtMenuItem.length; i++) {
                this.menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
            }
            this.map.addContextMenu(this.menu);
        },
        setCarLine:function () {
            var that=this;
            $$('search').addEventListener('click',function () {
                var driverType = $$('driverType').value;
                that.map.clearOverlays();
                that.startPoint = new BMap.Point(JSON.parse($$('startP').value).lng, JSON.parse($$('startP').value).lat);
                that.endPoint = new BMap.Point(JSON.parse($$('endP').value).lng, JSON.parse($$('endP').value).lat);
                console.log(driverType, that.startPoint, that.endPoint);
                if (driverType == 1) {
                    var transit = new BMap.TransitRoute(that.map, {
                        renderOptions: {
                            map: that.map,
                            panel: 'sider',
                            autoViewport: true,
                            enableDragging: true
                        }
                    });
                    transit.search(that.startPoint, that.endPoint);
                } else if (driverType == 2) {
                    var driving = new BMap.DrivingRoute(that.map, {
                        renderOptions: {
                            map: that.map,
                            panel: 'sider',
                            autoViewport: true,
                            enableDragging: true
                        }
                    });
                    driving.search(that.startPoint, that.endPoint);
                } else if (driverType == 3) {
                    var walking = new BMap.WalkingRoute(that.map, {
                        renderOptions: {
                            map: that.map,
                            panel: "sider",
                            autoViewport: true,
                            enableDragging: true
                        }
                    });
                    walking.search(that.startPoint, that.endPoint);
                }
            })
        },
        setLine:function(){
            var that=this;
            getRunPoints(function (data) {
                var arrPois = [];
                for(var i=0;i<data.length;i++){
                    arrPois.push(new BMap.Point(data[i].lng,data[i].lat));
                }
                /**添加终点和起点的标记**/
                that.addMarker(new BMap.Point(data[0].lng,data[0].lat),'终点');
                that.addMarker(new BMap.Point(data[data.length-1].lng,data[data.length-1].lat),'起点');
                //创建线路
                var polyline = new BMap.Polyline(
                    arrPois,//所有的GPS坐标点
                    {
                        strokeColor : "#009933", //线路颜色
                        strokeWeight : 4,//线路大小
                        //线路类型(虚线)
                        strokeStyle : "dashed"
                    });
                //绘制线路
                that.map.addOverlay(polyline);
                polyline.addEventListener("click",function (e) {
                    console.log(e)
                })
            });
        },
        addMarker:function(point,name){
            var that=this;
            var marker = new BMap.Marker(point);
            var label = new BMap.Label(name, {
                offset : new BMap.Size(20, -10)
            });
            marker.setLabel(label);
            that.map.addOverlay(marker);
        }
    }
    var createBMap = new createBMap();
})(window);