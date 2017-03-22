import axios from 'axios';
export const GET_POLICIES_REQUEST = 'GET_POLICIES_REQUEST';
export const GET_POLICIES_SUCCEED = 'GET_POLICIES_SUCCEED';
export const GET_POLICIES_FAILED = 'GET_POLICIES_FAILED';
import {getHeader} from './../common/common.js';
import messageJson from './../common/message.json';
import configJson from './../../config.json';
import {message} from 'antd';
exports.fetchPolicies = (page=1,q='')=> {
    return async(dispatch)=> {
        dispatch(policiesRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/endpoints`,
                method: 'get',
                params: {
                    page:page,
                    q:q
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get endpoints',data);
            return dispatch(policiesSucceed(data,page,q))

        } catch (e) {
            return dispatch(policiesFailed(e));
        }
    }
};

const policiesRequest = ()=>({
    type: GET_POLICIES_REQUEST
});

const policiesSucceed = (data,page,q)=>({
    type: GET_POLICIES_SUCCEED,
    data: data,
    page:page,
    q:q
});

const policiesFailed = (error)=> {
    console.log('server state get failed', error);
    message.error(messageJson['token fail']);
    return {
        type: GET_POLICIES_FAILED,
        error
    }
};
