import React, {Component} from 'react';
import {Form, Col, Input, Button, Tooltip, message, Icon } from 'antd';
const FormItem = Form.Item;
import {formItemLayoutForOrganize} from './../../common/common';
import './index.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {converErrorCodeToMsg} from './../../common/common.js';

class OrganizationRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerSuccess: false,
        };
    }

    handleSubmit = (e) => {
        const that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios({
                    url: `${configJson.prefix}/register`,
                    method: 'post',
                    data: values
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['register success']);
                        that.setState({
                            registerSuccess: true
                        })
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }

        });
    };
    sendEmail = ()=> {
        this.props.form.validateFields(['username'], (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios({
                    url: `${configJson.prefix}/register/link`,
                    method: 'post',
                    data: values
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['sendEmail success']);
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }

        });
    }
    judgmentPhone = (rule, value, callback)=> {
        const teleReg = /^((0\d{2,3})-)(\d{7,8})$/;
        const mobileReg = /^1[358]\d{9}$/;
        console.log("value", value)
        if (!teleReg.test(value) && !mobileReg.test(value)) {
            callback('请输入正确电话')
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
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
                                        {type: 'email', message: '请输入正确邮箱地址'},
                                        {required: true, message: '请输入你的邮箱'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入你的密码'}],
                                })(
                                    <Input type="password"/>
                                )}
                            </FormItem>
                            <FormItem
                                label="确认密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password_confirmation', {
                                    rules: [{required: true, message: '请输入相同密码'}],
                                })(
                                    <Input type="password"/>
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
                                label={(
                                    <span>
                                        电话&nbsp;
                                        <Tooltip title="固话区号后需添加”-“">
                                            <Icon type="question-circle-o"/>
                                        </Tooltip>
                                    </span>
                                )}

                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('telephone', {
                                    rules: [{required: true, message: '请输入电话'}, {
                                        validator: this.judgmentPhone
                                    }],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="地址"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('address', {})(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                    注册新机构
                                </Button>
                            </FormItem>
                        </Form>

                        {this.state.registerSuccess ?
                            <div>
                                <p className="active-success">激活邮件已经发送至你的邮箱，请注意查收！如果没有请点击 '<span
                                    style={{color: 'red', cursor: 'pointer'}} onClick={this.sendEmail}>重新发送邮件</span>'重新发送邮件
                                </p>
                            </div> : null}
                    </div>
                </div>
            </div>

        );
    }
}

const WrappedOrganizationRegister = Form.create()(OrganizationRegister);

export default WrappedOrganizationRegister;