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
let  client;
class ConnectTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectPanelModal: false,

        };
    }

    componentDidMount = () => {


    }
    createConnectPanel = ()=> {
        console.log("ConnectPanel", this.refs.ConnectPanel.getFieldsValue());
        const ConnectPanel=this.refs.ConnectPanel.getFieldsValue();
        const hide = message.loading('连线中..', 0);
        const  host = `${ConnectPanel.host}:${ConnectPanel.port}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
        const options={
            keepalive:parseInt(ConnectPanel.keepalive),//心跳时间
            username: ConnectPanel.username,//用户名
            password: ConnectPanel.password,//身份密钥
            clientId: clientId,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        };
        client = mqtt.connect(host,options);
        console.log("client", client);
        setTimeout(hide, 2500);
        client.on('connect', function () {
            console.log('client connected:' + clientId)
        })
        client.on("message", function (topic, payload) {
            alert([topic, payload].join(": "));
            client.end()
        });
        client.on('error', function (err) {
            console.log('error',err);
            client.end()
        })

    };
    publicTheme = ()=> {
        console.log("PublishPanel", this.refs.PublishPanel.getFieldsValue());
        const PublishPanel=this.refs.PublishPanel.getFieldsValue();
        client.publish(PublishPanel.topic, PublishPanel.info, { qos: parseInt(PublishPanel.QoS), retained: PublishPanel.retain })
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
                            <ShowPublishPanel ref="ShowPublishPanel"/>
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
                                <Button onClick={this.publicTheme} type="primary" htmlType="submit" className="">
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
            </div>
        );
    }
}

export default ConnectTest;
