/**
 * Created by Administrator on 2017/3/7.
 */
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