/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router'
import Loading from './../Common/loading.js';
import TopicTable from './../Common/topicTable.js';
import axios from 'axios';
import messageJson from './../../common/message.json';
import {getHeader} from './../../common/common.js';
import AddDetailForm from './addDetailForm.js'
import configJson from './../../../config.json';
const datasource=[{
    uuid:'daxpopd-fa-ff00',
    name:'temp01',
    user:'user01',
    desc:'desc',
    status:1,
    type:2,
    last_on_time:'2017-3-21 16:32:45',
    create_time:'2017-3-21 16:32:45',
    meta:{
        group_name:'toyota',
        desc:'desc',
        strategy:'strategy',
        theme:[{
            authority:'0',
            theme_content:'endpoints/node-001/temp/action'
        },{
            authority:'2',
            theme_content:'endpoints/node-001/temp/action'
        }]
    }
},
    {
        uuid:'daxpopd-fa-f56f00',
        name:'temp01',
        user:'user01',
        desc:'desc',
        status:1,
        type:2,
        last_on_time:'2017-3-21 16:32:45',
        create_time:'2017-3-21 16:32:45',
        meta:{
            group_name:'toyota',
            desc:'desc',
            strategy:'strategy',
            theme:[{
                authority:'0',
                theme_content:'endpoints/node-001/temp/action'
            },{
                authority:'2',
                theme_content:'endpoints/node-001/temp/action'
            }]
        }
    }]
class Device extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            loaded:true,
            q:'',
            page:1,
            meta:{pagination:{total:0,per_page:0}},
            addModal:false,
        };
    }
    componentDidMount() {
        this.fetchDevices();
    }
    fetchDevices=(page=1,q='')=>{
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices`,
            method: 'get',
            params: {
                page:page,
                q:q
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    data:response.data.data,
                    meta:response.data.meta,
                    page:page
                })
            })
            .catch(function (error) {
                console.log('获取出错')
            })
    };
    onPageChange = (page) => {
        this.fetchDevices(page,this.state.q);
    };
    addDevice=()=>{
        const that=this;
        const AddDetailForm = this.refs.AddDetailForm.getFieldsValue();
        console.log(AddDetailForm)
        if(!AddDetailForm.name || !AddDetailForm.category || !AddDetailForm.group || !AddDetailForm.policy){
            message.error(messageJson['category group category null']);
            return false
        }
        const addDevicelDate = {
            name:AddDetailForm.name,
            description:AddDetailForm.description,
            category_uuid:AddDetailForm.category.key,
            group_uuid:AddDetailForm.group.key,
            policy_uuid:AddDetailForm.policy.key
        };
        console.log("addDevicelDate",addDevicelDate);
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices`,
            method: 'post',
            data: addDevicelDate,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson['add device success']);
                that.setState({
                    addModal: false
                });
                that.fetchDevices(that.state.page,that.state.q)
            })
            .catch(function (error) {
                let first;
                for ( first in error.response.data.errors) break;
                if (error.response.status === 401) {
                    message.error(messageJson['token fail']);
                } else if(error.response.status === 422){
                    message.error(`${error.response.data.errors[first][0]}`)
                }else {
                    message.error(messageJson['unknown error']);
                }
            });

    };
    delDevice=(uuid)=>{
        console.log("uuid",uuid);
        const { page ,q} = this.state;
        const that=this;
        axios({
            url:`${configJson.prefix}/endpoints/${this.props.params.uuid}/devices/${uuid}`,
            method: 'delete',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device success']);
                that.fetchDevices(that.state.page,that.state.q)
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 404 ){
                    message.error(messageJson['del device fail']);
                }else if(error.response.status === 401){
                    message.error(messageJson['token fail']);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });

    };
    searchEndPoint=(value)=>{
        this.fetchDevices(1,value);
    };
    render() {
        const {data, page, q,meta,loaded} = this.state;
        const columns = [{
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },  {
            title: '类型',
            dataIndex: 'category',
            key: 'category',
            render: (text, record, index) => {
                return(
                    <span key={index}>{text.name}</span>
                )
            }
        },  {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },{
            title: '最后在线时间',
            dataIndex: 'last_onlined_at',
            key: 'last_onlined_at',
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
                        <Popconfirm   placement="topRight" title={`确定要删除 ${record.name} 吗?`} onConfirm={this.delDevice.bind(this,record.uuid)}>
                            <button className="ant-btn ant-btn-danger" data-id={record.uuid}
                            >删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        const expandedRowRender=(record)=>{

            return (
                <div className="expandRowRender-box">
                    <div className="expandRowRender-table">
                        <table>
                            <tbody>
                            <tr>
                                <td>设备组</td>
                                <td>{record.group.name}</td>
                            </tr>
                            <tr>
                                <td>描述</td>
                                <td>{record.description}</td>
                            </tr>
                            <tr>
                                <td>策略</td>
                                <td>{record.policy.name}</td>
                            </tr>
                            <tr>
                                <td>主题</td>
                                <td>
                                    <TopicTable  dataSource={record.policy.topics.data}  />
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </div>
                    <div className="expandRowRender-operate">
                        <Button type="primary">连通测试</Button> <span className="ant-divider" />
                        <Button type="primary">修改</Button> <span className="ant-divider" />
                        <Button type="primary">重新生成秘钥</Button>
                    </div>
                </div>

            );
        }
        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '20px'}}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                            <Breadcrumb.Item ><Link to='/basic'>设备域</Link></Breadcrumb.Item>
                            <Breadcrumb.Item >设备</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{ width: 200 }}
                                onSearch={value => this.searchEndPoint(value)}
                            />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>添加设备</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered expandedRowRender={(record)=>expandedRowRender(record ) } style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        key={1+Date.parse(new Date())}
                        visible={this.state.addModal}
                        title="添加设备"
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({addModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addDevice}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddDetailForm endpoint_uuid={this.props.params.uuid} ref="AddDetailForm"/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default Device;
