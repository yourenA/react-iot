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
        const usernameLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...usernameLayout}
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [
                                {type: 'email', message: '请输入正确邮箱地址'},
                                {required: true, message: '请输入新建邮箱'}],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        {...usernameLayout}
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [
                                {required: true, message: '请输入密码'}],
                        })(
                            <Input type="password"/>
                        )}

                    </FormItem>
                    <FormItem
                        {...usernameLayout}
                        label="确认密码"
                    >
                        {getFieldDecorator('password_confirmation', {
                            rules: [
                                {required: true, message: '请重复密码'}],
                        })(
                            <Input type="password"/>
                        )}
                    </FormItem>
                </Form>
            </div>
        )
            ;
    }
}
const ConnectPanel = Form.create()(ConnectPanelForm);
export default ConnectPanel;
