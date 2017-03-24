import { combineReducers } from 'redux';
import loginState from './checkLogin';
import { routerReducer } from 'react-router-redux'
import endpoints from './endpoints';
import device_categories from './device_categories';
import device_groups from './device_groups';
import policies from './policies';
export default combineReducers({
	policies,
	device_groups,
	device_categories,
	endpoints,
	loginState,
	routing: routerReducer
});
