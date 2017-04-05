/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchPolicies, fetchAllEndpoints} from '../../actions/policies';
import {Modal, Input, Icon, Breadcrumb, Row, Select, Button, Table, Pagination, Popconfirm, message} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import TopicTable from './../Common/topicTable';
import SearchWrap from './../Common/searchforPolice';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader, convertFormToData,converErrorCodeToMsg} from './../../common/common.js';
import AddPoliciesForm from './../Endpoints/addpolicy'
import EditPoliciesForm from './editPoliciesForm'
@connect(
    state => state.policies,
)
class Policies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            editPoliciesModal: false,
            editPoliciesRecord: {},
            edituuid: '',
        };
    }

    componentDidMount = () => {
        this.props.dispatch(fetchAllEndpoints());
    }
    changeEndpoint = (e)=> {
        const endpoint_uuid = e.target.value;
        this.props.dispatch(fetchPolicies(1, '', endpoint_uuid,'','','asc'))
    }
    onPageChange = (page) => {
        const {q, endpoint_uuid,start_at,end_at,order} = this.props;
        this.props.dispatch(fetchPolicies(page, q, endpoint_uuid,start_at,end_at,order));
    };
    showEditPolicies = (record)=> {
        this.setState({
            editPoliciesModal: true,
            editPoliciesRecord: record,
            edituuid: record.uuid
        })
    };
    addPolice = ()=> {
        const AddPoliciesForm = this.refs.AddPoliciesForm.getFieldsValue();
        console.log("AddPoliciesForm", AddPoliciesForm);
        const addPoliciesDate = convertFormToData(AddPoliciesForm);
        const {page, q, endpoint_uuid,start_at,end_at,order} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${endpoint_uuid}/policies`,
            method: 'post',
            data: addPoliciesDate,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson['add policies success']);
                that.props.dispatch(fetchPolicies(page, q, endpoint_uuid,start_at,end_at,order));
                that.setState({
                    addModal: false
                })
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    editPolice = ()=> {
        const EditPoliciesForm = this.refs.EditPoliciesForm.getFieldsValue();
        const editPoliciesDate = convertFormToData(EditPoliciesForm);
        if(editPoliciesDate===false){
            message.error(messageJson["topic name cant null"]);
            return false
        }
        const {page, q, endpoint_uuid,start_at,end_at,order} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${endpoint_uuid}/policies/${this.state.edituuid}`,
            method: 'put',
            data: editPoliciesDate,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson['edit policies success']);
                that.props.dispatch(fetchPolicies(page, q, endpoint_uuid,start_at,end_at,order));
                that.setState({
                    editPoliciesModal: false
                })
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)

            });

    }
    delPolice = (uuid)=> {
        const {page, q, endpoint_uuid,start_at,end_at,order} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${endpoint_uuid}/policies/${uuid}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del policies success']);
                that.props.dispatch(fetchPolicies(page, q, endpoint_uuid,start_at,end_at,order));
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)

            });

    };

    onChangeSearch=( page ,q,start_at,end_at,order)=>{
        const {endpoint_uuid}=this.props;
        this.props.dispatch(fetchPolicies(page, q, endpoint_uuid,start_at,end_at,order));

    }

    render() {
        const {
            endpointsData = [], data = [], page, q, meta = {
            pagination: {
                total: 0,
                per_page: 0
            }
        }, loaded
        } = this.props;

        const columns = [{
            title: '策略名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '设备数',
            dataIndex: 'device_count',
            key: 'device_count',
        }, {
            title: '主题',
            dataIndex: 'topics',
            key: 'topics',
            render: (text, record, index) => {
                const topics = record.topics.data.map((item, index)=> {
                    return (
                        <i key={index} style={{marginRight: '5px'}} title={item.name}>{item.name};</i>
                    )
                });
                return (
                    <p className="line-clamp3 line-edit"><span>{topics}</span></p>
                )
            }
        }, {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        }, {
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record, index) => {
                return (
                    <div>
                        <button onClick={this.showEditPolicies.bind(this, record)} className="ant-btn ant-btn-primary"
                                data-id={record.uuid}
                        >编辑
                        </button>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={ `确定要删除 ${record.name} 吗?`}
                                    onConfirm={this.delPolice.bind(this, record.uuid)}>
                            <button className="ant-btn ant-btn-danger " data-id={record.uuid}
                            >删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        const selectOptions = endpointsData.map((item, index)=> {
            if (index === 0) {
                return (
                    <option key={index} value={item.uuid}>{item.name}</option>
                )
            } else {
                return (
                    <option key={index} value={item.uuid}>{item.name}</option>
                )
            }

        });
        const expandedRowRender = (record)=> {

            return (
                <div className="expandRowRender-box">
                    <TopicTable dataSource={record.topics.data}/>
                </div>
            );
        }

        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '20px'}}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>接入管理</Breadcrumb.Item>
                            <Breadcrumb.Item >策略管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <select onChange={this.changeEndpoint} className="ant-input"
                                    style={{marginRight: '10px', width: 'auto'}}>
                                {selectOptions}
                            </select>
                            <SearchWrap type="policy" onChangeSearch={this.onChangeSearch} {...this.props} />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=> {
                                this.setState({addModal: true})
                            }}>创建策略</Button>
                        </div>
                        <Loading show={loaded}/>
                        <Table bordered expandedRowRender={(record)=>expandedRowRender(record) }
                               style={{display: loaded ? 'block' : 'none'}} rowKey="uuid" columns={columns}
                               dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModal}
                        title="创建新策略"
                        onOk={this.handleOk}
                        onCancel={()=> {
                            this.setState({addModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({addModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addPolice}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddPoliciesForm ref="AddPoliciesForm"/>
                    </Modal>
                    <Modal
                        key={2+Date.parse(new Date())}
                        visible={this.state.editPoliciesModal}
                        title="修改策略"
                        onCancel={()=> {
                            this.setState({editPoliciesModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({editPoliciesModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.editPolice}>
                                确定
                            </Button>,
                        ]}
                    >
                        <EditPoliciesForm ref="EditPoliciesForm" record={this.state.editPoliciesRecord}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default Policies;
