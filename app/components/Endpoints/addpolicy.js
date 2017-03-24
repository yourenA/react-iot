/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, message, Select} from 'antd';
import {formItemLayout, formItemLayoutWithLabel, formItemLayoutWithOutLabel} from './../../common/common'
const FormItem = Form.Item;
const Option = Select.Option;
import configJson from './../../../config.json';
import messageJson from './../../common/message.json';
import axios from 'axios';
import {getHeader,convertFormToData,converErrorCodeToMsg} from './../../common/common.js';
let uuid = 0;
class AddPoliciesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    add = () => {
        uuid++;
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    remove = (k) => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    handleSubmitCategory = (e)=> {
        e.preventDefault();
        console.log("提交策略");
        const that=this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const addPoliciesDate = convertFormToData(values);

                axios({
                    url: `${configJson.prefix}/endpoints/${this.props.endpoint_uuid}/policies`,
                    method: 'post',
                    data: addPoliciesDate,
                    headers:getHeader()
                })
                    .then(function (response) {
                        message.success(messageJson['add policies success']);
                        that.props.addNewcb('policy',response.data.name,response.data.uuid)
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }
        });
    }
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        getFieldDecorator('keys', {initialValue: []});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const layout = index === 0 ? formItemLayoutWithLabel : formItemLayoutWithOutLabel;
            return (
                <FormItem
                    {...layout}
                    label={index === 0 ? '主题' : ''}
                    required={false}
                    key={k}>
                    {getFieldDecorator(`topics-${k}`, {
                        initialValue: {name: '', authority: '0'},
                    })(<ThemeInput />)}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                </FormItem>
            );
        });
        return (
            <Form onSubmit={this.handleSubmitCategory}>
                {this.props.fromOtherPage ? <h3 className="addDeviceForm-title">添加策略</h3> : null}
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
                    {getFieldDecorator('desc', {})(
                        <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
                    )}
                </FormItem>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="primary" onClick={this.add} style={{width: '60%'}}>
                        <Icon type="plus"/> 增加主题
                    </Button>
                </FormItem>
                {this.props.fromOtherPage ? <FormItem
                    {...formItemLayoutWithOutLabel}
                >
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </FormItem> : null}
            </Form>
        );
    }
}

class ThemeInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            name: value.name || '',
            authority: value.authority || "0",
        };
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    handleNumberChange = (e) => {
        const name = e.target.value;
        if (!('value' in this.props)) {
            this.setState({name});
        }
        this.triggerChange({name});
    }
    handleCurrencyChange = (authority) => {
        if (!('value' in this.props)) {
            this.setState({authority});
        }
        this.triggerChange({authority});
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        const {size} = this.props;
        const state = this.state;
        return (
            <span>
        <Input
            type="text"
            size={size}
            value={state.name}
            onChange={this.handleNumberChange}
            style={{width: '45%', marginRight: '3%'}}
        />
        <Select
            value={state.authority}
            size={size}
            style={{width: '25%', marginRight: '2%'}}
            onChange={this.handleCurrencyChange}
        >
          <Option value="0">订阅</Option>
          <Option value="1">发布</Option>
          <Option value="2">订阅+发布</Option>
        </Select>
      </span>
        );
    }
}
const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default AddPoliciesFormWrap;