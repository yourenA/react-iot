/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class EditPoliciesForm extends Component {
    constructor(props) {
        super(props);
        this.uuid=this.props.record.topics.data.length-1;
        this.state = {
            record:this.props.record
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            record:nextProps.record
        });
    }
    add = () => {
        this.uuid++;
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid);
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

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    render() {
        const {record}=this.props;
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
        const keysArr=[]
        for(let k in record.topics.data){
            keysArr.push(parseInt(k))
        }
        getFieldDecorator('keys', {initialValue: keysArr});
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
                        initialValue: record.topics.data[k],
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
            <Form onSubmit={this.handleSubmit} >
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue:record.name || '',
                        rules: [{required: true, message: '名称不能为空'}],
                    })(
                        <Input  />
                    )}
                </FormItem>
                <FormItem
                    label="描述"
                    {...formItemLayout}>
                    {getFieldDecorator('desc', {
                        initialValue:record.description,
                    })(
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

        const value = this.props.value || {name:''};
        this.state = {
            name: value.name || '',
            authority:  value.authority ||(value.allow_publish===1&&value.allow_subscribe===1)?'2': (value.allow_publish===1&&value.allow_subscribe===-1)?'1':'0',
        };
    }
    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value || {name:''};
            this.state = {
                name: value.name || '',
                authority:value.authority || ((value.allow_publish===1&&value.allow_subscribe===1)?'2': (value.allow_publish===1&&value.allow_subscribe===-1)?'1':'0'),
            };
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
        if ('value' in this.props) {
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
const EditPoliciesFormWrap = Form.create()(EditPoliciesForm);
export default EditPoliciesFormWrap;