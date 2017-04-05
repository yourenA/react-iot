/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Slider} from 'antd'
import Chart from 'chart.js'
import  'canvas-gauges';
let myChart;
let temp=[]
class Temperature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature:30,
            tempArr:[],
        };
    }
    componentDidMount() {
        const that=this;
        let flag='up';

        // setInterval(function () {
        //     // console.log(temp)
        //     if(flag==='up'){
        //         that.setState({
        //             temperature:that.state.temperature+10,
        //         })
        //     }else if(flag==='down'){
        //         that.setState({
        //             temperature:that.state.temperature-10,
        //         })
        //     }
        //     if(that.state.temperature>=150){
        //         flag='down'
        //     }else if(that.state.temperature<=-50){
        //         flag='up'
        //     }
        //
        // },1000)
        var ctx = document.getElementById("myChart");
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels:[],
                datasets: [{
                    label: '温度走势',
                    data:  [],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:false,
                            min:-60,
                            max:160,
                            stepSize: 10,
                            maxTicksLimit:10
                        }
                    }]
                }
            }
        });
    };
    addDate=()=>{
        // this.setState({
        //     tempArr:this.state.tempArr.concat(10),
        // })


    }
    changeTemperature=(value)=>{
        this.setState({
            temperature:value,
        })
        if(myChart.data.labels.length>10){
            myChart.data.datasets[0].data.shift();
            myChart.data.labels.shift();
        }
        myChart.data.datasets[0].data[myChart.data.labels.length] = value;
        myChart.data.labels[myChart.data.labels.length] = new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
        myChart.update();
    }
    render() {
        let temperature=this.state.temperature;
        console.log(temperature)
        return (
            <div id="temperature">
                <canvas data-type="linear-gauge"
                        data-width="160"
                        data-height="600"
                        data-border-radius="20"
                        data-borders="1"
                        data-bar-stroke-width="50"
                        data-minor-ticks="50"
                        data-min-value="-50"
                        data-max-value="150"
                        data-major-ticks="-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150"
                        data-value={temperature}
                        data-units="°C"
                        data-color-value-box-shadow="false"
                        data-animation-duration="100"
                ></canvas>
                <canvas data-type="radial-gauge"
                        data-width="300"
                        data-height="300"
                        data-units="°C"
                        data-title="Temperature"
                        data-min-value="-50"
                        data-max-value="150"
                        data-value={temperature}
                        data-major-ticks="[-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150]"
                        data-minor-ticks="2"
                        data-stroke-ticks="true"
                        data-highlights='[ {"from": -50, "to": 0, "color": "rgba(0,0, 255, .3)"},
        {"from": 0, "to": 50, "color": "rgba(255, 0, 0, .3)"} ]'
                        data-ticks-angle="225"
                        data-start-angle="67.5"
                        data-color-major-ticks="#ddd"
                        data-color-minor-ticks="#ddd"
                        data-color-title="#eee"
                        data-color-units="#ccc"
                        data-color-numbers="#eee"
                        data-color-plate="#222"
                        data-border-shadow-width="0"
                        data-borders="true"
                        data-needle-type="arrow"
                        data-needle-width="2"
                        data-needle-circle-size="7"
                        data-needle-circle-outer="true"
                        data-needle-circle-inner="false"
                        data-animation-duration="100"
                        data-animation-rule="linear"
                        data-color-border-outer="#333"
                        data-color-border-outer-end="#111"
                        data-color-border-middle="#222"
                        data-color-border-middle-end="#111"
                        data-color-border-inner="#111"
                        data-color-border-inner-end="#333"
                        data-color-needle-shadow-down="#333"
                        data-color-needle-circle-outer="#333"
                        data-color-needle-circle-outer-end="#111"
                        data-color-needle-circle-inner="#111"
                        data-color-needle-circle-inner-end="#222"
                        data-value-box-border-radius="0"
                        data-color-value-box-rect="#222"
                        data-color-value-box-rect-end="#333"
                ></canvas>
                <Slider onChange={this.changeTemperature} defaultValue={temperature}  min={-50} max={150}/>
                <div>温度控制</div>
                <button onClick={this.addDate}>添加数据</button>
                <div style={{width:'1000px',height:'400px'}}>
                    <canvas id="myChart" width="1000" height="400"></canvas>
                </div>
            </div>
        )
    }
}

export default Temperature;
