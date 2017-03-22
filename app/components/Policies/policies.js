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
import {getHeader} from './../../common/common.js';
import AddPoliciesForm from './addPoliciesForm'
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
            editDescModal: false,
            addEndpointName: '',
            addEndpointDesc: '',
            editDescName: '',
            editDescuuid: '',
            editDesc: '',
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
    changeEndpointName = (e)=> {
        this.setState({
            addEndpointName: e.target.value
        })
    };
    changeEndpointDesc = (e)=> {
        this.setState({
            addEndpointDesc: e.target.value
        })
    };
    changeEditDesc = (e)=> {
        this.setState({
            editDesc: e.target.value
        })
    };
    showEditDesc = (uuid, name, desc)=> {
        this.setState({
            editDescModal: true,
            editDescName: name,
            editDesc: desc,
            editDescuuid: uuid
        })
    };
    handleEditDescOk = ()=> {
        const {page, q, endpoints_uuid} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${this.state.editDescuuid}`,
            method: 'put',
            data: {
                description: this.state.editDesc,
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal: false,
                    editDescuuid: null
                });
                message.success(messageJson['edit endpoint desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page, q, endpoints_uuid);
            })
            .catch(function (error) {
                if (error.response.status === 422) {
                    message.error(messageJson['edit endpoint desc fail']);
                } else {
                    message.error(messageJson['unknown error']);
                }
            });
    }
    addPolice = ()=> {
        const AddPoliciesForm = this.refs.AddPoliciesForm.fields;
        const addPoliciesDate = {
            name: AddPoliciesForm.name.value,
            description: AddPoliciesForm.desc.value,
            topics: []
        };
        for (var k in AddPoliciesForm) {
            if (k.indexOf('topics') >= 0) {
                if (AddPoliciesForm.hasOwnProperty(k)) {
                    if (AddPoliciesForm[k].value.authority == 0) {
                        addPoliciesDate.topics.push({
                            name: AddPoliciesForm[k].value.name,
                            allow_publish: -1,
                            allow_subscribe: 1
                        })
                    } else if (AddPoliciesForm[k].value.authority == 1) {
                        addPoliciesDate.topics.push({
                            name: AddPoliciesForm[k].value.name,
                            allow_publish: 1,
                            allow_subscribe: -1
                        })
                    } else if (AddPoliciesForm[k].value.authority == 2) {
                        addPoliciesDate.topics.push({
                            name: AddPoliciesForm[k].value.name,
                            allow_publish: 1,
                            allow_subscribe: 1
                        })
                    }
                }
            }
        }

        console.log("addPoliciesDate", addPoliciesDate);
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
                    message.error(error.response.data.errors.name[0]);
                } else if (error.response.status === 401) {
                    message.error(messageJson['token fail']);
                } else {
                    message.error(messageJson['unknown error']);
                }
            });

    };
    delPolice = (uuid)=> {
        console.log("uuid", uuid);
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
        this.constructor.fetch(this.props, this.props.dispatch, 1, value);
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
                        <span key={index} style={{marginRight: '5px'}}>{item.name}</span>
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
            width: 70,
            render: (text, record, index) => {
                return (
                    <div>
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
                        visible={this.state.editDescModal}
                        title="修改描述"
                        onCancel={()=> {
                            this.setState({editDescModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({editDescModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.handleEditDescOk}>
                                确定
                            </Button>,
                        ]}
                    >
                        <h3 style={{marginBottom: '10px'}}>名称 : {this.state.editDescName}</h3>
                        <Input onChange={this.changeEditDesc} value={this.state.editDesc} type="textarea"
                               autosize={{minRows: 2, maxRows: 6}}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default Policies;
