/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Radio, Input, Tabs, Checkbox, Select, Col, Row, InputNumber} from 'antd';
const Option = Select.Option
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
import ShowJsonParamInfoPanel from './showJsonParam'
class PublishPanelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    changeInputInfoType = (key)=> {
        console.log("key", key)
        this.props.changeInputInfoType(key)
    }
    changeAutoType = (e)=> {
        this.props.changeAutoType(e.target.value)
    }

    render() {
        const {getFieldDecorator} = this.props.form;
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
        const timesLayout = {
            labelCol: {span: 14},
            wrapperCol: {span: 10},
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            marginBottom: '26px',
            lineHeight: '30px',
        };
        return (
            <div>
                <ShowJsonParamInfoPanel getJsonParam={this.props.getJsonParam} jsonParam={this.props.jsonParam}/>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={4} style={{textAlign: 'right', top: '60px', position: 'relative'}}>
                            发布信息
                        </Col>
                        <Col span={20}>
                            <Tabs onChange={this.changeInputInfoType} activeKey={this.props.inputInfoType}>
                                <TabPane tab="手动" key="manual">
                                    <FormItem>
                                        {getFieldDecorator('info', {})(
                                            <Input type="textarea" autosize={{minRows: 3, maxRows: 3}}/>
                                        )}
                                    </FormItem>
                                </TabPane>
                                <TabPane tab="自动" key="auto">
                                    <Row gutter={10}>
                                        <Col span={4}>
                                            <RadioGroup onChange={this.changeAutoType} value={this.props.autoInputType}>
                                                <Radio style={radioStyle} value='dataRange'>数据范围</Radio>
                                                <Radio style={radioStyle} value='dateFlow'>数据流</Radio>
                                            </RadioGroup>
                                        </Col>
                                        <Col span={20}>
                                            <Row>
                                                <Col span={6}>
                                                    <FormItem>
                                                        {getFieldDecorator('min', {
                                                            initialValue: 20,
                                                        })(
                                                            <Input type="number"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={1}>
                                                    <div style={{marginTop: '6px', textAlign: 'center'}}>
                                                        --
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <FormItem>
                                                        {getFieldDecorator('max', {
                                                            initialValue: 200,
                                                        })(
                                                            <Input type="number"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={10}>
                                                    <FormItem
                                                        {...qosLayout}
                                                        label="精度"
                                                        colon={false}>
                                                        {getFieldDecorator('accuracy', {
                                                            initialValue: '1',
                                                        })(
                                                            <Select >
                                                                <Option value="1">整数</Option>
                                                                <Option value="0.1">一位小数</Option>
                                                                <Option value="0.01">两位小数</Option>
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={23}>
                                                    <FormItem>
                                                        {getFieldDecorator('dataFlowInfo', {})(
                                                            <Input placeholder="请使用逗号分隔"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={9} offset={4}>

                                            <FormItem
                                                {...themeLayout}
                                                label="时间间隔"
                                                colon={false}>
                                                {getFieldDecorator('interval', {
                                                    initialValue: 10,
                                                    rules: [{
                                                        type: 'integer', message: '必须为整数',
                                                    }, {
                                                        required: true, message: '次数3-100W之间',
                                                    }]
                                                })(
                                                    <InputNumber
                                                        min={1}
                                                        max={120}/>
                                                )}
                                                <span className="ant-form-text"> 秒</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem
                                                {...timesLayout}
                                                label="发送次数"
                                                colon={false}>
                                                {getFieldDecorator('times', {
                                                    initialValue: 100,
                                                    rules: [{
                                                        type: 'integer', message: '必须为整数',
                                                    }, {
                                                        required: true, message: '次数3-100W之间',
                                                    }]
                                                })(
                                                    <InputNumber
                                                        min={3}
                                                        max={1000000}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={3} offset={3}>
                                            <FormItem
                                                {...retainLayout}
                                            >
                                                {getFieldDecorator('random', {
                                                    valuePropName: 'checked',
                                                    initialValue: true,
                                                })(
                                                    <Checkbox>随机</Checkbox>
                                                )}

                                            </FormItem>
                                        </Col>

                                    </Row>
                                </TabPane>
                            </Tabs>
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
