import { combineReducers } from 'redux';
import loginState from './checkLogin';
import { routerReducer } from 'react-router-redux'
export default combineReducers({
	loginState,
	routing: routerReducer
});
