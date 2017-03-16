import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Pagination, Select, Alert} from 'antd';
import {fetchNews} from '../../actions/news';
import './news.scss'
@connect(
	state => state.news,
)

class News extends Component {
	static fetch(state, dispatch,limit) {
		const fetchTasks = [];
		fetchTasks.push(
			dispatch(fetchNews(limit))
		);
		return fetchTasks
	}

	componentDidMount() {
		/*通过设置loaded，切换路由的时候就不会重复发送请求*/
		const {loaded} = this.props;
		if (!loaded) {
			this.constructor.fetch(this.props, this.props.dispatch)
		}
	}

	onChange = (page) => {
		console.log(page);
		this.constructor.fetch(this.props, this.props.dispatch,page);
	}

	render() {
		const {list = [], count = 0, loaded,page} = this.props;

		const newsList = list.map((v, i)=> {
			return (
				<div className="news-item" key={i} style={{overflow: "hidden"}}>
					<img src={v.author.avatar_url} className="news-con-img"/>
					<div className="news-con-txt">
						<h3 className="news-con-tit">{v.title}</h3>
						<br/>
					</div>
				</div>
			)
		});

		return (
			<div style={{background: '#F9F9F9', padding: '30px'}}>
				<Alert message="强制刷新这个页面，数据从服务端渲染加载，点击下面的分页，数据异步加载" type="info" closeText="关闭"/>
				<div>
					{ newsList }
				</div>
				<div style={{textAlign: "center", padding: "40px 0 0"}}>
					<Pagination
						total={40}
						current={page}
						onChange={ this.onChange}
						showTotal={total => `共 ${total} 篇`}
						pageSize={10}
					/>
				</div>
			</div>
		)
	}
}

export default News;
