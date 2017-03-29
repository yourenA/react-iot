import axios from 'axios';
import {converErrorCodeToMsg} from './../common/common.js';
export const GET_ENDPOINTS_REQUEST = 'GET_ENDPOINTS_REQUEST';
export const GET_ENDPOINTS_SUCCEED = 'GET_ENDPOINTS_SUCCEED';
export const GET_ENDPOINTS_FAILED = 'GET_ENDPOINTS_FAILED';
import {getHeader} from './../common/common.js';
import configJson from './../../config.json';
exports.fetchEndPoints = (page=1,q='')=> {
    return async(dispatch)=> {
        dispatch(endpointsRequest());
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
            return dispatch(endpointsSucceed(data,page,q))

        } catch (e) {
            return dispatch(endpointsFailed(e));
        }
    }
};

const endpointsRequest = ()=>({
    type: GET_ENDPOINTS_REQUEST
});

const endpointsSucceed = (data,page,q)=>({
    type: GET_ENDPOINTS_SUCCEED,
    data: data,
    page:page,
    q:q
});

const endpointsFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error)
    return {
        type: GET_ENDPOINTS_FAILED,
        error
    }
};
