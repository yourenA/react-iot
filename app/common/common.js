/**
 * Created by Administrator on 2017/3/7.
 */
import {message } from 'antd';
import messageJson from './message.json';
/**
 * 接入管理表单ItemLayout
 * */
exports.formItemLayout={
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    }
};
exports.formItemLayoutForOrganize={
    labelCol: {
        sm: {span: 4},
    },
    wrapperCol: {
        sm: {span: 20},
    }
};
exports.formItemLayoutWithLabel={
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    }
};
exports.formItemLayoutWithOutLabel={
    wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 18, offset: 6},
    },
};
/**
 * 通过storage判断是否登陆
 * */
exports.isLogin = () => {
    const username=localStorage.getItem('username') ||sessionStorage.getItem('username');
    const token=localStorage.getItem('usertoken') ||sessionStorage.getItem('usertoken');
    if(username && token){
        return true
    }else{
        return false
    }
};

/**
 * 消除登陆状态storage
 * */

const removeLoginStorage = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('usertoken');
    sessionStorage.removeItem('userPermissions');
    sessionStorage.clear();
    localStorage.removeItem('username');
    localStorage.removeItem('usertoken');
    localStorage.removeItem('userPermissions');
    localStorage.clear();
};
exports.removeLoginStorage=removeLoginStorage;
/**
 * 获取头信息
 * */
exports.getHeader = () => {
    return {Authorization:`Bearer ${sessionStorage.getItem('usertoken') ||localStorage.getItem('usertoken')}`}
};

/**
 * 将策略form表单转换为发送数据
 * */
exports.convertFormToData  = (form) => {
    const addPoliciesDate = {
        name: form.name,
        description: form.desc,
        topics: []
    };
    for (var k in form) {
        if (k.indexOf('topics') >= 0) {
            if (form.hasOwnProperty(k)) {
                if(form[k]===undefined){
                    return false
                }
                if (form[k].authority == 0) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: -1,
                        allow_subscribe: 1
                    })
                } else if (form[k].authority == 1) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: 1,
                        allow_subscribe: -1
                    })
                } else if (form[k].authority == 2) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: 1,
                        allow_subscribe: 1
                    })
                }else{
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: form[k].allow_publish,
                        allow_subscribe: form[k].allow_subscribe
                    })
                }
            }
        }
    }

    return addPoliciesDate;
};
/**
 * 将订阅主题表单转换为发送数据
 * */
exports.convertSubFormToData  = (form) => {
    const topics= {}
    for (var k in form) {
        if (k.indexOf('topics') >= 0) {
            if (form.hasOwnProperty(k)) {
                topics[`${form[k].theme}`]=parseInt(form[k].QoS);
            }
        }
    }

    return topics;
};
/**
 * 将订阅主题表单转换为发送数据
 * */
exports.getUrlParam  = (name) => {
    const search=window.location.href.split('?')[window.location.href.split('?').length-1];
    const searchParam=search.split('&');
    for(let i=0,len=searchParam.length;i<len;i++){
        const eachParam=searchParam[i].split('=');
        if(eachParam[0]===name){
            return eachParam[1]
        }
    }
    return null
};

/**
 *  判断错误码(数组)
 * */
import {hashHistory } from 'react-router';
import {showLogin,signout} from './../actions/checkLogin';
import {store} from './../index'
exports.converErrorCodeToMsg  = (error) => {
    console.log("error",error.toString())
    if(error.toString()==='Error: Network Error'){
        message.error(messageJson['network error'],3);
        return false
    }
    if (error.response.status === 401) {
        message.error(messageJson['token fail']);
        removeLoginStorage();
        setTimeout(()=>{
            hashHistory.replace('/');
            store.dispatch(signout());
            store.dispatch(showLogin());
        },1000)
    }else  if(!error.response.data.errors){
        message.error(error.response.data.message);
    } else if(error.response.status === 422){
        let first;
        for ( first in error.response.data.errors) break;
        message.error(`${error.response.data.errors[first][0]}`);
    }else {
        message.error(messageJson['unknown error']);
    }
}

/**
 *  获取用户权限
 * */
exports.getUserPermission  = (name) => {
    const allPermisssions=JSON.parse(sessionStorage.getItem('userPermissions')||locationShape.getItem('userPermissions'));
    for(let i=0,len=allPermisssions.len;i<len;i++){
        if(allPermisssions[i].name===name){
            return true
        }
    }
    return false
};