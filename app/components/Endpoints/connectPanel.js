/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const FormItem = Form.Item;
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
        const portLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const usernameLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        const keyLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem
                                {...usernameLayout}
                                label="用户名"
                            >
                                {getFieldDecorator('username', {
                                    initialValue: localStorage.getItem('connect_user') || '',
                                    rules: [{required: true, message: '用户名不能为空'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...keyLayout}
                                label="身份密钥"
                            >
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '身份密钥不能为空'}],
                                })(
                                    <Input />
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem
                                {...keyLayout}
                                label="心跳时间"
                            >
                                {getFieldDecorator('keepalive', {
                                    initialValue: 60,
                                    rules: [{required: true, message: '身份密钥不能为空'}],
                                })(
                                    <Input addonAfter="秒"/>
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
