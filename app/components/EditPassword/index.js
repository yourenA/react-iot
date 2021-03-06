/**
 * Created by Administrator on 2017/3/27.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button,message} from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';
import {formItemLayoutForOrganize} from './../../common/common';

class EditPassword extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const that =this;
        const {form} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                axios({
                    url:`${configJson.prefix}/password/reset`,
                    method: 'post',
                    data:values,
                    headers:getHeader()
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['edit password success']);
                        form.setFieldsValue({
                            old_password:'',
                            new_password:'',
                            new_password_confirmation:''
                        });
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div   className="Home edit-password">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="E-mail"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('username', {
                            initialValue:localStorage.getItem('username') ||sessionStorage.getItem('username')
                        })(
                            <Input disabled={true} />
                        )}
                    </FormItem>
                    <FormItem
                        label="原密码"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('old_password', {
                        })(
                            <Input  type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        label="新密码"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('new_password', {
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        label="重复新密码"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('new_password_confirmation', {
                        })(
                            <Input type="password"/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" style={{width:'100%'}} htmlType="submit" className="login-form-button">
                            确定修改密码
                        </Button>
                    </FormItem>
                </Form>
            </div>

        );
    }
}

const EditPasswordWrap = Form.create()(EditPassword);

export default EditPasswordWrap;