import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';
const FormItem = Form.Item;
import './login.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {converErrorCodeToMsg} from './../../common/common.js';

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuccess: false,
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const that =this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                that.props.login(values)
            }
        });
    }
    sendEmail=(type)=>{
        this.props.form.validateFields(['username'],(err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios({
                    url:`${configJson.prefix}/${type}/link`,
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
    render() {
        const {getFieldDecorator} = this.props.form;
        const display = this.props.isHide ? 'none' : 'block';
        return (
            <div className="components-form-demo-normal-login" style={{display: display}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: '请先输入你的用户名(E-mail)'}],
                        })(
                            <Input addonBefore={<Icon type="user"/>} placeholder="E-mail"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码'}],
                        })(
                            <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="Password"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住我</Checkbox>
                        )}
                        <a onClick={()=>this.sendEmail('password')} className="login-form-forgot">忘记密码</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        <a >注册</a>
                    </FormItem>
                    {!this.props.activeSuccess ?
                        <div>
                            <Button  type="primary"  style={{float:'right'}} onClick={()=>this.sendEmail('register')}>
                                发送激活邮件
                            </Button>
                        </div>:null}
                </Form>
            </div>

        );
    }
}
NormalLoginForm.propTypes = {
    showRegister: React.PropTypes.func,
    isHide: React.PropTypes.bool,
    hideMask: React.PropTypes.func,
    login: React.PropTypes.func,
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;