/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchEndPoints} from '../../actions/endpoints';
import {Modal, Input, Icon, Breadcrumb, Row, DatePicker, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router'
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import AddOrNameDescForm from './../Common/addOrEditNameDesc';
import SearchWrap from './../Common/search';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';

import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.endpoints,
)
class EndPoints extends Component {
    static fetch(state, dispatch, page,q,start_at,end_at,order) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchEndPoints(page,q,start_at,end_at,order))
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


    showEditDesc=(uuid,name,desc)=>{
        this.setState({
            editDescModal:true,
            editDescName:name,
            editDesc:desc,
            editDescuuid:uuid
        })
    };
    handleEditDescOk=()=>{
        const { page ,q,start_at,end_at,order} = this.props;
        const that=this;
        const AddOrEditEndpointForm=this.refs.AddOrEditEndpointForm.getFieldsValue();
        axios({
            url:`${configJson.prefix}/endpoints/${this.state.editDescuuid}`,
            method: 'put',
            data: AddOrEditEndpointForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal:false,
                });
                message.success(messageJson['edit endpoint desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    addEndPoint=()=>{
        const { page ,q,start_at,end_at,order} = this.props;
        const that=this;
        const AddOrEditEndpointForm=this.refs.AddOrEditEndpointForm.getFieldsValue();
        console.log("getFieldsValue();",AddOrEditEndpointForm);
        axios({
            url:`${configJson.prefix}/endpoints`,
            method: 'post',
            data: AddOrEditEndpointForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal:false,
                });
                message.success(messageJson['add endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    delEndPoint=(uuid)=>{
        console.log("uuid",uuid);
        const { page ,q,start_at,end_at,order} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/endpoints/${uuid}`,
            method: 'delete',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });

    };

    onChangeSearch=( page ,q,start_at,end_at,order)=>{
        this.constructor.fetch(this.props, this.props.dispatch,page ,q,start_at,end_at,order);

    }

    onPageChange = (page) => {
        const { q,start_at,end_at,order} = this.props;
        this.constructor.fetch(this.props, this.props.dispatch, page,q,start_at,end_at,order);
    };

    render() {
        const {data = [], page, q,meta={pagination:{total:0,per_page:0}},loaded} = this.props;
        const columns = [{
            title: '域名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                        <Link  to={'/basic/endpoints/'+record.uuid} title={text}>{text}</Link>

                )
            }
        },{
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => {
                return (
                    <div className="line-clamp3 line-edit">
                        <span title={text}>{text}</span><Icon type="edit" onClick={this.showEditDesc.bind(this,record.uuid,record.name,record.description)}/>
                    </div>

                )
            }
        }, {
            title: '接入地址',
            dataIndex: 'websocket_hostname',
            key: 'websocket_hostname',
            render:(text,record,index)=>{
                return(
                    <div>
                        <p>{text}</p>
                        <p>{record.mqtt_hostname}</p>
                    </div>
                )
            }
        },  {
            title: '设备总数',
            dataIndex: 'device_count',
            key: 'device_count',
        },  {
            title: '在线设备数',
            dataIndex: 'device_online_count',
            key: 'device_online_count',
        },{
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        }, {
            title: '操作',
            key: 'action',
            width:70,
            render: (text, record, index) => {
                return (
                    <div>
                        <Popconfirm   placement="topRight" title={ `确定要删除 ${record.name} 吗?`} onConfirm={this.delEndPoint.bind(this,record.uuid)}>
                            <button className="ant-btn ant-btn-danger " data-id={record.uuid}
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
                            <Breadcrumb.Item >设备域</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.props} />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>创建域</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        key={1+Date.parse(new Date())}
                        visible={this.state.addModal}
                        title="创建新域"
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addEndPoint}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrNameDescForm ref="AddOrEditEndpointForm" type="endpoint"/>
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
                        <AddOrNameDescForm ref="AddOrEditEndpointForm"   type="endpoint" name={this.state.editDescName} description={this.state.editDesc}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default EndPoints;
