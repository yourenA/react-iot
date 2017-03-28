import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {IndexRoute, Router, Route, hashHistory,browserHistory } from 'react-router';
import App from './components/App/app';
import Home from './components/Home/home';
import EndPoints from './components/Endpoints/endpoints';
import EndPointDetail from './components/Endpoints/endpointDetail';
import Device_categories from './components/Device_categories/device_categories';
import Device_groups from './components/Device_groups/index';
import Policies from './components/Policies/policies';
import Edit_password from './components/EditPassword/index';
import Connect_test from './components/Endpoints/connectTest';
import Basic from './components/BasicOperation/basic';
import {message} from 'antd';
import {showLogin,checkLogin} from './actions/checkLogin'
const store = configureStore(window.__REDUX_STATE__,window.devToolsExtension && window.devToolsExtension());

function checkLoginStatus(nextState, replace){
    store.dispatch(checkLogin());
    const isLogin=store.getState().loginState.login;
    console.log("isLogin",isLogin)
    if(!isLogin){
        message.error("请先登录");
        replace('/');
        store.dispatch(showLogin())
    }
}
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="basic" onEnter={checkLoginStatus} component={Basic}>
                    <IndexRoute component={EndPoints}/>
                    <Route >
                        <Route path="/basic/endpoints/:uuid/connect_test" component={Connect_test}/>
                        <Route path="endpoints/:uuid" component={EndPointDetail} >
                        </Route>

                    </Route>
                    <Route path="device_categories" component={Device_categories}/>
                    <Route path="policies" component={Policies}/>
                    <Route path="device_groups" component={Device_groups}/>
                    <Route path="edit_password" component={Edit_password}/>

                </Route>
            </Route>
        </Router>
    </Provider>,
  document.getElementById('root')
);
