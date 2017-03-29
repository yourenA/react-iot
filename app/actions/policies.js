import axios from 'axios';
import {converErrorCodeToMsg} from './../common/common.js';
export const GET_POLICIES_REQUEST = 'GET_POLICIES_REQUEST';
export const GET_POLICIES_SUCCEED = 'GET_POLICIES_SUCCEED';
export const GET_POLICIES_FAILED = 'GET_POLICIES_FAILED';
export const GET_ALL_ENDPOINTS_SUCCEED = 'GET_ALL_ENDPOINTS_SUCCEED';
export const GET_ALL_ENDPOINTS_FAILED = 'GET_ALL_ENDPOINTS_FAILED';
import {getHeader} from './../common/common.js';
import configJson from './../../config.json';

exports.fetchAllEndpoints=()=>{
    return async(dispatch)=> {
        try {
            let response = await axios({
                url:`${configJson.prefix}/endpoints`,
                method: 'get',
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get all polices',data);
            if(data.data.length>0){
                dispatch(fetchPolicies(1,'',data.data[0].uuid));
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

const fetchPolicies = (page=1,q='',endpoint_uuid)=> {
    return async(dispatch)=> {
        dispatch(policiesRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/endpoints/${endpoint_uuid}/policies`,
                method: 'get',
                params: {
                    page:page,
                    q:q
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get policies',data);
            return dispatch(policiesSucceed(data,page,q,endpoint_uuid))

        } catch (e) {
            return dispatch(policiesFailed(e));
        }
    }
};
exports.fetchPolicies=fetchPolicies;
const policiesRequest = ()=>({
    type: GET_POLICIES_REQUEST
});

const policiesSucceed = (data,page,q,endpoint_uuid)=>({
    type: GET_POLICIES_SUCCEED,
    data: data,
    page:page,
    q:q,
    endpoint_uuid:endpoint_uuid
});

const policiesFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error)
    return {
        type: GET_POLICIES_FAILED,
        error
    }
};
