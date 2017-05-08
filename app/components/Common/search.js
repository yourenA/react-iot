/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input, Select, DatePicker} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
import axios from 'axios';
import configJson from './../../../config.json';
import {getHeader} from './../../common/common.js';
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryArr:[]
        };
    }
    componentDidMount = () => {
        // const that=this;
        // axios({
        //     url:`${configJson.prefix}/device_categories`,
        //     method: 'get',
        //     params:{
        //         return:'all'
        //     },
        //     headers:getHeader()
        // }).then(function (response) {
        //     that.setState({
        //         categoryArr:response.data.data
        //     })
        // });
    }
    onChangeSearchText = (value)=> {
        const {page, q, start_at, end_at, order,status,ep_type} = this.props;
        this.props.onChangeSearch(1, value, start_at, end_at, order,status,ep_type)
    };
    onChangeSearchType = (value)=> {
        const {page, q, start_at, end_at, order,status,ep_type} = this.props;
        this.props.onChangeSearch(1, q, start_at, end_at, order,status,value)
    };
    onChangeStartDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order,ep_type,status} = this.props;
        this.props.onChangeSearch(1, q, dateString, end_at, order,status,ep_type)
    }
    onChangeEndDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order,ep_type,status} = this.props;
        this.props.onChangeSearch(1, q, start_at, dateString, order,status,ep_type)
    }
    onChangeOrder = (order)=> {
        console.log(order)
        const {page, q, start_at, end_at,ep_type,status} = this.props;
        this.props.onChangeSearch(1, q, start_at, end_at, order,status,ep_type)
    }
    onChangeCategory_uuid=(category_uuid)=>{
        console.log(category_uuid);
        if(category_uuid==='chose'){
            category_uuid=''
        }
        const {page, q, start_at, end_at,order,status,ep_type} = this.props;
        this.props.onChangeSearch(1, q, start_at, end_at, order,status,ep_type)
    }
    onChangeOnline_status=(status)=>{
        console.log(status);
        if(status==='0'){
            status=''
        }
        const {page, q, start_at, end_at,order,ep_type} = this.props;
        this.props.onChangeSearch(1, q, start_at, end_at, order,status,ep_type)
    }
    render() {
        console.log("this.props", this.props.order ? this.props.order : 'asc');
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className="search-wrap">
                <Select defaultValue={ 'asc' } value={this.props.order} onChange={this.onChangeOrder}>
                    <Option value="asc">升序</Option>
                    <Option value="desc">降序</Option>
                </Select><span className="ant-divider"/>
                <span>设备名称:</span>
                <Search
                    defaultValue={''}
                    style={{width: 150}}
                    onSearch={value => this.onChangeSearchText(value)}
                /><span className="ant-divider"/>
                <span>类型:</span>
                <Search
                    defaultValue={''}
                    style={{width: 100}}
                    onSearch={value => this.onChangeSearchType(value)}
                /><span className="ant-divider"/>
                {this.props.type === 'endpointDetail' ?
                    <span>
                        <span>
                            类型:
                        </span>
                        <Select style={{ width: 120 }}  defaultValue={ 'chose' } onChange={this.onChangeCategory_uuid}>
                             <Option value="chose">所有类型</Option>
                            { this.state.categoryArr.map(item => <Option key={item.uuid} value={item.uuid}>{item.name}</Option>) }
                        </Select>
                        <span className="ant-divider"/>

                    </span> : null}
                <span>
                            状态:
                        </span>
                <Select style={{ width: 120 }}   defaultValue={ '0' } onChange={this.onChangeOnline_status}>
                    <Option value="0">所有状态</Option>
                    <Option value="1">在线</Option>
                    <Option value="-1">离线</Option>
                    <Option value="-2">未激活</Option>
                </Select>
                <span className="ant-divider"/>
                <span>开始时间: </span><DatePicker
                onChange={this.onChangeStartDate}/><span className="ant-divider"/>
                <span>结束时间: </span><DatePicker
                onChange={this.onChangeEndDate}/><span className="ant-divider"/>
            </div>

        );
    }
}

export default TopicTable;