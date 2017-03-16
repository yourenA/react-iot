/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchEndPoints} from '../../actions/endpoints';
import {Modal, Input, Icon, Alert, Row, Col, Button, Table, Pagination, Popconfirm} from 'antd';
import {connect} from 'react-redux';
class EditableCell extends Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({editable: nextProps.editable});
            const set_cancel_row = this.props.set_cancel_row;
            set_cancel_row(this.state.value)
        }
    }

    handleChange(e) {
        const record = this.props.record;
        const key = this.props.keyname;
        const value = e.target.value;
        this.setState({value});
        const chagedata = Object.assign(record, {[key]: value});
        const chage_row = this.props.chage_row;
        chage_row(chagedata)
    }

    render() {
        const {value, editable} = this.state;
        return (<div>
            {
                editable ?
                    <div>
                        <Input
                            value={value}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>
                    :
                    <div className="editable-row-text">
                        {value || ' '}
                    </div>
            }
        </div>);
    }
}

@connect(
    state => state.endpoints,
)
class EndPoints extends Component {
    static fetch(state, dispatch, page) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchEndPoints(page))
        );
        return fetchTasks
    }
    constructor(props) {
        super(props);
        this.state = {
            addModel:false
        };
    }
    componentDidMount() {
        /*通过设置loaded，切换路由的时候就不会重复发送请求*/
        const {loaded} = this.props;
        if (!loaded) {
            this.constructor.fetch(this.props, this.props.dispatch)
        }
    }

    onPageChange = (page) => {
        console.log(page);
        this.constructor.fetch(this.props, this.props.dispatch, page);
    };

    render() {
        const {list, page, meta} = this.props;
        const columns = [{
            title: 'uuid',
            dataIndex: 'uuid',
            key: 'uuid',
        }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '创建于',
            dataIndex: 'created_at',
            key: 'created_at',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <Popconfirm title={'Sure to delete ' + record.uuid}>
                            <button className="ant-btn ant-btn-primary" data-id={record.uuid}
                            >Delete
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '30px'}}>
                        <Button type="primary" icon="plus" onClick={()=>{this.setState({addModel:true})}}>新建实例</Button>
                        <Table rowKey="uuid" columns={columns} dataSource={list} pagination={false}/>
                        <Pagination total={30} current={page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModel}
                        title="新增入库单"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModel:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModel:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large">
                                确定
                            </Button>,
                        ]}
                    >
                        <Input placeholder="新建入库单名称"/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default EndPoints;
