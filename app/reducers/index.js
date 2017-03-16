import { combineReducers } from 'redux';
import loginState from './checkLogin';
import { routerReducer } from 'react-router-redux'
import news from './news';
import endpoints from './endpoints';
export default combineReducers({
	endpoints,
	news,
	loginState,
	routing: routerReducer
});
