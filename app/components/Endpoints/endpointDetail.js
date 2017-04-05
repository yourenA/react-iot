/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {Modal, Input, Icon, Breadcrumb, Row, Col, Button, Table, Pagination, Popconfirm, message} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router';
import Clipboard from 'clipboard'
import Loading from './../Common/loading.js';
import TopicTable from './../Common/topicTable.js';
import SearchWrap from './../Common/search';
import axios from 'axios';
import messageJson from './../../common/message.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common.js';
import AddOrEditDetailForm from './addOrEditDetailForm.js'
import configJson from './../../../config.json';
class Device extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: true,
            q: '',
            page: 1,
            start_at:'',
            end_at:'',
            order:'asc',
            meta: {pagination: {total: 0, per_page: 0}},
            addModal: false,
            editModal: false,
            editRecord: {},
            reGenerateKeyModal: false,
            newKey: ''
        };
    }

    componentDidMount() {
        this.fetchDevices();
        let clipboard = new Clipboard('.copyKey');
        clipboard.on('success', function (e) {
        });
        clipboard.on('error', function (e) {
        });
    }

    fetchDevices = (page = 1, q = '',start_at='',end_at='',order='asc')=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices`,
            method: 'get',
            params: {
                page: page,
                q: q,
                start_at:start_at,
                end_at:end_at,
                order:order
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    data: response.data.data,
                    meta: response.data.meta,
                    page: page,
                    q:q,
                    start_at:start_at,
                    end_at:end_at,
                    order:order
                })
            })
            .catch(function (error) {
                console.log('获取出错')
            })
    };

    addDevice = ()=> {
        const that = this;
        const { page ,q,start_at,end_at,order} = this.state;
        const AddDetailForm = this.refs.AddDetailForm.getFieldsValue();
        console.log(AddDetailForm)
        if (!AddDetailForm.name || !AddDetailForm.category || !AddDetailForm.policy) {
            message.error(messageJson['category group category null']);
            return false
        }
        const addDevicelDate = {
            name: AddDetailForm.name,
            description: AddDetailForm.description,
            category_uuid: AddDetailForm.category.key,
            group_uuid: AddDetailForm.group ? AddDetailForm.group.key : '',
            policy_uuid: AddDetailForm.policy.key
        };
        console.log("addDevicelDate", addDevicelDate);
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
                    addModal: false,
                    reGenerateKeyModal: true,
                    newKey: response.data.password
                });
                that.fetchDevices( page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    editDevice = ()=> {
        const that = this;
        const { page ,q,start_at,end_at,order} = this.state;
        const EditDetailForm = this.refs.EditDetailForm.getFieldsValue();
        if (!EditDetailForm.name || !EditDetailForm.category || !EditDetailForm.policy) {
            message.error(messageJson['category group category null']);
            return false
        }
        const editDevicelDate = {
            name: EditDetailForm.name,
            description: EditDetailForm.description,
            category_uuid: EditDetailForm.category.key,
            group_uuid: EditDetailForm.group ? EditDetailForm.group.key : '',
            policy_uuid: EditDetailForm.policy.key
        };
        console.log("addDevicelDate", EditDetailForm);
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices/${this.state.edituuid}`,
            method: 'put',
            data: editDevicelDate,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson['edit device success']);
                that.setState({
                    editModal: false
                });
                that.fetchDevices( page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    reStartDevice = (uuid)=> {
        console.log("重启", uuid)
    }
    delDevice = (uuid)=> {
        console.log("uuid", uuid);
        const that = this;
        const { page ,q,start_at,end_at,order} = this.state;
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices/${uuid}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device success']);
                that.fetchDevices(page,q,start_at,end_at,order);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    reGenerateKey = (uuid)=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${this.props.params.uuid}/devices/${uuid}/password`,
            method: 'put',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    reGenerateKeyModal: true,
                    newKey: response.data.password
                });
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });
    }
    copyKey = ()=> {
        message.success(messageJson['key copy success']);
        this.setState({
            reGenerateKeyModal: false
        })

    };

    onChangeSearch=( page ,q,start_at,end_at,order)=>{
        this.fetchDevices(page ,q,start_at,end_at,order);

    }
    onPageChange = (page) => {
        this.fetchDevices(page, this.state.q);
    };
    searchEndPoint = (value)=> {
        this.fetchDevices(1, value);
    };
    setConnetUser = (username)=> {
        localStorage.setItem('connect_user', username);
    }

    render() {
        const {data, page, q, meta, loaded} = this.state;
        const columns = [{
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: '类型',
            dataIndex: 'category',
            key: 'category',
            render: (text, record, index) => {
                return (
                    <span key={index}>{text.name}</span>
                )
            }
        }, {
            title: '状态',
            dataIndex: 'online_status',
            key: 'online_status',
        }, {
            title: '最后在线时间',
            dataIndex: 'last_onlined_at',
            key: 'last_onlined_at',
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
                        <Popconfirm placement="topRight" title={`确定要重启 ${record.name} 吗?`}
                                    onConfirm={this.reStartDevice.bind(this, record.uuid)}>
                            <button className="ant-btn btn-info">
                                重启
                            </button>
                        </Popconfirm>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={`确定要删除 ${record.name} 吗?`}
                                    onConfirm={this.delDevice.bind(this, record.uuid)}>
                            <button className="ant-btn ant-btn-danger" data-id={record.uuid}
                            >删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        const expandedRowRender = (record)=> {
            return (
                <div className="expandRowRender-box">
                    <div className="expandRowRender-table">
                        <table>
                            <tbody>
                            {record.group ?
                                <tr>
                                    <td>设备组</td>
                                    <td>{record.group.name }</td>
                                </tr> : null}

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
                                    <TopicTable dataSource={record.policy.topics.data}/>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </div>
                    <div className="expandRowRender-operate">
                        <Link onClick={this.setConnetUser.bind(this, record.username)} target='_blank'
                              to={`/basic/endpoints/${this.props.params.uuid}/connect_test`}><Button type="primary">
                            连通测试</Button></Link> <span className="ant-divider"/>
                        <Button type="primary" onClick={()=> {
                            this.setState({editModal: true, edituuid: record.uuid, editRecord: record})
                        }}>修改</Button> <span className="ant-divider"/>
                        <Button type="primary"
                                onClick={this.reGenerateKey.bind(this, record.uuid)}>重新生成秘钥</Button>
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
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=> {
                                this.setState({addModal: true})
                            }}>添加设备</Button>
                        </div>
                        <Loading show={loaded}/>
                        <Table bordered expandedRowRender={(record)=>expandedRowRender(record) }
                               style={{display: loaded ? 'block' : 'none'}} rowKey="uuid" columns={columns}
                               dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        key={1 + Date.parse(new Date())}
                        visible={this.state.addModal}
                        title="添加设备"
                        onCancel={()=> {
                            this.setState({addModal: false})
                        }}
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
                        <AddOrEditDetailForm endpoint_uuid={this.props.params.uuid} ref="AddDetailForm"/>
                    </Modal>
                    <Modal
                        key={2 + Date.parse(new Date())}
                        visible={this.state.editModal}
                        title="修改设备"
                        onCancel={()=> {
                            this.setState({editModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({editModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.editDevice}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrEditDetailForm endpoint_uuid={this.props.params.uuid} ref="EditDetailForm"
                                             editRecord={this.state.editRecord}/>
                    </Modal>
                    <Modal
                        key={3 + Date.parse(new Date())}
                        visible={this.state.reGenerateKeyModal}
                        title="生成密钥成功"
                        onCancel={()=> {
                            this.setState({reGenerateKeyModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({reGenerateKeyModal: false})
                                    }}>确定</Button>,
                            <Button className='copyKey' data-clipboard-text={this.state.newKey} key="submit"
                                    type="primary" size="large" onClick={this.copyKey}>
                                复制
                            </Button>,
                        ]}
                    >
                        <p>{this.state.newKey}</p>
                    </Modal>

                </Row>
            </div>
        );
    }
}
export default Device;
