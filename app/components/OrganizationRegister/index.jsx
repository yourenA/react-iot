import React, {Component} from 'react';
import {Form, Col, Input, Button, Row,message} from 'antd';
const FormItem = Form.Item;
import {formItemLayoutForOrganize} from './../../common/common';
import './index.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {converErrorCodeToMsg} from './../../common/common.js';

class OrganizationRegister extends Component {
    handleSubmit = (e) => {
        const that=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios({
                    url:`${configJson.prefix}/register`,
                    method: 'post',
                    data: values
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['register success']);
                        that.props.hideMask()
                    })
                    .catch(function (error) {
                        console.log(error.response.data);
                        converErrorCodeToMsg(error)
                    });
            }

        });
    };
    getVerifyCode=()=>{
        const that=this;
        const username=this.props.form.getFieldsValue().username;
        console.log(" username", username);
        const emailRegex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if( emailRegex.test( username )){
            axios({
                url:`${configJson.prefix}/register/verify_code`,
                method: 'post',
                data: {
                    username: username,
                }
            })
                .then(function (response) {
                    console.log(response);
                    message.success(messageJson['send email success']);
                })
                .catch(function (error) {
                    console.log(error.response.data.message);
                    converErrorCodeToMsg(error)
                });
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="Home">
                <div className="home-info ">
                    <div className="organize-register">
                        <p className="organize-register-title">注册新机构</p>
                        <Form onSubmit={this.handleSubmit} className="">
                            <FormItem
                                label="E-mail"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('username', {
                                    rules: [
                                        { type: 'email', message: '请输入正确邮箱地址'},
                                        {required: true, message: '请输入你的邮箱'}],
                                })(
                                    <Row gutter={8}>
                                        <Col span={18}>
                                            <Input  />
                                        </Col>
                                        <Col span={6}>
                                            <Button style={{float: 'right'}} onClick={this.getVerifyCode}>获取验证码</Button>
                                        </Col>
                                    </Row>

                                )}
                            </FormItem>
                            <FormItem
                                label="验证码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('verify_code', {
                                    rules: [{ required: true, message: '请输入验证码' }],
                                })(
                                    <Input   />
                                )}
                            </FormItem>
                            <FormItem
                                label="密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入你的密码'}],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                label="确认密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password_confirmation', {
                                    rules: [{required: true, message: '请输入相同密码'}],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                label="机构名称"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('company_name', {
                                    rules: [{required: true, message: '请输入机构名称'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="电话"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('telephone', {
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="地址"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('address', {
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" style={{float:'right'}}>
                                    注册新机构
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>

        );
    }
}

const WrappedOrganizationRegister = Form.create()(OrganizationRegister);

export default WrappedOrganizationRegister;