/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm, Card, message} from 'antd';
const Search = Input.Search;
import {Link, hashHistory} from 'react-router';
import ConnectPanel from './connectPanel'
import PublishPanel from './publishPanel'
import ShowPublishPanel from './showPublish'
import SubscriptionPanel from './subscriptionPanel';
import AddSubscribePanel from './addSubscribePanel';
import {getHeader, converErrorCodeToMsg, convertSubFormToData} from './../../common/common.js';
import configJson from './../../../config.json';
import messageJson from './../../common/message.json';
import ShowJsonParamInfoPanel from './showJsonParam'

let client;
let timer;
class ConnectTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonParam : [
                {
                    "uri": "/Test/0",
                    "obs": false,
                    "type": "application/vnd.oma.lwm2m+tlv"
                },
                {
                    "uri": "/Test/0/S",
                    "rt": "ResourceTest",
                    "obs": false,
                    "type": ""
                },
                {
                    "uri": "/Test/0/D",
                    "rt": "ResourceTest",
                    "obs": true,
                    "type": ""
                },
                {
                    "uri": "/3/0",
                    "obs": false,
                    "type": "application/vnd.oma.lwm2m+tlv"
                }
            ],

            clientIsConnect:false,
            inputInfoType: 'manual',
            autoInputType: 'dataRange',
            connectSourceParamModal:false,
            connectPanelModal: false,
            addSubscribeModal: false,
            hadPubTopics: [],
            hadSubTopics: [],
            subTopicsInfo: [],
            pubBtnText: '发布'
        };
    }

    componentDidMount = () => {
    }
    connectSourceParam=()=>{
        console.log(this.state.jsonParam)
    }
    createConnectPanel = ()=> {
        console.log("ConnectPanel", this.refs.ConnectPanel.getFieldsValue());
        const that = this;
        const ConnectPanel = this.refs.ConnectPanel.getFieldsValue();
        const hide = message.loading('连线中......', 0);
        const host = `${configJson.MqttServerHost}:${configJson.MqttServerPort}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const options = {
            keepalive: parseInt(ConnectPanel.keepalive) || 0,//心跳时间
            username: ConnectPanel.username,//用户名
            password: ConnectPanel.password || '',//身份密钥
            clientId: clientId,
            clean: true,
            protocolId: 'MQTT',
            reconnectPeriod: 1000,
            connectTimeout: 10 * 1000,
        };
        client = mqtt.connect(host, options);
        client.on('connect', function () {
            console.log('客户端已连接:' + clientId);
            hide();
            message.success(messageJson["connect success"]);
            that.setState({
                connectPanelModal:false ,
                clientIsConnect:true
            })

        });
        client.on('reconnect', function () {
            console.log('客户端重新连接:' + clientId);
        });
        client.on('close', function () {
            console.log('客户端已关闭:' + clientId);
            if(timer){
                clearInterval(timer);
            }
            that.setState({
                clientIsConnect:false,
                pubBtnText: '发布'
            })
        });
        client.on('offline', function () {
            console.log('客户端离线:' + clientId);
            that.setState({
                clientIsConnect:false
            })
        });
        client.on("message", function (topic, payload, packet) {
            console.log("packet", packet)
            that.setState({
                subTopicsInfo: that.state.subTopicsInfo.concat({
                    qos: packet.qos,
                    topic: topic,
                    info: payload.toString(),
                    dateTime: new Date().toLocaleString()
                })
            });
            let subPanel = document.querySelector('.subPanel');
            subPanel.scrollTop = subPanel.scrollHeight;
        });
        client.on('error', function (err) {
            console.log('客户端出错:', err);
            client.end();
            that.setState({
                clientIsConnect:false
            })
        })

    };
    disconnect=()=>{
        console.log("disconnect client",client);
        if (!client) {
            message.error(messageJson['connect first']);
            return false
        }else{
            client.end();
            message.success(messageJson["disconnect success"]);
            this.setState({
                clientIsConnect:false
            })
        }
    }
    getJsonParam=(jsonParam)=>{
        this.setState({
            jsonParam:jsonParam
        })
    }
    publicTheme = ()=> {
        if (!client) {
            message.error(messageJson['connect first']);
            return false
        }
        const that = this;
        const PublishPanel = this.refs.PublishPanel.getFieldsValue();
        console.log("PublishPanel", PublishPanel);
        const options = {
            qos: parseInt(PublishPanel.QoS),
            retain: PublishPanel.retain
        };
        if (this.state.inputInfoType === 'manual') {
            this.publishAction(PublishPanel.topic, PublishPanel.info, options);
        } else if (this.state.inputInfoType === 'auto') {
            let min = Number(PublishPanel.min),
                max = Number(PublishPanel.max),
                accuracy = Number(PublishPanel.accuracy),
                interval = Number(PublishPanel.interval),
                times = Number(PublishPanel.times),
                random = PublishPanel.random;
            if (this.state.pubBtnText === '发布') {
                this.setState({
                    pubBtnText: '停止'
                });
                if (this.state.autoInputType === 'dataRange') {
                    let initTimes = 0;

                    timer = setInterval(function () {
                        if(!that.state.clientIsConnect){
                            message.error(messageJson['client had disconnect']);
                            clearInterval(timer);
                            return false
                        }
                        if (random) {
                            let randomNum;
                            if (accuracy === 0.1) {
                                randomNum = (Math.round((Math.random() * (max - min) + min) * 10) / 10).toFixed(1)
                            } else if (accuracy === 0.01) {
                                randomNum = (Math.round((Math.random() * (max - min) + min) * 100) / 100).toFixed(2)
                            } else {
                                randomNum = Math.floor(Math.random() * (max - min) + min)

                            }
                            that.publishAction(PublishPanel.topic, randomNum, options);

                        } else {
                            if (min > max) {
                                min = Number(PublishPanel.min)
                            }
                            that.publishAction(PublishPanel.topic, min, options);
                            if (accuracy === 0.1) {
                                min = parseFloat((min + accuracy).toFixed(1));
                            } else if (accuracy === 0.01) {
                                min = parseFloat((min + accuracy).toFixed(2));
                            } else {
                                min = min + accuracy
                            }

                        }
                        initTimes++;
                        if (initTimes >= times) {
                            clearInterval(timer);
                            that.setState({
                                pubBtnText: '发布'
                            });
                        }
                    }, interval * 1000)

                } else if (this.state.autoInputType === 'dateFlow') {
                    let dataFlowInfo = PublishPanel.dataFlowInfo.split(',');
                    console.log("dataFlowInfo", dataFlowInfo);
                    let initPosition = 0;
                    timer = setInterval(function () {
                        if(!that.state.clientIsConnect){
                            message.error(messageJson['client had disconnect']);
                            clearInterval(timer);
                            return false
                        }
                        if (random) {
                            that.publishAction(PublishPanel.topic, dataFlowInfo[Math.floor(Math.random() * dataFlowInfo.length)], options);
                        } else {
                            if (initPosition >= dataFlowInfo.length) {
                                initPosition = 0
                            }
                            that.publishAction(PublishPanel.topic, dataFlowInfo[initPosition], options);

                        }
                        initPosition++;
                        if (initPosition >= times) {
                            clearInterval(timer);
                            that.setState({
                                pubBtnText: '发布'
                            });
                        }
                    }, interval * 1000)

                }
            } else if (this.state.pubBtnText === '停止') {
                clearInterval(timer);
                this.setState({
                    pubBtnText: '发布'
                });
            }


        }


    }
    publishAction = (topic, info, options)=> {
        const that = this;
        client.publish(topic, info, options, (err)=> {
            if (err) {
                console.log("发布出错", err);
                message.error(messageJson['pub topic fail']);
            } else {
                that.setState({
                    hadPubTopics: that.state.hadPubTopics.concat({
                        topic: topic,
                        info: info,
                        QoS: options.qos,
                        dateTime: new Date().toLocaleString()
                    })
                },function () {
                    let pubPanel = document.querySelector('.pubPanel');
                    pubPanel.scrollTop = pubPanel.scrollHeight;
                })


            }
        });
    }
    addSubscribePanel = ()=> {
        console.log("sub client ", client);
        if (!client) {
            message.error(messageJson['connect first']);
            return false
        }
        const AddSubscribePanel = this.refs.AddSubscribePanel.getFieldsValue();
        const tempArr = [];
        const that = this;
        for (var k in AddSubscribePanel) {
            if (k.indexOf('topics') >= 0) {
                if (AddSubscribePanel.hasOwnProperty(k)) {
                    tempArr.push(AddSubscribePanel[k])
                }
            }
        }
        this.setState({
            hadSubTopics: tempArr,
            addSubscribeModal: false,
        });
        const AddSubscribeDate = convertSubFormToData(AddSubscribePanel);
        console.log("AddSubscribePanel", AddSubscribeDate);
        client.subscribe(AddSubscribeDate, (err, granted)=> {
            if (err) {
                console.log("订阅出错", err);
                message.error(messageJson['sub topic fail']);
            } else {
                message.success(messageJson['sub topic success']);

            }

        })
    }
    goback = ()=> {
        hashHistory.goBack()
    }
    changeInputInfoType = (key)=> {
        console.log(key)
        if (this.state.pubBtnText == '停止') {
            message.error(messageJson['stop pub first']);
            return false
        } else {
            this.setState({
                inputInfoType: key
            })
        }
    }
    changeAutoType = (value)=> {
        this.setState({
            autoInputType: value
        })
    }

    render() {
        return (
            <div className="Home">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                    <Breadcrumb.Item ><Link to='/basic'>设备域</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >连接测试</Breadcrumb.Item>
                </Breadcrumb>
                <div className="operate-box">
                    <Button type="primary" icon="plus" onClick={()=> {
                        this.setState({connectPanelModal: true})
                    }}>连接参数面板</Button>
                    {this.state.clientIsConnect?
                        <Popconfirm placement="topRight" title={`确定要断开连接吗?`}
                                    onConfirm={this.disconnect}>
                            <button style={{marginLeft:'10px'}} className="ant-btn btn-info">
                                断开连接
                            </button>
                        </Popconfirm>
                        :null}

                </div>
                <Row gutter={20}>
                    <Col xs={20} sm={20} md={16} lg={14}>
                        <Card title="发布面板">
                            <div className="cleanInfo">
                                <Button onClick={()=>{this.setState({hadPubTopics:[]})}} type="danger">
                                    清空发布信息面板
                                </Button>
                            </div>

                            <ShowPublishPanel hadPubTopics={this.state.hadPubTopics} ref="ShowPublishPanel"/>
                            <PublishPanel getJsonParam={this.getJsonParam} jsonParam={this.state.jsonParam} ref="PublishPanel" inputInfoType={this.state.inputInfoType}
                                          changeInputInfoType={this.changeInputInfoType}
                                          changeAutoType={this.changeAutoType}
                                          autoInputType={this.state.autoInputType}
                                          pubBtnText={this.state.pubBtnText}
                            />
                            <Row type="flex" justify="end ">
                                <Button onClick={this.publicTheme} type="primary" htmlType="submit" className="">
                                    {this.state.pubBtnText}
                                </Button>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={10}>
                        <Card title="订阅面板">
                            <div className="cleanInfo">
                                <Button onClick={()=>{this.setState({subTopicsInfo:[]})}} type="danger">
                                    清空订阅信息面板
                                </Button>
                            </div>
                            <SubscriptionPanel subTopicsInfo={this.state.subTopicsInfo}/>
                            <Row type="flex" justify="end ">
                                <Button onClick={()=> {
                                    this.setState({addSubscribeModal: true})
                                }} type="primary" htmlType="submit" className="">
                                    添加订阅主题
                                </Button>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.connectPanelModal}
                    title="连接参数面板"
                    onCancel={()=> {
                        this.setState({connectPanelModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({connectPanelModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.createConnectPanel}>
                            确定
                        </Button>,
                    ]}
                >
                    <ShowJsonParamInfoPanel getJsonParam={this.props.getJsonParam} jsonParam={this.props.jsonParam}/>

                    <ConnectPanel uuid={this.props.params.uuid} ref="ConnectPanel"/>
                </Modal>
                <Modal
                    visible={this.state.connectSourceParamModal}
                    title="资源参数面板"
                    onCancel={()=> {
                        this.setState({connectSourceParamModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({connectSourceParamModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.connectSourceParam}>
                            确定
                        </Button>,
                    ]}
                >
                    <ShowJsonParamInfoPanel getJsonParam={this.getJsonParam} jsonParam={this.state.jsonParam}/>
                </Modal>
                <Modal
                    visible={this.state.addSubscribeModal}
                    title="添加订阅主题"
                    width={300}
                    onCancel={()=> {
                        this.setState({addSubscribeModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({addSubscribeModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.addSubscribePanel}>
                            确定
                        </Button>,
                    ]}
                >
                    <AddSubscribePanel hadSubTopics={this.state.hadSubTopics} ref="AddSubscribePanel"/>
                </Modal>
            </div>
        );
    }
}

export default ConnectTest;
