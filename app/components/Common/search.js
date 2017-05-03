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
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories`,
            method: 'get',
            params:{
                return:'all'
            },
            headers:getHeader()
        }).then(function (response) {
            that.setState({
                categoryArr:response.data.data
            })
        });
    }
    onChangeSearchText = (value)=> {
        const {page, q, start_at, end_at, order,category_uuid,online_status} = this.props;
        this.props.onChangeSearch(page, value, start_at, end_at, order,category_uuid,online_status)
    };
    onChangeStartDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order,category_uuid,online_status} = this.props;
        this.props.onChangeSearch(page, q, dateString, end_at, order,category_uuid,online_status)
    }
    onChangeEndDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order,category_uuid,online_status} = this.props;
        this.props.onChangeSearch(page, q, start_at, dateString, order,category_uuid,online_status)
    }
    onChangeOrder = (order)=> {
        console.log(order)
        const {page, q, start_at, end_at,category_uuid,online_status} = this.props;
        this.props.onChangeSearch(page, q, start_at, end_at, order,category_uuid,online_status)
    }
    onChangeCategory_uuid=(category_uuid)=>{
        console.log(category_uuid);
        if(category_uuid==='chose'){
            category_uuid=''
        }
        const {page, q, start_at, end_at,order,online_status} = this.props;
        this.props.onChangeSearch(page, q, start_at, end_at, order,category_uuid,online_status)
    }
    onChangeOnline_status=(online_status)=>{
        console.log(online_status);
        if(online_status==='chose'){
            online_status=''
        }
        const {page, q, start_at, end_at,order,category_uuid} = this.props;
        this.props.onChangeSearch(page, q, start_at, end_at, order,category_uuid,online_status)
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
                    placeholder="input search text"
                    style={{width: 200}}
                    onSearch={value => this.onChangeSearchText(value)}
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
                        <span>
                            状态:
                        </span>
                        <Select style={{ width: 120 }}   defaultValue={ 'chose' } onChange={this.onChangeOnline_status}>
                             <Option value="chose">所有状态</Option>
                            <Option value="online">在线</Option>
                            <Option value="offline">离线</Option>
                        </Select>
                        <span className="ant-divider"/>
                    </span> : null}
                <span>开始时间: </span><DatePicker
                onChange={this.onChangeStartDate}/><span className="ant-divider"/>
                <span>结束时间: </span><DatePicker
                onChange={this.onChangeEndDate}/><span className="ant-divider"/>
            </div>

        );
    }
}

export default TopicTable;