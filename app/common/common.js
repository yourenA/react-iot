/**
 * Created by Administrator on 2017/3/7.
 */
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

exports.removeLoginStorage = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('usertoken');
    localStorage.removeItem('username');
    localStorage.removeItem('usertoken');
};

/**
 * 获取头信息
 * */
exports.getHeader = () => {
    return {Authorization:`Bearer ${sessionStorage.getItem('usertoken') ||localStorage.getItem('usertoken')}`}
};
