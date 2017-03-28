/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select, Col, Row} from 'antd';
const FormItem = Form.Item;
class ShowPublicInfo extends Component {
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
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={24}>
                            <FormItem
                                {...infoLayout}
                                label="发布的信息"
                            >
                                {getFieldDecorator('hostname', {
                                })(
                                    <Input  type="textarea"  autosize={{ minRows: 10, maxRows: 10 }}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
const ShowPublicInfoPanel = Form.create()(ShowPublicInfo);
export default ShowPublicInfoPanel;
