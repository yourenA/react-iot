import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';
const FormItem = Form.Item;
import './login.scss';
import $ from 'jquery'


class NormalLoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const that =this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                $.ajax({
                    url: 'http://local.iothub.com.cn/login',
                    method: 'POST',
                    data: {username:values.username,password:values.password},
                    success: function(msg){
                        // console.log(msg);
                        sessionStorage.setItem('username',values.username);
                        sessionStorage.setItem('usertoken',msg.token);
                        message.success("登陆成功");
                        if(values.remember === true){
                            localStorage.setItem('username',values.username);
                            localStorage.setItem('usertoken',msg.token);
                        }
                        that.props.hideMask();
                        that.props.login(values.username)
                    },
                    error:function (XMLHttpRequest) {
                        message.error(XMLHttpRequest.responseJSON.message);
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const display = this.props.isHide ? 'none' : 'block';
        return (
            <div id="components-form-demo-normal-login" style={{display: display}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input addonBefore={<Icon type="user"/>} placeholder="Username"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input your Password!'}],
                        })(
                            <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="Password"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <a className="login-form-forgot">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a>register now!</a>
                    </FormItem>
                </Form>
            </div>

        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;