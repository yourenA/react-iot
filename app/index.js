import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/app';
import Home from './components/Home/home';
import Page2 from './components/Page2/page2';
import Page3 from './components/Page3/page3';
import {Router,Route,IndexRoute,hashHistory,browserHistory} from 'react-router';
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="page2" component={Page2}/>
            <Route path="page3" component={Page3}/>
        </Route>
    </Router>,
  document.getElementById('root')
);
