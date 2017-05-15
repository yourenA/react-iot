/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Col, Row} from 'antd';
class ShowPublicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Row gutter={10}>
                <Col span={4} style={{textAlign:'right'}}>
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
