/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Link,IndexLink} from 'react-router'
import $ from 'jquery'
class Nav extends Component {
    showOrHoidePhoneMenu=()=>{
        const clientW=document.documentElement.clientWidth

        if(clientW <= 620){
            $(".nav ul").slideToggle(200);
        }
    }
    render() {
        return (
            <div className="nav">
                <ul ref="nav_list" onClick={this.showOrHoidePhoneMenu}  >
                    <li >
                        <IndexLink  to="/"  activeClassName="actived">网站首页</IndexLink>
                    </li>
                    <li >
                        <Link to="/page2"  activeClassName="actived">公司案例</Link>
                    </li>
                    <li >
                        <Link to="/page3" activeClassName="actived">公司相册</Link>
                    </li>
                    <li >
                        <Link  >团队博客</Link>
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
