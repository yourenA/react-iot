/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input, Select, DatePicker} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
import moment from 'moment';
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: this.props.q,
            order:'asc'
        };
    }
    onChangeSearchText = (value)=> {
        const {page, q, start_at, end_at, order} = this.props;
        this.props.onChangeSearch(page, value, start_at, end_at, order)
    };
    onChangeStartDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order} = this.props;
        this.props.onChangeSearch(page, q, dateString, end_at, order)
    }
    onChangeEndDate = (date, dateString)=> {
        console.log(date, dateString);
        const {page, q, start_at, end_at, order} = this.props;
        this.props.onChangeSearch(page, q, start_at, dateString, order)
    }
    onChangeOrder = (order)=> {
        console.log(order)
        const {page, q, start_at, end_at} = this.props;
        this.props.onChangeSearch(page, q, start_at, end_at, order)
        this.setState({
            order:order
        })
    }
    onChange=(e)=>{
        this.setState({
            q:e.target.value
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.q !== this.props.q) {
            this.setState({
                q:nextProps.q
            })
        }
        if (nextProps.order !== this.props.order) {
            this.setState({
                order:nextProps.order
            })
        }
    }
    render() {
        console.log('q',this.props.q)
        return (
            <div className="search-wrap">
                <Select value={this.state.order} onChange={this.onChangeOrder}>
                    <Option value="asc">升序</Option>
                    <Option value="desc">降序</Option>
                </Select><span className="ant-divider"/>
                <Search
                    value={this.state.q}
                    placeholder="input search text"
                    style={{width: 200}}
                    onChange={this.onChange}
                    onSearch={value => this.onChangeSearchText(value)}
                /><span className="ant-divider"/>
                <span>开始时间: </span><DatePicker
                onChange={this.onChangeStartDate}/><span className="ant-divider"/>
                <span>结束时间: </span><DatePicker onChange={this.onChangeEndDate}/><span className="ant-divider"/>
            </div>

        );
    }
}

export default TopicTable;