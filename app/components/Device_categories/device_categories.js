/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchDevice_categories} from '../../actions/device_categories';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.device_categories,
)
class DeviceCategories extends Component {
    static fetch(state, dispatch, page,q) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchDevice_categories(page,q))
        );
        return fetchTasks
    }
    constructor(props) {
        super(props);
        this.state = {
            addModal:false,
            editDescModal:false,
            addDeviceCategoryName:'',
            addDeviceCategoryDesc:'',
            addBtnCanClick:true,
            delBtnCanClick:true,
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
    changeDeviceCategoryName=(e)=>{
        this.setState({
            addDeviceCategoryName:e.target.value
        })
    };
    changeDeviceCategoryDesc=(e)=>{
        this.setState({
            addDeviceCategoryDesc:e.target.value
        })
    };
    changeEditDescName=(e)=>{
        this.setState({
            editDescName:e.target.value
        })
    }
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
            url:`${configJson.prefix}/device_categories/${this.state.editDescuuid}`,
            method: 'put',
            data: {
                name:this.state.editDescName,
                description: this.state.editDesc,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    name:'',
                    description: '',
                    editDescModal:false,
                    editDescuuid:null
                });
                message.success(messageJson['edit device_categories desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    addDevice_category=()=>{
        const { page,q} = this.props;
        this.setState({
            addBtnCanClick:false
        });
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories`,
            method: 'post',
            data: {
                name: this.state.addDeviceCategoryName,
                description: this.state.addDeviceCategoryDesc,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addBtnCanClick:true,
                    addModal:false,
                    addDeviceCategoryName:'',
                    addDeviceCategoryDesc:'',
                });
                message.success(messageJson['add device_categories success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);

            })
            .catch(function (error) {
                that.setState({
                    addBtnCanClick:true
                });
                converErrorCodeToMsg(error)
            });

    };
    delEndPoint=(uuid)=>{
        console.log("uuid",uuid);
        const { page ,q} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories/${uuid}`,
            method: 'DELETE',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device_categories success']);
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
            width:145,
            render: (text, record, index) => {
                return (
                    <div>
                        <button className="ant-btn ant-btn-primary" data-id={record.uuid}
                        >启用
                        </button>
                        <span className="ant-divider" />

                        <Popconfirm   placement="topRight" title={'Sure to delete ' + record.uuid} onConfirm={this.delEndPoint.bind(this,record.uuid)}>
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
                            <Breadcrumb.Item >分类管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{ width: 200 }}
                                onSearch={value => this.searchEndPoint(value)}
                            />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>增加新类型</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        key={1+Date.parse(new Date())}
                        visible={this.state.addModal}
                        title="创建设备分类"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addDevice_category} disabled={!this.state.addBtnCanClick}>
                                确定
                            </Button>,
                        ]}
                    >
                        <Input style={{marginBottom:'15px'}} onChange={this.changeDeviceCategoryName} value={this.state.addDeviceCategoryName} placeholder="名称:长度3-32个字符" />
                        <Input  onChange={this.changeDeviceCategoryDesc} value={this.state.addDeviceCategoryDesc} type="textarea" placeholder="描述" autosize={{ minRows: 2, maxRows: 6 }} />
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
                        <Input  onChange={this.changeEditDescName} value={this.state.editDescName}  style={{marginBottom:'15px'}}/>
                        <Input  onChange={this.changeEditDesc} value={this.state.editDesc} type="textarea"  autosize={{ minRows: 2, maxRows: 6 }} />
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default DeviceCategories;
