import { combineReducers } from 'redux';
import loginState from './checkLogin';
import { routerReducer } from 'react-router-redux'
import news from './news';
import endpoints from './endpoints';
import device_categories from './device_categories';
export default combineReducers({
	device_categories,
	endpoints,
	news,
	loginState,
	routing: routerReducer
});
