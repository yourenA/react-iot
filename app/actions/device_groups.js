import axios from 'axios';
import {converErrorCodeToMsg} from './../common/common.js';
export const GET_DEVICE_GROUPS_REQUEST = 'GET_DEVICE_GROUPS_REQUEST';
export const GET_DEVICE_GROUPS_SUCCEED = 'GET_DEVICE_GROUPS_SUCCEED';
export const GET_DEVICE_GROUPS_FAILED = 'GET_DEVICE_GROUPS_FAILED';
import {getHeader} from './../common/common.js';
import configJson from './../../config.json';
exports.fetchDevice_groups = (page=1,q='',start_at='',end_at='',order='asc')=> {
    return async(dispatch)=> {
        dispatch(device_groupsRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/device_groups`,
                method: 'get',
                params: {
                    page:page,
                    q:q,
                    start_at:start_at,
                    end_at:end_at,
                    order:order
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get device_groups',data);
            return dispatch(device_groupsSucceed(data,page,q,start_at,end_at,order))

        } catch (e) {
            return dispatch(device_groupsFailed(e));
        }
    }
};

const device_groupsRequest = ()=>({
    type: GET_DEVICE_GROUPS_REQUEST
});

const device_groupsSucceed = (data,page,q,start_at,end_at,order)=>({
    type: GET_DEVICE_GROUPS_SUCCEED,
    data: data,
    page:page,
    q:q,
    start_at:start_at,
    end_at:end_at,
    order:order
});

const device_groupsFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error)
    return {
        type: GET_DEVICE_GROUPS_FAILED,
        error
    }
};
