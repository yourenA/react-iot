import axios from 'axios';
export const GET_DEVICE_GROUPS_REQUEST = 'GET_DEVICE_GROUPS_REQUEST';
export const GET_DEVICE_GROUPS_SUCCEED = 'GET_DEVICE_GROUPS_SUCCEED';
export const GET_DEVICE_GROUPS_FAILED = 'GET_DEVICE_GROUPS_FAILED';
import {getHeader} from './../common/common.js';
import messageJson from './../common/message.json';
import configJson from './../../config.json';
import {message} from 'antd';
exports.fetchDevice_groups = (page=1,q='')=> {
    return async(dispatch)=> {
        dispatch(device_groupsRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/device_groups`,
                method: 'get',
                params: {
                    page:page,
                    q:q
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get device_groups',data);
            return dispatch(device_groupsSucceed(data,page,q))

        } catch (e) {
            return dispatch(device_groupsFailed(e));
        }
    }
};

const device_groupsRequest = ()=>({
    type: GET_DEVICE_GROUPS_REQUEST
});

const device_groupsSucceed = (data,page,q)=>({
    type: GET_DEVICE_GROUPS_SUCCEED,
    data: data,
    page:page,
    q:q
});

const device_groupsFailed = (error)=> {
    console.log('server state get failed', error);
    message.error(messageJson['token fail']);
    return {
        type: GET_DEVICE_GROUPS_FAILED,
        error
    }
};
