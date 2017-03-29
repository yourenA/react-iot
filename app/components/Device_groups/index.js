/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchDevice_groups} from '../../actions/device_groups';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import AddOrNameDescForm from './../Common/addOrEditNameDesc'
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';

import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.device_groups,
)
class DeviceGroups extends Component {
    static fetch(state, dispatch, page,q) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchDevice_groups(page,q))
        );
        return fetchTasks
    }
    constructor(props) {
        super(props);
        this.state = {
            addModal:false,
            editDescModal:false,
            editDescName:'',
            editDescuuid:'',
            editDesc:'',
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
        const { q} = this.props;

        this.constructor.fetch(this.props, this.props.dispatch, page,q);
    };
    showEditDesc=(uuid,name,desc)=>{
        this.setState({
            editDescModal:true,
            editDescName:name,
            editDesc:desc,
            editDescuuid:uuid
        })
    };
    handleEditDescOk=()=>{
        const AddOrEditEndpointForm=this.refs.AddOrEditGroupForm.getFieldsValue();
        const { page,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_groups/${this.state.editDescuuid}`,
            method: 'put',
            data: AddOrEditEndpointForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal:false,
                });
                message.success(messageJson['edit device_groups desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)

            });
    }
    addDevice_category=()=>{
        const AddOrEditGroupForm=this.refs.AddOrEditGroupForm.getFieldsValue();
        const { page,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_groups`,
            method: 'post',
            data: AddOrEditGroupForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal:false,
                });
                message.success(messageJson['add device_groups success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);

            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    delEndPoint=(uuid)=>{
        console.log("uuid",uuid);
        const { page ,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_groups/${uuid}`,
            method: 'DELETE',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device_groups success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });

    };
    searchEndPoint=(value)=>{
        this.constructor.fetch(this.props, this.props.dispatch, 1,value);
    };
    render() {
        const {data = [], page, q,meta={pagination:{total:0,per_page:0}},loaded} = this.props;
        const columns = [{
            title: '类型名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => {
                return (
                    <div className="line-clamp3 line-edit">
                        <span  title={text}>{text}</span><Icon type="edit" onClick={this.showEditDesc.bind(this,record.uuid,record.name,record.description)}/>
                    </div>

                )
            }
        },{
            title: '操作',
            key: 'action',
            width:70,
            render: (text, record, index) => {
                return (
                    <div>

                        <Popconfirm   placement="topRight" title={ `确定要删除 ${record.name} 吗?`}onConfirm={this.delEndPoint.bind(this,record.uuid)}>
                            <button className="ant-btn ant-btn-danger" data-id={record.uuid}
                            >删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '20px'}}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                            <Breadcrumb.Item >分组管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{ width: 200 }}
                                onSearch={value => this.searchEndPoint(value)}
                            />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>增加新设备组</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        key={1+Date.parse(new Date())}
                        visible={this.state.addModal}
                        title="创建新设备组"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addDevice_category} >
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrNameDescForm ref="AddOrEditGroupForm" />
                    </Modal>
                    <Modal
                        key={2+Date.parse(new Date())}
                        visible={this.state.editDescModal}
                        title="修改描述"
                        onCancel={()=>{this.setState({editDescModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({editDescModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.handleEditDescOk}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrNameDescForm ref="AddOrEditGroupForm" name={this.state.editDescName} type='group'  description={this.state.editDesc}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default DeviceGroups;
