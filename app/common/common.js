/**
 * Created by Administrator on 2017/3/7.
 */
exports.isLogin = () => {
    const username=localStorage.getItem('username') ||sessionStorage.getItem('username');
    const token=localStorage.getItem('usertoken') ||sessionStorage.getItem('usertoken');
    if(username && token){
        return true
    }else{
        return false
    }
};