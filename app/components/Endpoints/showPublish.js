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
    componentDidMount=()=>{
        let info = document.querySelector("#info");
        info.scrollTop = info.scrollHeight;
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
                    <div id="info" style={{
                        width: '100%',
                        padding: '10px',
                        height: '300px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        overflowY: 'scroll'
                    }}>
                        {this.props.publishInfo.map((item,index)=>{
                            return(
                                <p key={index}><span>{item.name }:say </span><span>{item.message}</span><span>{item.date}</span></p>
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
