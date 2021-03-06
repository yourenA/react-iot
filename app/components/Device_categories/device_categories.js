/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchDevice_categories} from '../../actions/device_categories';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import AddOrNameDescForm from './../Common/addOrEditNameDesc'
import SearchWrap from './../Common/search';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.device_categories,
)
class DeviceCategories extends Component {
    static fetch(state, dispatch, page,q,start_at,end_at,order) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchDevice_categories(page,q,start_at,end_at,order))
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
        this.props.dispatch(fetchDevice_categories(1,'','','','asc'))
    }

    onPageChange = (page) => {
        const { q,start_at,end_at,order} = this.props;
        this.constructor.fetch(this.props, this.props.dispatch, page,q,start_at,end_at,order);
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
        const AddOrEditCategoryForm=this.refs.AddOrEditCategoryForm.getFieldsValue();
        const { page ,q,start_at,end_at,order} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories/${this.state.editDescuuid}`,
            method: 'put',
            data:AddOrEditCategoryForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal:false,
                });
                message.success(messageJson['edit device_categories desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    addDevice_category=()=>{
        const AddOrEditCategoryForm=this.refs.AddOrEditCategoryForm.getFieldsValue();
        const { page,q,start_at,end_at,order} = this.props;
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories`,
            method: 'post',
            data:AddOrEditCategoryForm,
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal:false,
                });
                message.success(messageJson['add device_categories success']);
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
            url:`${configJson.prefix}/device_categories/${uuid}`,
            method: 'DELETE',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device_categories success']);
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
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },{
            title: '操作',
            key: 'action',
            width:150,
            render: (text, record, index) => {
                return (
                    <div>
                        <button className="ant-btn  btn-info"
                        >启用
                        </button>
                        <span className="ant-divider" />

                        <Popconfirm   placement="topRight" title={ `确定要删除 ${record.name} 吗?`} onConfirm={this.delEndPoint.bind(this,record.uuid)}>
                            <button className="ant-btn ant-btn-danger">删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '10px'}}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                            <Breadcrumb.Item >分类管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.props} />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>增加新类型</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModal}
                        title="创建设备分类"
                        onOk={this.handleOk}
                        onCancel={()=>{this.setState({addModal:false})}}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=>{this.setState({addModal:false})}}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addDevice_category}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrNameDescForm ref="AddOrEditCategoryForm" />
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
                        <AddOrNameDescForm ref="AddOrEditCategoryForm" name={this.state.editDescName}  type='category' description={this.state.editDesc}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default DeviceCategories;
