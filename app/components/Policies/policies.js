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
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {getHeader,convertFormToData} from './../../common/common.js';
import AddPoliciesForm from './addPoliciesForm'
import EditPoliciesForm from './editPoliciesForm'
@connect(
    state => state.policies,
)
class Policies extends Component {
    static fetch(state, dispatch, page, q, endpoint_uuid) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchAllEndpoints()),
            // dispatch(fetchPolicies(page,q,endpoint_uuid))
        );
        return fetchTasks
    }

    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            editPoliciesModal: false,
            editPoliciesRecord:{},
            edituuid:''
        };
    }

    componentDidMount = () => {
        this.props.dispatch(fetchAllEndpoints());

    }
    changeEndpoint = (e)=> {
        const endpoint_uuid = e.target.value;
        this.props.dispatch(fetchPolicies(1, '', endpoint_uuid))
    }
    onPageChange = (page) => {
        const {q, endpoint_uuid} = this.props;
        this.props.dispatch(fetchPolicies(page, q, endpoint_uuid))
    };
    showEditPolicies=(record)=>{
        this.setState({
            editPoliciesModal:true,
            editPoliciesRecord:record,
            edituuid:record.uuid
        })
    };
    addPolice = ()=> {
        const AddPoliciesForm = this.refs.AddPoliciesForm.getFieldsValue();
        console.log("AddPoliciesForm",AddPoliciesForm);
        const addPoliciesDate=convertFormToData(AddPoliciesForm);
        const {page, q, endpoint_uuid} = this.props;
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
                that.props.dispatch(fetchPolicies(page, q, endpoint_uuid));
                that.setState({
                    addModal: false
                })
            })
            .catch(function (error) {
                if (error.response.status === 422) {
                    if(error.response.data.errors.name && error.response.data.errors.name[0]){
                        message.error(error.response.data.errors.name[0]);
                    }else {
                        message.error(messageJson['topic name fail']);
                    }
                }else if (error.response.status === 401) {
                    message.error(messageJson['token fail']);
                } else {
                    message.error(messageJson['unknown error']);
                }
            });

    };
    editPolice=()=>{
        const EditPoliciesForm = this.refs.EditPoliciesForm.getFieldsValue();
        const editPoliciesDate=convertFormToData(EditPoliciesForm);
        console.log("editPoliciesDate",editPoliciesDate);
        const {page, q, endpoint_uuid} = this.props;
        const that = this;
        // axios({
        //     url: `${configJson.prefix}/endpoints/${endpoint_uuid}/policies/${this.state.edituuid}`,
        //     method: 'put',
        //     data: editPoliciesDate,
        //     headers: getHeader()
        // })
        //     .then(function (response) {
        //         console.log(response);
        //         message.success(messageJson['edit policies success']);
        //         that.props.dispatch(fetchPolicies(page, q, endpoint_uuid));
        //         that.setState({
        //             editPoliciesModal: false
        //         })
        //     })
        //     .catch(function (error) {
        //         if (error.response.status === 422) {
        //             if(error.response.data.errors.description && error.response.data.errors.description[0]){
        //                 message.error(error.response.data.errors.description[0]);
        //             }else {
        //                 message.error(messageJson['topic name fail']);
        //             }
        //         }else if (error.response.status === 401) {
        //             message.error(messageJson['token fail']);
        //         } else {
        //             message.error(messageJson['unknown error']);
        //         }
        //     });

    }
    delPolice = (uuid)=> {
        const {page, q, endpoint_uuid} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${endpoint_uuid}/policies/${uuid}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del policies success']);
                that.props.dispatch(fetchPolicies(page, q, endpoint_uuid));
            })
            .catch(function (error) {
                console.log(error.response);
                if (error.response.status === 404) {
                    message.error(messageJson['del policies fail']);
                } else if (error.response.status === 401) {
                    message.error(messageJson['token fail']);
                } else {
                    message.error(messageJson['unknown error']);
                }
            });

    };
    searchEndPoint = (value)=> {
        const {page, q, endpoint_uuid} = this.props;
        this.props.dispatch(fetchPolicies(page, value, endpoint_uuid));
    };

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
                        <span key={index} style={{marginRight: '5px'}}>{item.name};</span>
                    )
                });
                return (
                    <p>{topics}</p>
                )
            }
        }, {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        }, {
            title: '操作',
            key: 'action',
            width: 145,
            render: (text, record, index) => {
                return (
                    <div>
                        <button onClick={this.showEditPolicies.bind(this, record)} className="ant-btn ant-btn-primary" data-id={record.uuid}
                        >编辑
                        </button>
                        <span className="ant-divider" />
                        <Popconfirm placement="topRight" title={'Sure to delete ' + record.uuid}
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
            const columns = [{
                title: '权限',
                dataIndex: 'allow_publish',
                key: 'allow_publish',
                render: (text,record,index)=> {
                    if (record.allow_publish === 1 && record.allow_subscribe === 1) {
                        return (
                            <p>订阅+发布</p>
                        )
                    } else if (record.allow_publish === 1 && record.allow_subscribe === -1) {
                        return (
                            <p>发布</p>
                        )
                    } else if (record.allow_publish === -1 && record.allow_subscribe === 1) {
                        return(
                            <p>订阅</p>
                        )
                    }else{
                        return null
                    }

                }
            }, {
                title: '主题',
                dataIndex: 'name',
                key: 'name',
            },];

            return (
                <div className="expandRowRender-box">
                    <div className="expandRowRender-table">
                        <Table
                            style={{width: '300px'}}
                            size="small"
                            rowKey="authority"
                            columns={columns}
                            dataSource={record.topics.data}
                            pagination={false}
                        />
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
                            <Breadcrumb.Item >策略管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <select onChange={this.changeEndpoint} className="ant-input"
                                    style={{marginRight: '10px', width: 'auto'}}>
                                {selectOptions}
                            </select>
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{width: 200}}
                                onSearch={value => this.searchEndPoint(value)}
                            />
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
                        <EditPoliciesForm  ref="EditPoliciesForm" record={this.state.editPoliciesRecord} />
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default Policies;
