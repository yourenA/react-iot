import axios from 'axios';
export const GET_NEWS_REQUEST = 'GET_NEWS_REQUEST';
export const GET_NEWS_SUCCEED = 'GET_NEWS_SUCCEED';
export const GET_NEWS_FAILED = 'GET_NEWS_FAILED';

const fetchStateUrl = 'https://cnodejs.org/api/v1/topics';

exports.fetchNews = (page=1)=> {
	return async(dispatch)=> {
		dispatch(newsRequest());
		try {
			let response = await axios({
				url:fetchStateUrl,
				method: 'get',
				params: {
					page : page,
					limit: 10, //每页加载20条
					tab : 'all' //分页 有all ask share job good
				}
			});
			let data = await response.data;
			return dispatch(newsSucceed(data,page))

		} catch (e) {
			return dispatch(newsFailed(e));
		}
	}
};

const newsRequest = ()=>({
	type: GET_NEWS_REQUEST
});

const newsSucceed = (data,page)=>({
	type: GET_NEWS_SUCCEED,
	data: data,
	page:page
});

const newsFailed = (error)=> {
	console.log('server state get failed', error);
	return {
		type: GET_NEWS_FAILED,
		error
	}
};
