/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const FormItem = Form.Item;
class subPanelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const retainLayout = {
            wrapperCol: {span: 24},
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={24}>
                            <FormItem
                                {...retainLayout}
                            >
                                {getFieldDecorator('info', {
                                })(
                                    <Input  type="textarea"  autosize={{ minRows: 18, maxRows: 18 }}/>
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
const subPanelFormPanel = Form.create()(subPanelForm);
export default subPanelFormPanel;
