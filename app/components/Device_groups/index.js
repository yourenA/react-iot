/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {fetchDevice_groups} from '../../actions/device_groups';
import {Modal, Input, Icon, Alert, Row, Col, Button, Table, Pagination, Popconfirm,message} from 'antd';
const Search = Input.Search;
import {connect} from 'react-redux';
import Loading from './../Common/loading.js';
import axios from 'axios';
import messageJson from './../../common/message.json';
import {getHeader} from './../../common/common.js';

@connect(
    state => state.device_groups,
)
class DeviceGroups extends Component {
    static fetch(state, dispatch, page,q) {
        const fetchTasks = [];
        fetchTasks.push(
            dispatch(fetchDevice_groups(page,q))
        );
        return fetchTasks
    }
    constructor(props) {
        super(props);
        this.state = {
            addModal:false,
            editDescModal:false,
            addDeviceGroupName:'',
            addDeviceGroupDesc:'',
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
            addDeviceGroupName:e.target.value
        })
    };
    changeDeviceCategoryDesc=(e)=>{
        this.setState({
            addDeviceGroupDesc:e.target.value
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
            url:`http://local.iothub.com.cn/device_groups/${this.state.editDescuuid}`,
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
                message.success(messageJson['edit device_groups desc success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                if(error.response.status === 422 ){
                    message.error(error.response.data.errors.name[0]);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });
    }
    addDevice_category=()=>{
        const { page,q} = this.props;
        this.setState({
            addBtnCanClick:false
        });
        const that=this;
        axios({
            url:'http://local.iothub.com.cn/device_groups',
            method: 'post',
            data: {
                name: this.state.addDeviceGroupName,
                description: this.state.addDeviceGroupDesc,
            },
            headers:getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    addBtnCanClick:true,
                    addModal:false,
                    addDeviceGroupName:'',
                    addDeviceGroupDesc:'',
                });
                message.success(messageJson['add device_groups success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);

            })
            .catch(function (error) {
                that.setState({
                    addBtnCanClick:true
                });
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
            url:`http://local.iothub.com.cn/device_groups/${uuid}`,
            method: 'DELETE',
            headers:getHeader()
        })
            .then(function (response) {
                message.success(messageJson['del device_groups success']);
                that.constructor.fetch(that.props, that.props.dispatch, page,q);
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 404 ){
                    message.error(messageJson['del device_groups fail']);
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
                        <span>{text}</span><Icon type="edit" onClick={this.showEditDesc.bind(this,record.uuid,record.name,record.description)}/>
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
                    <div style={{marginTop: '30px'}}>
                        <div>
                            <Search
                                defaultValue={q}
                                placeholder="input search text"
                                style={{ width: 200 }}
                                onSearch={value => this.searchEndPoint(value)}
                            />
                            <Button className="search-btn" type="primary" icon="plus" onClick={()=>{this.setState({addModal:true})}}>增加新设备组</Button>
                        </div>
                        <Loading show={loaded} />
                        <Table bordered  style={{display:loaded? 'block':'none'}} rowKey="uuid" columns={columns} dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total  } current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>
                    <Modal
                        visible={this.state.addModal}
                        title="创建新设备组"
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
                        <Input style={{marginBottom:'15px'}} onChange={this.changeDeviceCategoryName} value={this.state.addDeviceGroupName} placeholder="名称:长度3-32个字符" />
                        <Input  onChange={this.changeDeviceCategoryDesc} value={this.state.addDeviceGroupDesc} type="textarea" placeholder="描述" autosize={{ minRows: 2, maxRows: 6 }} />
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
                        <Input  onChange={this.changeEditDescName} value={this.state.editDescName}  style={{marginBottom:'15px'}}/>
                        <Input  onChange={this.changeEditDesc} value={this.state.editDesc} type="textarea"  autosize={{ minRows: 2, maxRows: 6 }} />
                    </Modal>
                </Row>
            </div>
        );
    }
}
export default DeviceGroups;
