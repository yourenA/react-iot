/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router'
import Loading from './../Common/loading.js';
import axios from 'axios';
import messageJson from './../../common/message.json';
import {getHeader} from './../../common/common.js';
import './index.scss'

class EndPointDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            loaded:false,
            q:'',
            page:0,
            meta:{pagination:{total:0,per_page:0}},
            addModal:false,
            addEndpointName:'',
        };
    }
    componentDidMount() {
    }

    onPageChange = (page) => {

    };
    addEndPoint=()=>{
        const { page,q} = this.props;
        const that=this;
        axios({
            url:'http://local.iothub.com.cn/endpoints',
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
                if(error.response.status === 422 ){
                    message.error(error.response.data.errors.name[0]);
                }else if(error.response.status === 401){
                    message.error(messageJson['token fail']);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });

    };
    delEndPoint=(uuid)=>{
        console.log("uuid",uuid);
        const { page ,q} = this.props;
        const that=this;
        axios({
            url:`http://local.iothub.com.cn/endpoints/${uuid}`,
            method: 'delete',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
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

    };
    searchEndPoint=(value)=>{
        this.constructor.fetch(this.props, this.props.dispatch, 1,value);
    };
    render() {
        const {data, page, q,meta,loaded} = this.state;
        console.log(meta)
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
                        <Popconfirm   placement="topRight" title={'Sure to delete ' + record.uuid} onConfirm={this.delEndPoint.bind(this,record.uuid)}>
                            <button className="ant-btn ant-btn-primary" data-id={record.uuid}
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
                </Row>
            </div>
        );
    }
}
export default EndPointDetail;
