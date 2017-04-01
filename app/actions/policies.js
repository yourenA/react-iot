import axios from 'axios';
import {converErrorCodeToMsg} from './../common/common.js';
export const GET_POLICIES_REQUEST = 'GET_POLICIES_REQUEST';
export const GET_POLICIES_SUCCEED = 'GET_POLICIES_SUCCEED';
export const GET_POLICIES_FAILED = 'GET_POLICIES_FAILED';
export const GET_ALL_ENDPOINTS_SUCCEED = 'GET_ALL_ENDPOINTS_SUCCEED';
export const GET_ALL_ENDPOINTS_FAILED = 'GET_ALL_ENDPOINTS_FAILED';
import {getHeader} from './../common/common.js';
import configJson from './../../config.json';
import {browserHistory,hashHistory } from 'react-router'
import {message} from 'antd'
exports.fetchAllEndpoints=()=>{
    return async(dispatch)=> {
        try {
            let response = await axios({
                url:`${configJson.prefix}/endpoints`,
                method: 'get',
                params: {
                    return:'all'
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get all polices',data);
            if(data.data.length>0){
                dispatch(fetchPolicies(1,'',data.data[0].uuid));
            }else{
                message.error("请先新建设备域");
                hashHistory.replace('/basic');
            }
            return dispatch(getEndpointsSucceed(data))

        } catch (e) {
            return dispatch(getEndpointsFailed(e));
        }
    }
};
const getEndpointsSucceed = (data)=>({
    type: GET_ALL_ENDPOINTS_SUCCEED,
    endpointsData: data
});

const getEndpointsFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error);
    return {
        type: GET_ALL_ENDPOINTS_FAILED,
        error
    }
};

const fetchPolicies = (page=1,q='',endpoint_uuid,start_at='',end_at='',order='asc')=> {
    return async(dispatch)=> {
        dispatch(policiesRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/endpoints/${endpoint_uuid}/policies`,
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
            console.log('get policies',data);
            return dispatch(policiesSucceed(data,page,q,endpoint_uuid,start_at,end_at,order))

        } catch (e) {
            return dispatch(policiesFailed(e));
        }
    }
};
exports.fetchPolicies=fetchPolicies;
const policiesRequest = ()=>({
    type: GET_POLICIES_REQUEST
});

const policiesSucceed = (data,page,q,endpoint_uuid,start_at,end_at,order)=>({
    type: GET_POLICIES_SUCCEED,
    data: data,
    page:page,
    q:q,
    endpoint_uuid:endpoint_uuid,
    start_at:start_at,
    end_at:end_at,
    order:order
});

const policiesFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error)
    return {
        type: GET_POLICIES_FAILED,
        error
    }
};
