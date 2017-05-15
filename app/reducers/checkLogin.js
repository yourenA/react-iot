/**
 * Created by Administrator on 2017/3/8.
 */
import {ACTIVE_FAIL,ACTIVE_SUCCESS,LOGIN_SUCCESS,LOGIN_FAIL,SIGNOUT_SUCCESS,SIGNOUT_FAIL,SHOWLOGINDIV,SHOWREGISTERDIV,HIDEMASK} from '../actions/checkLogin';

const initLogin={
    login:false,
    username:'',
    token:'',
    showMask: false,
    showLoginDiv: false,
    showRegisterDiv: false,
    activeSuccess:true
};
export default function login(state = initLogin ,action){
    switch (action.type){
        case LOGIN_SUCCESS:
            return Object.assign({},state,{login:true,activeSuccess:true,username:action.username,token:action.token,showMask: false,showLoginDiv:false});
        case LOGIN_FAIL:
            return Object.assign({},state,{login:false,username:action.username,showMask: true,showLoginDiv:true});
        case ACTIVE_FAIL:
            return Object.assign({},state,{login:false,activeSuccess:false,showMask: true,showLoginDiv:true});
        case SIGNOUT_SUCCESS:
            return Object.assign({},state,{login:false,username:'',token:''});
        case SIGNOUT_FAIL:
            return Object.assign({},state,{login:false,username:'',token:'',showMask: true, showLoginDiv: true,showRegisterDiv: false});
        case SHOWLOGINDIV:
            return Object.assign({},state,{showMask: true, showLoginDiv: true,showRegisterDiv: false});
        case SHOWREGISTERDIV:
            return Object.assign({},state,{showMask: true, showLoginDiv: false,showRegisterDiv: true});
        case HIDEMASK:
            return Object.assign({},state,{showMask: false, showLoginDiv: false,showRegisterDiv: false});
        default:
            return state;
    }
}