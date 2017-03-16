/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Link,IndexLink,browserHistory } from 'react-router'
import $ from 'jquery';
import {message} from 'antd';
class Nav extends Component {
    showOrHoidePhoneMenu=()=>{
        const clientW=document.documentElement.clientWidth

        if(clientW <= 740){
            $(".nav ul").slideToggle(200);
        }
    };
    checkLogin=(event)=>{
        event.preventDefault();
        console.log("event.target.href",(event.target.href).split('/'))
        if(this.props.loginState.login){
            browserHistory.push((event.target.href).split('/')[3]);
        }else{

            message.error("请先登录");
            this.props.showLogin()
        }

    };
    render() {
        console.log("nav.props",this.props)
        return (
            <div className="nav">
                <ul ref="nav_list" onClick={this.showOrHoidePhoneMenu}  >
                    <li >
                        <IndexLink  to="/"  activeClassName="actived">网站首页</IndexLink>
                    </li>
                    <li >
                        <Link  to="/page2" onClick={this.checkLogin} activeClassName="actived">公司案例</Link>
                    </li>
                    <li >
                        <Link to="/page3" onClick={this.checkLogin}  activeClassName="actived">公司相册</Link>
                    </li>
                    <li >
                        <Link to="/basic" onClick={this.checkLogin}  activeClassName="actived" >基本操作</Link>
                    </li>
                    <li >
                        <Link >关于我们</Link>
                    </li>
                </ul>
                <div className="menu-icon" onClick={this.showOrHoidePhoneMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }
}

export default Nav;
