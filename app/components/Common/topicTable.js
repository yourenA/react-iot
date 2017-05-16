/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Table} from 'antd';
class TopicTable extends Component {
    render() {
        const columns = [{
            title: '主题',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '权限',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index)=> {
                if (record.type==='pub') {
                    return (
                        <p>发布</p>
                    )
                } else if (record.type==='sub') {
                    return (
                        <p>订阅</p>
                    )
                }

            }
        }];

        return (
            <Table
                style={{width: '300px'}}
                size="small"
                rowKey="authority"
                columns={columns}
                dataSource={this.props.dataSource}
                pagination={false}
            />

        );
    }
}

export default TopicTable;