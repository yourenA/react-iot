import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,Row ,Col ,message} from 'antd';
const FormItem = Form.Item;
import './login.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'2373638339@qq.com',
            emailState:true
        };
    }
    handleSubmit = (e) => {
        const that=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios({
                    url:'http://test.iothub.com.cn//register',
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
                        if(error.response.status === 422 ){
                            if(error.response.data.errors.username && error.response.data.errors.username.length){
                                message.error(error.response.data.errors.username[0]);
                            }else if(error.response.data.errors.password && error.response.data.errors.password.length){
                                message.error(error.response.data.errors.password[0]);

                            }else if(error.response.data.errors.verify_code && error.response.data.errors.verify_code.length){
                                message.error(error.response.data.errors.verify_code[0]);
                            }
                        }else{
                            message.error(messageJson['unknown error']);
                        }
                    });
            }

        });
    };
    changeEmail=(e)=>{
        const emailRegex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        const email=e.target.value;
        this.setState({
            email:email
        })
        if( !emailRegex.test( email )){
            this.setState({
                emailState:false
            })
        }else{
            this.setState({
                emailState:true
            })
        }
    };
    getVerifyCode=()=>{
        const that=this;
        if( this.state.emailState && this.state.email !==''){
            axios({
                url:'http://test.iothub.com.cn/register/verify_code',
                method: 'post',
                data: {
                    username: this.state.email,
                }
            })
                .then(function (response) {
                    console.log(response);
                    message.success(messageJson['send email success']);
                })
                .catch(function (error) {
                    console.log(error.response.data.message);
                    if(error.response.status === 422 ){
                        message.error(messageJson['send email fail']);
                    }else if(error.response.status === 429){
                        message.error(error.response.data.message);
                    }else{
                        message.error(messageJson['unknown error']);
                    }
                });
        }else{
            message.error(messageJson['send email fail']);
        }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const display=this.props.isHide ? 'none': 'block';
        return (
            <div id="components-form-demo-normal-login"  style={{display:display}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
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
                    <FormItem   >
                        <Row gutter={8}>
                            <Col span={15}>
                                    <Input style={{ borderColor: this.state.emailState?'':'#f04134',boxShadow: this.state.emailState?'':'none'}}  defaultValue={this.state.email} onChange={this.changeEmail} placeholder="Input you email" />
                            </Col>
                            <Col span={9}>
                                <Button style={{float:'right'}} onClick={this.getVerifyCode}>获取验证码</Button>
                            </Col>
                        </Row>
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