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

class EditCompany extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        const {form} = this.props;
        axios({
            url:`${configJson.prefix}/company`,
            method: 'get',
            headers:getHeader()
        }) .then(function (response) {
            console.log(response);
            form.setFieldsValue({
                name:response.data.name,
                telephone:response.data.telephone,
                address:response.data.address
            });
        })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const that =this;
        const {form} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                axios({
                    url:`${configJson.prefix}/company`,
                    method: 'put',
                    data:values,
                    headers:getHeader()
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['edit company success']);
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
                        label="机构名称"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('name', {
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        label="电话"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('telephone')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="地址"
                        {...formItemLayoutForOrganize}>
                        {getFieldDecorator('address')(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" style={{width:'100%'}} htmlType="submit" className="login-form-button">
                            确定修改资料
                        </Button>
                    </FormItem>
                </Form>
            </div>

        );
    }
}

const EditCompanyWrap = Form.create()(EditCompany);

export default EditCompanyWrap;