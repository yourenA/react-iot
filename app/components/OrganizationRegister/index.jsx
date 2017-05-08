import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
const FormItem = Form.Item;
import {formItemLayoutForOrganize} from './../../common/common';
import './index.scss'
class OrganizationRegister extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const that = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
            }
        });
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
                                {getFieldDecorator('email', {
                                    rules: [
                                        { type: 'email', message: '请输入正确邮箱地址'},
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
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                label="确认密码"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('password2', {
                                    rules: [{required: true, message: '请输入相同密码'}],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                label="名称"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入你的名称'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="电话"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('phone', {
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="地址"
                                {...formItemLayoutForOrganize}>
                                {getFieldDecorator('adress', {
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