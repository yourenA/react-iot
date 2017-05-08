import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {IndexRoute, Router, Route, hashHistory, browserHistory} from 'react-router';
import App from './components/App/app';
import Home from './components/Home/home';
import Connect_test from './components/Endpoints/connectTest';
import Basic from './components/BasicOperation/basic';
import Temperature from './components/Temperature/index';
import {message} from 'antd';
import {showLogin, checkLogin} from './actions/checkLogin'
const store = configureStore(window.__REDUX_STATE__, window.devToolsExtension && window.devToolsExtension());
exports.store  = store;
function checkLoginStatus(nextState, replace) {
    store.dispatch(checkLogin());
    const isLogin = store.getState().loginState.login;
    console.log("isLogin", isLogin)
    if (!isLogin) {
        message.error("请先登录");
        replace('/');
        store.dispatch(showLogin())
    }
}
let Edit_password = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('./components/EditPassword/index'));
    },'Edit_password');
};
let EndPoints = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('./components/Endpoints/endpoints'));
    },'EndPoints');
};

let OrganizationRegister = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('./components/OrganizationRegister/index'));
    },'OrganizationRegister');
};
// let EndPointDetail = (location,cb) => {
//     require.ensure([],require => {
//         cb(null,require('./components/Endpoints/endpointDetail'));
//     },'EndPointDetail');
// };
// let Device_categories = (location,cb) => {
//     require.ensure([],require => {
//         cb(null,require('./components/Device_categories/device_categories'));
//     },'Device_categories');
// };
// let Policies = (location,cb) => {
//     require.ensure([],require => {
//         cb(null,require('./components/Policies/policies'));
//     },'Policies');
// };
// let Device_groups = (location,cb) => {
//     require.ensure([],require => {
//         cb(null,require('./components/Device_groups/index'));
//     },'Device_groups');
// };
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="organization_register" getComponent={OrganizationRegister} />
                <Route path="basic" onEnter={checkLoginStatus} component={Basic}>
                    <IndexRoute getComponent={EndPoints}/>
                    <Route >
                        <Route path="/basic/endpoints/:uuid/connect_test" component={Connect_test}/>
                        {/*<Route path="endpoints/:uuid" getComponent={EndPointDetail}>
                        </Route>*/}

                    </Route>
                    {/*<Route path="device_categories" getComponent={Device_categories}/>*/}
                    {/*<Route path="policies" getComponent={Policies}/>*/}
                    {/*<Route path="device_groups" getComponent={Device_groups}/>*/}
                    <Route path="edit_password" getComponent={Edit_password}/>
                    <Route path="temperature" component={Temperature}/>
                </Route>
            </Route>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);
