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
        return (
            <Row gutter={10}>
                <Col span={24}>
                    <div style={{
                        width: '100%',
                        padding: '10px',
                        height: '350px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        overflowY:'scroll'
                    }}></div>
                </Col>
            </Row>
        )
    }
}
const subPanelFormPanel = Form.create()(subPanelForm);
export default subPanelFormPanel;
