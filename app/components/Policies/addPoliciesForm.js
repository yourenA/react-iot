/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;
class AddDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
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
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const formItemLayoutWithLabel = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 18, offset: 6},
            },
        };
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
                        initialValue: { name: '', authority: '0' },
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
            <Form onSubmit={this.handleSubmit} className="login-form">
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
        const name = e.target.value ;
        if (!('value' in this.props)) {
            this.setState({ name });
        }
        this.triggerChange({ name });
    }
    handleCurrencyChange = (authority) => {
        if (!('value' in this.props)) {
            this.setState({ authority });
        }
        this.triggerChange({ authority });
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }
    render() {
        const { size } = this.props;
        const state = this.state;
        return (
            <span>
        <Input
            type="text"
            size={size}
            value={state.name}
            onChange={this.handleNumberChange}
            style={{ width: '45%', marginRight: '3%' }}
        />
        <Select
            value={state.authority}
            size={size}
            style={{ width: '25%' , marginRight: '2%' }}
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
const AddDetailFormWrap = Form.create()(AddDetailForm);
export default AddDetailFormWrap;