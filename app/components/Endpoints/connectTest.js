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
import {getHeader, converErrorCodeToMsg,convertSubFormToData} from './../../common/common.js';
import configJson from './../../../config.json';
import messageJson from './../../common/message.json';

let client;
class ConnectTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectPanelModal: false,
            addSubscribeModal:false,
            publishInfo:[]
        };
    }

    componentDidMount = () => {
    }
    createConnectPanel = ()=> {
        console.log("ConnectPanel", this.refs.ConnectPanel.getFieldsValue());
        const ConnectPanel = this.refs.ConnectPanel.getFieldsValue();
        const hide = message.loading('连线中..', 0);
        const  host = `${configJson.MqttServerHost}:${configJson.MqttServerPort}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const options={
            keepalive:parseInt(ConnectPanel.keepalive),//心跳时间
            username: ConnectPanel.username,//用户名
            password: ConnectPanel.password,//身份密钥
            clientId: clientId,
            clean: true,
            protocolId: 'MQTT',
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        };
        client = mqtt.connect(host,options);
        client.on('connect', function () {
            console.log('client connected:' + clientId);
            hide();
            message.success(messageJson["connect success"]);

        })
        client.on("message", function (topic, payload) {
            alert([topic, payload].join(": "));
        });
        client.on('error', function (err) {
            console.log('error',err);
            client.end()
        })

    };
    publicTheme = ()=> {
        console.log("PublishPanel", this.refs.PublishPanel.getFieldsValue());
        const PublishPanel = this.refs.PublishPanel.getFieldsValue();
        const options={
            qos: parseInt(PublishPanel.QoS),
            retained: PublishPanel.retain
        };
        console.log(options)
        console.log("publish client ",client);
        client.publish(PublishPanel.topic, PublishPanel.info,options )
    };
    addSubscribePanel=()=>{
        const AddSubscribePanel=this.refs.AddSubscribePanel.getFieldsValue();
        const AddSubscribeDate = convertSubFormToData(AddSubscribePanel);
        console.log("AddSubscribeDate",AddSubscribeDate);
        client.subscribe(AddSubscribeDate)
    }
    goback = ()=> {
        hashHistory.goBack()
    }

    render() {
        return (
            <div className="Home">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                    <Breadcrumb.Item ><Link to='/basic'>设备域</Link></Breadcrumb.Item>
                    <Breadcrumb.Item ><Link onClick={this.goback}>设备</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >连接测试</Breadcrumb.Item>
                </Breadcrumb>
                <div className="operate-box">
                    <Button type="primary" icon="plus" onClick={()=> {
                        this.setState({connectPanelModal: true})
                    }}>连接参数面板</Button>
                </div>
                <Row gutter={20}>
                    <Col xs={24} sm={24} md={14} lg={14}>
                        <Card title="发布面板">
                            <ShowPublishPanel publishInfo={this.state.publishInfo} ref="ShowPublishPanel"/>
                            <PublishPanel ref="PublishPanel"/>
                            <Row type="flex" justify="end ">
                                <Button onClick={this.publicTheme} type="primary" htmlType="submit" className="">
                                    发布
                                </Button>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10}>
                        <Card title="订阅面板">
                            <SubscriptionPanel />
                            <Row type="flex" justify="end ">
                                <Button onClick={()=>{this.setState({addSubscribeModal:true})}} type="primary" htmlType="submit" className="">
                                    添加订阅主题
                                </Button>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    key={1 + Date.parse(new Date())}
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
                    <ConnectPanel ref="ConnectPanel"/>
                </Modal>
                <Modal
                    key={2 + Date.parse(new Date())}
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
                    <AddSubscribePanel ref="AddSubscribePanel"/>
                </Modal>
            </div>
        );
    }
}

export default ConnectTest;
