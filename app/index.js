import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {IndexRoute, Router, Route, hashHistory,browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import App from './components/App/app';
import Home from './components/Home/home';
import Page2 from './components/Page2/page2';
import Page3 from './components/Page3/page3';
import Basic from './components/BasicOperation/basic';
import {message} from 'antd';
const store = configureStore(window.__REDUX_STATE__,window.devToolsExtension && window.devToolsExtension());
const history = syncHistoryWithStore(browserHistory, store)

function checkLogin(nextState, replace){
    const isLogin=store.getState().loginState.login;
    console.log(isLogin)
    if(!isLogin){
        message.error("请先登录");
        return false;
    }
}
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="page2"  component={Page2}/>
                <Route path="page3" component={Page3}/>
                <Route path="/basic" component={Basic}/>
            </Route>
        </Router>
    </Provider>,
  document.getElementById('root')
);
