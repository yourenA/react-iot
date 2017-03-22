/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import { Form, Icon, Input, Button, Checkbox,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;
class AddDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newStrategy:false,
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    handleStrategyChange=(value)=>{
        console.log(value);
        if(value==='new'){
            console.log('新建');
            this.setState({
                newStrategy:true
            })
        }else{
            this.setState({
                newStrategy:false
            })
        }
    };
    add = () => {
        uuid++;
        const { form } = this.props;
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
        const { form } = this.props;
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
        const { getFieldDecorator,getFieldValue  } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formItemLayoutWithLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 6 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const layout=index ===0?formItemLayoutWithLabel:formItemLayoutWithOutLabel;
            return (
                this.state.newStrategy?
                <FormItem
                    {...layout}
                    label={index === 0 ? '主题' : ''}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`names-${k}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入主题名称",
                        }],
                    })(
                        <Input placeholder="passenger name" style={{ width: '50%', marginRight: 5 }} />

                    )}
                    <Select
                        value={'订阅'}
                        style={{ width: '22%',marginRight:5 }}
                    >
                        <Option value="rmb">订阅</Option>
                        <Option value="dollar">发布</Option>
                        <Option value="dollarname">订阅+发布</Option>
                    </Select>
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                </FormItem>:null
            );
        });
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '名称不能为空' }],
                    })(
                        <Input  />
                    )}
                </FormItem>
                <FormItem
                    label="描述"
                    {...formItemLayout}>
                    {getFieldDecorator('desc', {
                    })(
                        <Input  type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设备组"
                    hasFeedback
                >
                    {getFieldDecorator('select', {
                        rules: [
                            { required: true, message: 'Please select your country!' },
                        ],
                    })(
                        <Select
                            onChange={(value)=>{console.log(value)}}
                            tags
                            placeholder="请选择一个设备组或输入选择新建设备组">
                            <Option value="china">China</Option>
                            <Option value="use">U.S.A</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="策略"
                    hasFeedback
                >
                    {getFieldDecorator('strategy', {
                        rules: [
                            { required: true, message: 'Please select your country!' },
                        ],
                        onChange: this.handleStrategyChange,
                    })(
                        <Select
                            placeholder="请选择一个策略">
                            <Option value="china">China</Option>
                            <Option value="use">U.S.A</Option>
                            <Option value="new">新建</Option>
                        </Select>
                    )}
                </FormItem>
                {formItems}
                {this.state.newStrategy?
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="primary" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 增加主题
                        </Button>
                    </FormItem>
                :null}



            </Form>
        );
    }
}

const AddDetailFormWrap = Form.create()(AddDetailForm);
export default AddDetailFormWrap;