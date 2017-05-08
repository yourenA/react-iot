/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
const FormItem = Form.Item;

class AddOrEditNamedescForm extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', {
                        initialValue: this.props.name || '',
                        rules: [{required: true, message: '请输入名称'}],
                    })(
                        <Input  placeholder="名称"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('description', {
                        initialValue: this.props.description || '',
                    })(
                        <Input type="textarea" placeholder="描述"/>
                    )}
                </FormItem>
                {this.props.type === 'endpoint' ?
                    <p>名称和描述不是必须的，名称相当于昵称</p>
                    : null}
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNamedescForm);
export default WrappedForm;
