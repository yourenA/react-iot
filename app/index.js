import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {IndexRoute, Router, Route, hashHistory,browserHistory } from 'react-router';
import App from './components/App/app';
import Home from './components/Home/home';
import EndPoints from './components/Endpoints/endpoints';
import Device_categories from './components/Device_categories/device_categories';
import News from './components/News/news';
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
                <Route path="news"  component={News}/>
                <Route path="endpoints" onEnter={checkLoginStatus} component={EndPoints}/>
                <Route path="basic" onEnter={checkLoginStatus} component={Basic}>
                    <IndexRoute component={EndPoints}/>
                    <Route path="news" component={News}/>
                    <Route path="device_categories" component={Device_categories}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
  document.getElementById('root')
);
