/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchEndPoints} from '../../actions/endpoints';
import {Modal, Input, Icon, Alert, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
import {connect} from 'react-redux';
import axios from 'axios';
import messageJson from './../../common/message.json';
import {getHeader} from './../../common/common.js';
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
            addModal:false,
            addEndpointName:''
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
    changeEndpointName=(e)=>{
        this.setState({
            addEndpointName:e.target.value
        })
    };
    addEndPoints=()=>{
        const { page } = this.props;
        const that=this;
        axios({
            url:'http://local.iothub.com.cn/endpoints',
            method: 'post',
            data: {
                name: this.state.addEndpointName,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal:false,
                    addEndpointName:''
                });
                message.success(messageJson['add endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page);
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 422 ){
                    message.error(error.response.data.errors.name[0]);
                }else if(error.response.status === 401){
                    message.error(messageJson['token fail']);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });

    };
    delEndPoints=(name)=>{
        console.log("name",name);
        const { page } = this.props;
        const that=this;
        axios({
            url:`http://local.iothub.com.cn/endpoints/${name}`,
            method: 'delete',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page);
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 404 ){
                    message.error(messageJson['del endpoint fail']);
                }else if(error.response.status === 401){
                    message.error(messageJson['token fail']);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });

    }
    render() {
        const {data = [], page, meta={pagination:{total:0,per_page:0}}} = this.props;
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
                        <Popconfirm title={'Sure to delete ' + record.uuid} onConfirm={this.delEndPoints.bind(this,record.name)}>
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
                        <Button type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>新建实例</Button>
                        <Table rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModal}
                        title="新增实例"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addEndPoints}>
                                确定
                            </Button>,
                        ]}
                    >
                        <Input onChange={this.changeEndpointName} defaultValue={this.state.addEndpointName} placeholder="实例名称(不能与现有实例名称重复)" />
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default EndPoints;
