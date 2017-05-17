/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const FormItem = Form.Item;
import configJson from './../../../config.json';
class ConnectPanelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const hostNameLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const usernameLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        const portLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const keyLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem
                                {...usernameLayout}
                                label="主机名称"
                            >
                                {getFieldDecorator('host', {
                                    initialValue: configJson.MqttServerHost,
                                    rules: [{required: true, message: '主机名称不能为空'}],
                                })(
                                    <Input  disabled/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...portLayout}
                                label="端口"
                            >
                                {getFieldDecorator('port', {
                                    initialValue:configJson.MqttServerPort,
                                    rules: [{required: true, message: '端口不能为空'}],
                                })(
                                    <Input disabled/>
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem
                                {...usernameLayout}
                                label="设备"
                            >
                                {getFieldDecorator('username', {
                                    initialValue: this.props.uuid || '',
                                    rules: [{required: true, message: '设备不能为空'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...portLayout}
                                label="心跳时间"
                            >
                                {getFieldDecorator('keepalive', {
                                    initialValue: 60,
                                    rules: [{required: true, message: '心跳时间不能为空'}],
                                })(
                                    <Input addonAfter="秒"/>
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={24}>
                            <FormItem
                                {...keyLayout}
                                label="身份密钥"
                            >
                                {getFieldDecorator('password', {
                                    initialValue: localStorage.getItem('connect_password'),
                                    rules: [{required: true, message: '身份密钥不能为空'}],
                                })(
                                    <Input />
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
            ;
    }
}
const ConnectPanel = Form.create()(ConnectPanelForm);
export default ConnectPanel;
