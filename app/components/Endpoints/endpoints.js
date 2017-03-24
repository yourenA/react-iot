/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchEndPoints} from '../../actions/endpoints';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router'
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';

import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.endpoints,
)
class EndPoints extends Component {
    static fetch(state, dispatch, page,q) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchEndPoints(page,q))
        );
        return fetchTasks
    }
    constructor(props) {
        super(props);
        this.state = {
            addModal:false,
            editDescModal:false,
            addEndpointName:'',
            addEndpointDesc:'',
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
    changeEndpointName=(e)=>{
        this.setState({
            addEndpointName:e.target.value
        })
    };
    changeEndpointDesc=(e)=>{
        this.setState({
            addEndpointDesc:e.target.value
        })
    };
    changeEditDesc=(e)=>{
        this.setState({
            editDesc:e.target.value
        })
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
        const { page,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/endpoints/${this.state.editDescuuid}`,
            method: 'put',
            data: {
                description: this.state.editDesc,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal:false,
                    editDescuuid:null
                });
                message.success(messageJson['edit endpoint desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    addEndPoint=()=>{
        const { page,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/endpoints`,
            method: 'post',
            data: {
                name: this.state.addEndpointName,
                description: this.state.addEndpointDesc,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal:false,
                    addEndpointName:'',
                    addEndpointDesc:'',
                });
                message.success(messageJson['add endpoint success']);
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
            url:`${configJson.prefix}/endpoints/${uuid}`,
            method: 'delete',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del endpoint success']);
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
            title: '域名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                        <Link to={'/basic/endpoints/'+record.uuid} title={text}>{text}</Link>

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
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{ width: 200 }}
                                onSearch={value => this.searchEndPoint(value)}
                            />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>创建域</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModal}
                        title="创建新域"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addEndPoint}>
                                确定
                            </Button>,
                        ]}
                    >
                        <Input style={{marginBottom:'15px'}} onChange={this.changeEndpointName} value={this.state.addEndpointName} placeholder="名称:长度3-32个字符" />
                        <Input  onChange={this.changeEndpointDesc} value={this.state.addEndpointDesc} type="textarea" placeholder="描述" autosize={{ minRows: 2, maxRows: 6 }} />
                        <p>说明：名称只能由英文字母、数字、“_”(下划线)、“-”（即中横线）构成。“-” 不能单独或连续使用，不能放在开头或结尾。</p>
                    </Modal>
                    <Modal
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
                        <h3 style={{marginBottom:'10px'}}>名称 : {this.state.editDescName}</h3>
                        <Input  onChange={this.changeEditDesc} value={this.state.editDesc} type="textarea"  autosize={{ minRows: 2, maxRows: 6 }} />
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default EndPoints;
