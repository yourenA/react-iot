import React, {Component} from 'react';
import {Form, Col, Input, Button, Row, message} from 'antd';
const FormItem = Form.Item;
import './index.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {converErrorCodeToMsg, getUrlParam} from './../../common/common.js';
import {hashHistory} from 'react-router'
import {formItemLayoutForOrganize} from './../../common/common';
class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    handleSubmit = (e) => {
        const that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const urlParam = getUrlParam('code');
                console.log("urlParam", urlParam);
                if (urlParam) {
                    axios({
                        url: `${configJson.prefix}/password/forget`,
                        method: 'post',
                        data: {
                            code: urlParam,
                            password: values.password,
                            password_confirmation: values.password_confirmation,
                        }
                    })
                        .then(function (response) {
                            message.success(messageJson['fix password success']);
                            setTimeout(()=>{hashHistory.replace('/')},1000)
                        })
                        .catch(function (error) {
                            converErrorCodeToMsg(error)
                        });
                } else {
                    hashHistory.replace('/')
                }
            }

        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="Home">
                <div className="home-info ">
                    <div className="organize-register">
                        <p className="organize-register-title">密码重置</p>
                        <Form onSubmit={this.handleSubmit} className="">
                            <FormItem
                                label="新密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {required: true, message: '请设置新的密码'}],
                                })(
                                    <Input type="password"/>
                                )}
                            </FormItem>
                            <FormItem
                                label="重复密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password_confirmation', {
                                    rules: [{required: true, message: '请重复密码'}],
                                })(
                                    <Input type="password"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                    确定
                                </Button>
                            </FormItem>
                        </Form>
                        <p className="active-success">
                            {this.state.message}
                        </p>
                    </div>
                </div>
            </div>

        );
    }
}
const WrappedForgetPassword = Form.create()(ForgetPassword);
export default WrappedForgetPassword;