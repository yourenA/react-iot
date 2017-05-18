/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Select, Popconfirm, Card, message} from 'antd';
const Option = Select.Option;
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
import axios from 'axios';
let client;
let timer;
class ConnectTest extends Component {
    constructor(props) {
        super(props);
        this.hide = function () {
        };
        this.state = {
            jsonParam: {sub:[],pub:[]},
            clientIsConnect: false,
            inputInfoType: 'manual',
            autoInputType: 'dataRange',
            connectSourceParamModal: false,
            connectPanelModal: false,
            addSubscribeModal: false,
            hadPubTopics: [],
            hadSubTopics: [],
            subTopicsInfo: [],
            pubBtnText: '发布',
            serial_no:'',
            type:''
        };
    }

    componentDidMount = () => {
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}`,
            method: 'GET',
            headers: getHeader()
        })
            .then(function (response) {
                console.log("response",response);
                let parseTopic={sub:[],pub:[]};
                let topics=response.data.topics;
                for(let i=0,len=topics.data.length;i<len;i++){
                    if(topics.data[i].type==='sub'){
                        parseTopic.sub.push(topics.data[i].name)
                    }else if(topics.data[i].type==='pub'){
                        parseTopic.pub.push(topics.data[i].name)
                    }
                }
                that.setState({
                    jsonParam:parseTopic,
                    serial_no:response.data.serial_no,
                    type:response.data.type
                })
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });
    }
    componentWillUnmount = ()=> {
        this.hide();
        client.end();
    }
    createConnectPanel = ()=> {
        if (this.state.clientIsConnect) {
            message.error(messageJson['had connected']);
            return false
        }
        console.log("ConnectPanel", this.refs.ConnectPanel.getFieldsValue());
        this.hide = message.loading('连线中......', 0);
        const that = this;
        const ConnectPanel = this.refs.ConnectPanel.getFieldsValue();
        const host = `${configJson.MqttServerHost}:${configJson.MqttServerPort}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const options = {
            keepalive: parseInt(ConnectPanel.keepalive) || 0,//心跳时间
            username: ConnectPanel.username,//用户名
            password: ConnectPanel.password || '',//身份密钥
            clientId: clientId,
            clean: true,
            protocolId: 'MQTT',
            protocolVersion: 4,
            reconnectPeriod: 2000,
            connectTimeout: 10 * 1000,
        };
        console.log("options", options)
        client = mqtt.connect(host, options);
        client.on('connect', function () {
            console.log('客户端已连接:' + clientId);
            that.hide();
            message.success(messageJson["connect success"]);
            that.setState({
                connectPanelModal: false,
                clientIsConnect: true
            })

        });
        client.on('reconnect', function () {
            console.log('客户端重新连接:' + clientId);
        });
        client.on('close', function () {
            console.log('客户端已关闭:' + clientId);
            // message.error(messageJson['connect error']);
            if (timer) {
                clearInterval(timer);
            }
            that.setState({
                clientIsConnect: false,
                pubBtnText: '发布'
            })
        });
        client.on('offline', function () {
            console.log('客户端离线:' + clientId);
            that.setState({
                clientIsConnect: false
            })
        });
        client.on("message", function (topic, payload, packet) {
            console.log("接收信息", packet)
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
                clientIsConnect: false
            })
        })

    };
    connectSourceParam = ()=> {
        console.log(this.state.jsonParam);
        const that = this;
        const ShowJsonParamInfoPanel = this.refs.ShowJsonParamInfoPanel.getFieldsValue();
        const sendData = {
            topics: JSON.stringify(this.state.jsonParam),
            ...ShowJsonParamInfoPanel
        };
        console.log("sendData", sendData);
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/base`,
            method: 'put',
            data: sendData,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    connectSourceParamModal: false,
                });
                message.success(messageJson['init/update sourceParam success']);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }

    disconnect = ()=> {
        console.log("disconnect client", client);
        if (!this.state.clientIsConnect) {
            message.error(messageJson['connect first']);
            return false
        } else {
            client.end();
            message.success(messageJson["disconnect success"]);
            this.setState({
                clientIsConnect: false
            })
        }
    }
    disconnect2 = ()=> {
        client.end();
        this.hide();
        this.setState({
            clientIsConnect: false
        })
    }
    getJsonParam = (jsonParam)=> {
        this.setState({
            jsonParam: jsonParam
        })
    }
    publicTheme = ()=> {
        console.log("this.state.clientIsConnect", this.state.clientIsConnect)
        if (!this.state.clientIsConnect) {
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
        if (!PublishPanel.topic) {
            message.error(messageJson['pub topic must no null']);
            return false
        }
        const pubTopic=this.state.jsonParam.pub[Number(PublishPanel.topic)];
        if (this.state.inputInfoType === 'manual') {
            this.publishAction(pubTopic, PublishPanel.info, options);
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
                        console.log("that.state.clientIsConnect", that.state.clientIsConnect)
                        if (!that.state.clientIsConnect) {
                            message.error(messageJson['client had disconnect']);
                            clearInterval(timer);
                            return false
                        }
                        console.log("是否随机", random)
                        console.log("精度", accuracy)
                        if (random) {
                            let randomNum;
                            if (accuracy === 0.1) {
                                randomNum = (Math.round((Math.random() * (max - min) + min) * 10) / 10).toFixed(1)
                            } else if (accuracy === 0.01) {
                                randomNum = (Math.round((Math.random() * (max - min) + min) * 100) / 100).toFixed(2)
                            } else {
                                randomNum = Math.floor(Math.random() * (max - min) + min)

                            }
                            console.log("发送的数据", randomNum)
                            that.publishAction(pubTopic, randomNum.toString(), options);

                        } else {
                            if (min > max) {
                                min = Number(PublishPanel.min)
                            }
                            if (accuracy === 0.1) {
                                min = parseFloat((min + accuracy).toFixed(1));
                            } else if (accuracy === 0.01) {
                                min = parseFloat((min + accuracy).toFixed(2));
                            } else {
                                min = min + accuracy
                            }
                            console.log("发送的数据", min);
                            that.publishAction(pubTopic, min.toString(), options);

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
                        if (!that.state.clientIsConnect) {
                            message.error(messageJson['client had disconnect']);
                            clearInterval(timer);
                            return false
                        }
                        if (random) {
                            that.publishAction(pubTopic, dataFlowInfo[Math.floor(Math.random() * dataFlowInfo.length)], options);
                        } else {
                            if (initPosition >= dataFlowInfo.length) {
                                initPosition = 0
                            }
                            that.publishAction(pubTopic, dataFlowInfo[initPosition], options);

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
                }, function () {
                    let pubPanel = document.querySelector('.pubPanel');
                    pubPanel.scrollTop = pubPanel.scrollHeight;
                })


            }
        });
    }
    // addSubscribePanel = ()=> {
    //     console.log("sub client ", client);
    //     if (!client) {
    //         message.error(messageJson['connect first']);
    //         return false
    //     }
    //     const AddSubscribePanel = this.refs.AddSubscribePanel.getFieldsValue();
    //     const tempArr = [];
    //     const that = this;
    //     for (var k in AddSubscribePanel) {
    //         if (k.indexOf('topics') >= 0) {
    //             if (AddSubscribePanel.hasOwnProperty(k)) {
    //                 tempArr.push(AddSubscribePanel[k])
    //             }
    //         }
    //     }
    //     this.setState({
    //         hadSubTopics: tempArr,
    //         addSubscribeModal: false,
    //     });
    //     const AddSubscribeDate = convertSubFormToData(AddSubscribePanel);
    //     console.log("AddSubscribePanel", AddSubscribeDate);
    //     client.subscribe(AddSubscribeDate, (err, granted)=> {
    //         if (err) {
    //             console.log("订阅出错", err);
    //             message.error(messageJson['sub topic fail']);
    //         } else {
    //             message.success(messageJson['sub topic success']);
    //
    //         }
    //
    //     })
    // }
    // goback = ()=> {
    //     hashHistory.goBack()
    // }
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
    handleDelSubChildren=(value)=>{
        client.unsubscribe(this.state.jsonParam.sub[Number(value)], (err, granted)=> {
            if (err) {
                console.log("取消订阅出错", err);
                message.error(messageJson['cancel sub topic fail']);
            }else{
                message.success(messageJson['cancel sub topic success']);
            }

        });
    }
    handleSelectSubChildren = (value)=> {
        client.subscribe(this.state.jsonParam.sub[Number(value)], (err, granted)=> {
            if (err) {
                console.log("订阅出错", err);
                message.error(messageJson['sub topic fail']);
            } else {
                message.success(messageJson['sub topic success']);
            }
        })
    }

    render() {
        const subChildren = [];
        for (let i = 0; i < this.state.jsonParam.sub.length; i++) {
            subChildren.push(<Option key={i}>{this.state.jsonParam.sub[i]}</Option>);
        }
        const pubChildren = [];
        for (let i = 0; i < this.state.jsonParam.pub.length; i++) {
            pubChildren.push(<Option key={i}>{this.state.jsonParam.pub[i]}</Option>);
        }
        return (
            <div className="Home">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                    <Breadcrumb.Item ><Link to='/basic'>设备域</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >连接测试</Breadcrumb.Item>
                </Breadcrumb>
                <div className="operate-box">
                    <button className="ant-btn btn-info" onClick={()=> {
                        this.setState({connectSourceParamModal: true})
                    }}>设备初始化参数
                    </button>
                    <span className="ant-divider"/>
                    <Button type="primary" icon="plus" onClick={()=> {
                        this.setState({connectPanelModal: true})
                    }}>连接参数面板</Button>
                    {this.state.clientIsConnect ?
                        <div className="search-wrap">
                            <span className="ant-divider"/>
                            <Popconfirm placement="topRight" title={`确定要断开连接吗?`}
                                        onConfirm={this.disconnect}>
                                <button className="ant-btn btn-warning">
                                    断开连接
                                </button>
                            </Popconfirm>
                        </div>
                        : null}

                </div>
                <Row gutter={20}>
                    <Col xs={20} sm={20} md={16} lg={14}>
                        <Card title="发布面板">
                            <div className="cleanInfo">
                                <Button onClick={()=> {
                                    this.setState({hadPubTopics: []})
                                }} type="danger">
                                    清空发布信息面板
                                </Button>
                            </div>

                            <ShowPublishPanel hadPubTopics={this.state.hadPubTopics} ref="ShowPublishPanel"/>
                            <PublishPanel ref="PublishPanel" inputInfoType={this.state.inputInfoType}
                                          clientIsConnect={this.state.clientIsConnect}
                                          pubChildren={pubChildren}
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
                                <Button onClick={()=> {
                                    this.setState({subTopicsInfo: []})
                                }} type="danger">
                                    清空订阅信息面板
                                </Button>
                            </div>
                            <SubscriptionPanel subTopicsInfo={this.state.subTopicsInfo}/>
                          {/*  <Row type="flex" justify="end ">
                                <Button onClick={()=> {
                                    this.setState({addSubscribeModal: true})
                                }} type="primary" htmlType="submit" className="">
                                    添加订阅主题
                                </Button>
                            </Row>*/}
                            <Row>
                                <Col span={4}>
                                    <p style={{height: "28px", lineHeight: "28px"}}>
                                        订阅主题 :
                                    </p>
                                </Col>
                                <Col span={20}>
                                    <Select
                                        disabled={!this.state.clientIsConnect}
                                        multiple={true}
                                        placeholder="选择订阅主题，可多选"
                                        style={{width: '100%'}}
                                        onDeselect={this.handleDelSubChildren}
                                        onSelect={this.handleSelectSubChildren}
                                    >
                                        {subChildren}
                                    </Select>
                                </Col>
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
                                onClick={this.disconnect2}>断开连接</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.createConnectPanel}>
                            建立连接
                        </Button>,
                    ]}
                >
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
                            初始化/更新
                        </Button>,
                    ]}
                >
                    <ShowJsonParamInfoPanel type={this.state.type} serial_no={this.state.serial_no} ref="ShowJsonParamInfoPanel" getJsonParam={this.getJsonParam}
                                            jsonParam={this.state.jsonParam}/>
                </Modal>
               {/* <Modal
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
                </Modal>*/}
            </div>
        );
    }
}

export default ConnectTest;
