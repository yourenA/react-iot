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
                        rules: [{required: true, message: 'Please input your username!'}],
                    })(
                        <Input disabled={this.props.name ? true : false} placeholder="名称:长度3-32个字符"/>
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
                    <p>说明：名称只能由英文字母、数字、“_”(下划线)、“-”（即中横线）构成。“-” 不能单独或连续使用，不能放在开头或结尾。</p>
                    : null}
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNamedescForm);
export default WrappedForm;
