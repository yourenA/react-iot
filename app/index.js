import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/app';
import Home from './components/Home/home';
import {Router,Route,IndexRoute,hashHistory,browserHistory} from 'react-router'
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
        </Route>
    </Router>,
  document.getElementById('root')
);
