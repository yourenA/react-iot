import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';
const FormItem = Form.Item;
import './login.scss';

class NormalLoginForm extends Component {
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

    render() {
        const {getFieldDecorator} = this.props.form;
        const display = this.props.isHide ? 'none' : 'block';
        return (
            <div className="components-form-demo-normal-login" style={{display: display}}>
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
                        Or <a onClick={this.props.showRegister}>register now!</a>
                    </FormItem>
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