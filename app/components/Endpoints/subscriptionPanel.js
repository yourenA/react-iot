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
                    <div className="subPanel" >
                        {this.props.subTopicsInfo.map((item,index)=>{
                            return(
                                <div key={index}>
                                    <p key={index}><span >时间: {item.dateTime } </span><span>主题: {item.topic}</span><span>QoS: {item.qos}</span></p>
                                    <p>{item.info}</p>
                                </div>
                            )
                        })}
                    </div>
                </Col>
            </Row>
        )
    }
}
const subPanelFormPanel = Form.create()(subPanelForm);
export default subPanelFormPanel;
