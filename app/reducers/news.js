import {GET_NEWS_FAILED, GET_NEWS_SUCCEED, GET_NEWS_REQUEST} from '../actions/news';

export default (state = {page: 1}, action) => {
	switch (action.type) {
		case GET_NEWS_REQUEST:
			return {...state};
		case GET_NEWS_SUCCEED:
			const _data = {
				list: action.data.data,
				count: action.data.data.length,
				loaded: true,
				page:action.page
			};
			return {...state, ..._data};
		case GET_NEWS_FAILED:
			return {...state, loaded: false};
		default:
			return state
	}
}
