/**
 * Created by Administrator on 2017/3/28.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import {formItemLayout} from './../../common/common'
class AddSubPanelForm extends Component {
    constructor(props) {
        super(props);
        this.uuid=this.props.hadSubTopics.length-1;
        this.state = {};
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
        const keysArr=[];
        const hadSubTopicsLen=this.props.hadSubTopics.length;
        for(let k in this.props.hadSubTopics){
            keysArr.push(parseInt(k))
        }
        getFieldDecorator('keys', {initialValue: keysArr});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <FormItem
                    required={false}
                    key={k}>
                    {getFieldDecorator(`topics-${k}`, {
                        initialValue: {theme: '', QoS: '0'},
                    })(<ThemeInput />)}
                    {
                        k>=hadSubTopicsLen? <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                        />:null
                    }

                </FormItem>
            );
        });
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    {formItems}
                    <FormItem >
                        <Button type="primary" onClick={this.add} style={{width: '95%'}}>
                            <Icon type="plus"/> 增加主题
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
            ;
    }
}
class ThemeInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            theme: value.theme || '',
            QoS: value.QoS || "0",
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
        const theme = e.target.value;
        if (!('value' in this.props)) {
            this.setState({theme});
        }
        this.triggerChange({theme});
    }
    handleCurrencyChange = (QoS) => {
        if (!('value' in this.props)) {
            this.setState({QoS});
        }
        this.triggerChange({QoS});
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
            value={state.theme}
            onChange={this.handleNumberChange}
            style={{width: '60%', marginRight: '3%'}}
        />
        <Select
            value={state.QoS}
            size={size}
            style={{width: '25%', marginRight: '2%'}}
            onChange={this.handleCurrencyChange}
        >
          <Option value="0">QoS_0</Option>
          <Option value="1">QoS_1</Option>
        </Select>
      </span>
        );
    }
}

const AddSubPanelFormWrap = Form.create()(AddSubPanelForm);
export default AddSubPanelFormWrap;