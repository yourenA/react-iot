/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Form, Col, Row} from 'antd';
class showJsonParam extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.editor=null
    }
    componentDidMount(){
        const container = document.getElementById('jsoneditor');
        const options = {
            mode: 'code',
            modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
            onChange : this.handleChange,
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
            console.log("this.editor.get()",this.editor.get());
            this.props.getJsonParam(this.editor.get());
        } catch (e) {
            // HACK! This should propagate the error somehow
            console.error(e);
        }
    }
    render() {
        return (
            <Row gutter={10}>
                <Col span={4} style={{textAlign:'right'}}>
                    参数资源
                </Col>
                <Col span={20}>
                    <div className=" JsonPanel" >
                        <div
                            id='jsoneditor'
                            ref={(ref) => { this.editorRef = ref; }}
                            style={{ height:'300px', width:'100%' }}
                        />
                    </div>
                </Col>
            </Row>
        )
    }
}
const showJsonParamInfoPanel = Form.create()(showJsonParam);
export default showJsonParamInfoPanel;
