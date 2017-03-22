/**
 * Created by Administrator on 2017/3/8.
 */
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
export const SIGNOUT_FAIL = 'SIGNOUT_FAIL';
export const SHOWREGISTERDIV='SHOWREGISTERDIV'
export const SHOWLOGINDIV='SHOWLOGINDIV'
export const HIDEMASK='HIDEMASK'
import {browserHistory,hashHistory } from 'react-router'
import axios from 'axios';
import {message} from 'antd';
import messageJson from './../common/message.json';
import configJson from './../../config.json';
import {removeLoginStorage,getHeader} from './../common/common.js';
export function checkLogin() {
    return dispatch => {
        const username = localStorage.getItem('username') || sessionStorage.getItem('username');
        const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
        if (username && token) {
            dispatch({
                type: LOGIN_SUCCESS,
                username: username,
                token:token
            });
            return true
        } else {
            return false
        }
    }
}
export function login(user) {
    return dispatch => {
        axios.post(`${configJson.prefix}/login`,  {
            username:user.username,
            password:user.password
        })
            .then(function (response) {
                console.log(response);
                sessionStorage.setItem('username',user.username);
                sessionStorage.setItem('usertoken',response.data.token);
                if(user.remember === true){
                    localStorage.setItem('username',user.username);
                    localStorage.setItem('usertoken',response.data.token);
                }
                message.success(messageJson['sign in success']);
                dispatch({
                    type: LOGIN_SUCCESS,
                    username: user.username,
                    token:response.data.token
                });
            })
            .catch(function (error) {
                if(error.response.status === 403){
                    message.error(messageJson['sign in fail']);
                }else{
                    message.error(messageJson['unknown error']);
                }
            });
    }
}

export function signout() {
    return dispatch => {
        axios({
            url: 'http://local.iothub.com.cn/logout',
            method: 'post',
            headers:getHeader()
        })
            .then(function (response) {
                removeLoginStorage();
                message.success(messageJson['sign out success']);
                dispatch({
                    type: SIGNOUT_SUCCESS,
                });
                hashHistory.replace('/');
            })
            .catch(function (error) {
                removeLoginStorage();
                message.error(`${error.response.data.message},请重新登陆`);
                dispatch({
                    type: SIGNOUT_FAIL,
                });
                hashHistory.replace('/');
            });
    }
}

export function showRegister() {
    return { type: SHOWREGISTERDIV }
}

export function showLogin() {
    return { type: SHOWLOGINDIV }
}

export function hideMask() {
    return { type: HIDEMASK }
}
