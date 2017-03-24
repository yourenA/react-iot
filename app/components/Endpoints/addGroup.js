/**
 * Created by Administrator on 2017/3/23.
 */
import React, {Component} from 'react';
import { Form, Input, Button,message } from 'antd';
const FormItem = Form.Item;
import {formItemLayout, formItemLayoutWithLabel, formItemLayoutWithOutLabel} from './../../common/common'
import configJson from './../../../config.json';
import messageJson from './../../common/message.json';
import axios from 'axios';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';
class AddGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleSubmitCategory = (e)=> {
        e.preventDefault();
        console.log("提交分组");
        const that=this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios({
                    url:`${configJson.prefix}/device_groups`,
                    method: 'post',
                    data: values,
                    headers:getHeader()
                })
                    .then(function (response) {
                        message.success(messageJson['add device_groups success']);
                        that.props.addNewcb('group',response.data.name,response.data.uuid)
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }
        });
    }
    render(){
        const {getFieldDecorator, getFieldValue} = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmitCategory}>
                    <h3 className="addDeviceForm-title">添加设备分组</h3>
                    <FormItem
                        label="名称"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '名称不能为空'}],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        label="描述"
                        {...formItemLayout}>
                        {getFieldDecorator('description', {})(
                            <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutWithOutLabel}
                    >
                        <Button type="primary" htmlType="submit" >
                            提交
                        </Button>
                    </FormItem>

                </Form>
            </div>
        )
    }
}

const AddGroupWrap = Form.create()(AddGroup);
export default AddGroupWrap;