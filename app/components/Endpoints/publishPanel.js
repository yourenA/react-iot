/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const Option=Select.Option
const FormItem = Form.Item;
class PublishPanelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const infoLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };
        const themeLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const qosLayout = {
            labelCol: {span: 12},
            wrapperCol: {span: 12},
        };
        const retainLayout = {
            wrapperCol: {span: 24},
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem
                                {...themeLayout}
                                label="发布主题"
                            >
                                {getFieldDecorator('topic', {
                                    rules: [{required: true, message: '发布主题不能为空'}],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...qosLayout}
                                label="QoS"
                            >
                                {getFieldDecorator('QoS', {
                                    rules: [{required: true, message: 'QoS不能为空'}],
                                })(
                                    <Select placeholder="">
                                        <Option value="0">0</Option>
                                        <Option value="1">1</Option>
                                    </Select>
                                )}

                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                {...retainLayout}
                            >
                                {getFieldDecorator('retain', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>retain</Checkbox>
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={24}>
                            <FormItem
                                {...infoLayout}
                                label="发布信息"
                            >
                                {getFieldDecorator('info', {
                                })(
                                    <Input  type="textarea"  autosize={{ minRows: 3, maxRows: 3 }}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
            ;
    }
}
const PublishPanel = Form.create()(PublishPanelForm);
export default PublishPanel;
