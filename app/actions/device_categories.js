import axios from 'axios';
import {converErrorCodeToMsg} from './../common/common.js';
export const GET_DEVICE_CATEGORIES_REQUEST = 'GET_DEVICE_CATEGORIES_REQUEST';
export const GET_DEVICE_CATEGORIES_SUCCEED = 'GET_DEVICE_CATEGORIES_SUCCEED';
export const GET_DEVICE_CATEGORIES_FAILED = 'GET_DEVICE_CATEGORIES_FAILED';
import {getHeader} from './../common/common.js';
import configJson from './../../config.json';
exports.fetchDevice_categories = (page=1,q='')=> {
    return async(dispatch)=> {
        dispatch(device_categoriesRequest());
        try {
            let response = await axios({
                url:`${configJson.prefix}/device_categories`,
                method: 'get',
                params: {
                    page:page,
                    q:q
                },
                headers:getHeader()
            });
            let data = await response.data;
            console.log('get device_categories',data);
            return dispatch(device_categoriesSucceed(data,page,q))

        } catch (e) {
            return dispatch(device_categoriesFailed(e));
        }
    }
};

const device_categoriesRequest = ()=>({
    type: GET_DEVICE_CATEGORIES_REQUEST
});

const device_categoriesSucceed = (data,page,q)=>({
    type: GET_DEVICE_CATEGORIES_SUCCEED,
    data: data,
    page:page,
    q:q
});

const device_categoriesFailed = (error)=> {
    console.log('server state get failed', error);
    converErrorCodeToMsg(error)
    return {
        type: GET_DEVICE_CATEGORIES_FAILED,
        error
    }
};
