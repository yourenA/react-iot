/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchEndPoints} from '../../actions/endpoints';
import {
    Modal,
    Dropdown,
    Menu,
    Input,
    Icon,
    Breadcrumb,
    Row,
    DatePicker,
    Button,
    Table,
    Pagination,
    Popconfirm,
    message
} from 'antd';
const Search = Input.Search;
import {Link} from 'react-router'
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import AddOrNameDescForm from './../Common/addOrEditNameDesc';
import SearchWrap from './../Common/search';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';

import {getHeader, converErrorCodeToMsg} from './../../common/common.js';

@connect(
    state => state.endpoints,
)
class EndPoints extends Component {
    static fetch(state, dispatch, page, q, start_at, end_at, order, status, ep_type) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchEndPoints(page, q, start_at, end_at, order, status, ep_type))
        );
        return fetchTasks
    }

    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            editDescModal: false,
            editDescName: '',
            editDescuuid: '',
            editDesc: '',
        };
    }

    componentDidMount() {
        console.log("componentDidMount")
        this.props.dispatch(fetchEndPoints(1, '', '', '', 'asc', '', ''))
    }


    showEditDesc = (uuid, name, desc)=> {
        this.setState({
            editDescModal: true,
            editDescName: name,
            editDesc: desc,
            editDescuuid: uuid
        })
    };
    handleEditDescOk = ()=> {
        const {page, q, start_at, end_at, order, status, ep_type} = this.props;
        const that = this;
        const AddOrEditEndpointForm = this.refs.AddOrEditEndpointForm.getFieldsValue();
        axios({
            url: `${configJson.prefix}/endpoints/${this.state.editDescuuid}`,
            method: 'put',
            data: AddOrEditEndpointForm,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    editDescModal: false,
                });
                message.success(messageJson['edit endpoint desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page, q, start_at, end_at, order, status, ep_type);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });
    }
    addEndPoint = ()=> {
        const {page, q, start_at, end_at, order, status, ep_type} = this.props;
        const that = this;
        const AddOrEditEndpointForm = this.refs.AddOrEditEndpointForm.getFieldsValue();
        console.log("getFieldsValue();", AddOrEditEndpointForm);
        axios({
            url: `${configJson.prefix}/endpoints`,
            method: 'post',
            data: AddOrEditEndpointForm,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addModal: false,
                });
                message.success(messageJson['add endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page, q, start_at, end_at, order, status, ep_type);
            })
            .catch(function (error) {
                converErrorCodeToMsg(error)
            });

    };
    delEndPoint = (uuid)=> {
        console.log("uuid", uuid);
        const {page, q, start_at, end_at, order, status, ep_type} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${uuid}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page, q, start_at, end_at, order, status, ep_type);
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });

    };
    banEndPoint = (uuid,banStatus)=> {
        const {page, q, start_at, end_at, order, status, ep_type} = this.props;
        const that = this;
        axios({
            url: `${configJson.prefix}/endpoints/${uuid}`,
            method: 'patch',
            data:{status:banStatus},
            headers: getHeader()
        })
            .then(function (response) {
                message.success(messageJson['ban or start endpoint success']);
                that.constructor.fetch(that.props, that.props.dispatch, page, q, start_at, end_at, order, status, ep_type);
            })
            .catch(function (error) {
                console.log(error.response);
                converErrorCodeToMsg(error)
            });
    }
    onChangeSearch = (page, q, start_at, end_at, order, status, ep_type)=> {
        this.constructor.fetch(this.props, this.props.dispatch, page, q, start_at, end_at, order, status, ep_type);

    }

    onPageChange = (page) => {
        const {q, start_at, end_at, order, status, ep_type} = this.props;
        this.constructor.fetch(this.props, this.props.dispatch, page, q, start_at, end_at, order, status, ep_type);
    };

    setConnetUser = (username)=> {
        localStorage.setItem('connect_user', username);
    }
    render() {
        const {
            data = [], page, q, start_at, end_at, order, meta = {
            pagination: {
                total: 0,
                per_page: 0
            }
        }, loaded
        } = this.props;
        const columns = [{
            title: '设备',
            dataIndex: 'uuid',
            key: 'uuid',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <div >
                        <span title={text}>{text}</span><Icon type="edit"
                                                              onClick={this.showEditDesc.bind(this, record.uuid, record.name, record.description)}/>
                    </div>

                )
            }
        }, {
            title: '设备类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => {
                return (
                    <div className="line-clamp3 line-edit">
                        <span title={text}>{text}</span><Icon type="edit"
                                                              onClick={this.showEditDesc.bind(this, record.uuid, record.name, record.description)}/>
                    </div>

                )
            }
        }, {
            title: '资源数',
            dataIndex: 'topic_quantity',
            key: 'topic_quantity',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        }, {
            title: '操作',
            key: 'action',
            width: 190,
            render: (text, record, index) => {
                return (
                    <div>
                        <Dropdown overlay={
                            <Menu onClick={(e)=> {
                                this.banEndPoint(record.uuid,e.key)
                            }}>
                                <Menu.Item key="enable">启用</Menu.Item>
                                <Menu.Item key="disable">禁用</Menu.Item>
                            </Menu>
                        }>
                            <Button>
                                禁/启用 <Icon type="down"/>
                            </Button>
                        </Dropdown>
                        {record.status==='未激活'?
                            <div style={{display:'inline-block'}}>
                                <span className="ant-divider"/>
                                <Popconfirm placement="topRight" title={ `确定要删除 ${record.name} 吗?`}
                                            onConfirm={this.delEndPoint.bind(this,record.uuid)}>
                                    <button className="ant-btn ant-btn-danger " data-id={record.uuid}
                                    >删除
                                    </button>
                                </Popconfirm>
                            </div>
                            :null}

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
                            <tr >
                                <td>描述</td>
                                <td>{record.description}</td>
                            </tr>
                            <tr>
                                <td>主题</td>
                                <td>
                                  {/*  <TopicT/!**!/able dataSource={record.topics.data}/>*/}
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </div>
                    <div className="expandRowRender-operate">
                     <Link onClick={this.setConnetUser.bind(this, record.username)} target='_blank'
                              to={`/basic/endpoints/connect_test`}><Button type="primary">
                            连通测试</Button></Link> <span className="ant-divider"/>
                        {/*   <Button type="primary" onClick={()=> {
                            this.setState({editModal: true, edituuid: record.uuid, editRecord: record})
                        }}>修改</Button> <span className="ant-divider"/>
                        <Button type="primary"
                                onClick={this.reGenerateKey.bind(this, record.uuid)}>重新生成秘钥</Button>*/}
                    </div>
                </div>

            );
        }
        return (
            <div className="Home">
                <Row>
                    <div style={{marginTop: '10px'}}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>接入设备</Breadcrumb.Item>
                            <Breadcrumb.Item >设备域</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.props} />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=> {
                                this.setState({addModal: true})
                            }}>添加设备</Button>
                        </div>
                        <Loading show={loaded}/>
                        <Table expandedRowRender={(record)=>expandedRowRender(record) }
                               bordered style={{display: loaded ? 'block' : 'none'}} rowKey="uuid" columns={columns}
                               dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
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
                            <Button key="submit" type="primary" size="large" onClick={this.addEndPoint}>
                                确定
                            </Button>,
                        ]}
                    >
                        <AddOrNameDescForm ref="AddOrEditEndpointForm" type="endpoint"/>
                    </Modal>
                    <Modal
                        key={2 + Date.parse(new Date())}
                        visible={this.state.editDescModal}
                        title="修改设备名称描述"
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
                        <AddOrNameDescForm ref="AddOrEditEndpointForm" type="endpoint" name={this.state.editDescName}
                                           description={this.state.editDesc}/>
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default EndPoints;
