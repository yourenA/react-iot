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
            dataIndex: 'allow_publish',
            key: 'allow_publish',
            render: (text, record, index)=> {
                if (record.allow_publish === 1 && record.allow_subscribe === 1) {
                    return (
                        <p>订阅+发布</p>
                    )
                } else if (record.allow_publish === 1 && record.allow_subscribe === -1) {
                    return (
                        <p>发布</p>
                    )
                } else if (record.allow_publish === -1 && record.allow_subscribe === 1) {
                    return (
                        <p>订阅</p>
                    )
                } else {
                    return null
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