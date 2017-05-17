/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Input, Col, Row,Alert,Form} from 'antd';
const FormItem = Form.Item;
import {formItemLayoutForOrganize} from './../../common/common';
class showJsonParam extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.editor = null
    }

    componentDidMount() {
        const container = document.getElementById('jsoneditor');
        const options = {
            mode: 'code',
            modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
            onChange: this.handleChange,
            onError: function (err) {
                alert(err.toString());
            },
            onModeChange: function (newMode, oldMode) {
                console.log('Mode switched from', oldMode, 'to', newMode);
            }
        };
        this.editor = new JSONEditor(container, options, this.props.jsonParam);
    }

    handleChange = () => {
        try {
            console.log("this.editor.get()", this.editor.get());
            this.props.getJsonParam(this.editor.get());
        } catch (e) {
            // HACK! This should propagate the error somehow
            console.error(e);
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row gutter={10}>
                <Col span={24}>
                    <Alert message="*注：使用json格式填写，首次发送会激活设备。" type="info" />
                    <div className=" JsonPanel">
                        <div
                            id='jsoneditor'
                            ref={(ref) => {
                                this.editorRef = ref;
                            }}
                            style={{height: '300px', width: '100%'}}
                        />
                    </div>
                    <Form onSubmit={this.handleSubmit} className="">
                        <FormItem
                            label="类型"
                            {...formItemLayoutForOrganize}>
                            {getFieldDecorator('type', {
                                initialValue: 'type-1',
                                rules: [
                                    {required: true, message: '请输入类型'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label="序列号"
                            {...formItemLayoutForOrganize}>
                            {getFieldDecorator('serial_no', {
                                initialValue: 'xxxxxx-xxx-xxx',
                                rules: [{required: true, message: '请输入序列号'}],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Form>

                </Col>
            </Row>
        )
    }
}

const WrappedShowJsonParam = Form.create()(showJsonParam);

export default WrappedShowJsonParam;
