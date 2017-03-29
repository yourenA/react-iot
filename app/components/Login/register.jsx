import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,Row ,Col ,message} from 'antd';
const FormItem = Form.Item;
import './login.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
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
        const { getFieldDecorator } = this.props.form;
        const display=this.props.isHide ? 'none': 'block';
        return (
            <div id="components-form-demo-normal-login"  style={{display:display}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    {/*<FormItem   >*/}
                        {/*<Row gutter={8}>*/}
                            {/*<Col span={15}>*/}
                                {/*<Input style={{ borderColor: this.state.emailState?'':'#f04134',boxShadow: this.state.emailState?'':'none'}}  defaultValue={this.state.email} onChange={this.changeEmail} placeholder="Input you email" />*/}
                            {/*</Col>*/}
                            {/*<Col span={9}>*/}
                                {/*<Button style={{float:'right'}} onClick={this.getVerifyCode}>获取验证码</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*</FormItem>*/}
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ type: 'email', message: 'The input is not valid E-mail!'},{ required: true, message: 'Please input your username!' }],
                        })(
                            <Row gutter={8}>
                            <Col span={15}>
                            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                            </Col>
                            <Col span={9}>
                            <Button style={{float:'right'}} onClick={this.getVerifyCode}>获取验证码</Button>
                            </Col>
                                </Row>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password_confirmation', {
                            rules: [{ required: true, message: 'Please repeatPassword your Password!' }],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Repeat Password" />
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('verify_code', {
                            rules: [{ required: true, message: 'Please input the right email verify_code' }],
                        })(
                            <Input  addonBefore={<Icon type="mail" />} type="password" placeholder="Email verify code" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button  type="primary" htmlType="submit" className="login-form-button">
                            Register
                        </Button>
                        Or <a onClick={this.props.showLogin}>login now!</a>
                    </FormItem>
                </Form>
            </div>

        );
    }
}
NormalLoginForm.propTypes = {
    isHide: React.PropTypes.bool,
    hideMask: React.PropTypes.func,
    showLogin: React.PropTypes.func,
};
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;