import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/app';
import Home from './components/Home/home';
import Page2 from './components/Page2/page2';
import Page3 from './components/Page3/page3';
import {Router,Route,IndexRoute,hashHistory,browserHistory} from 'react-router';
import {isLogin} from './common/common'
import {message} from 'antd';
function checkLogin(nextState, replace){
    console.log(isLogin())
    if(!isLogin()){
        message.error("请先登录");
        return false;
    }

}
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="page2" onEnter={checkLogin} component={Page2}/>
            <Route path="page3" component={Page3}/>
        </Route>
    </Router>,
  document.getElementById('root')
);
