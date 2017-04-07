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
            <Row gutter={10}>
                <Col span={4}>
                    发布的信息
                </Col>
                <Col span={20}>
                    <div className="pubPanel" >
                        {this.props.hadPubTopics.map((item,index)=>{
                            return(
                                <div key={index}>
                                    <p><span >时间: {item.dateTime } </span><span>主题: {item.topic}</span><span>QoS: {item.QoS}</span></p>
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
const ShowPublicInfoPanel = Form.create()(ShowPublicInfo);
export default ShowPublicInfoPanel;
