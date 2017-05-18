/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import {Link,IndexLink} from 'react-router'
class Nav extends Component {
    showOrHoidePhoneMenu=()=>{
        const clientW=document.documentElement.clientWidth;
        let listDispaly=document.querySelector('.nav_list').style.display;
        if(clientW <= 890){
            if(listDispaly==='block'){
                document.querySelector('.nav_list').style.display='none'
            }else{
                document.querySelector('.nav_list').style.display='block'
            }
        }
    };
    render() {
        return (
            <div className="nav">
                <ul ref="nav_list" className="nav_list" onClick={this.showOrHoidePhoneMenu}  >
                    <li >
                        <IndexLink  to="/"  activeClassName="actived">首页</IndexLink>
                    </li>
                    <li >
                        <Link   activeClassName="actived">解决方案</Link>
                    </li>
                    <li >
                        <Link activeClassName="actived">合作与生态</Link>
                    </li>
                    <li >
                        <Link>帮助与支持</Link>
                    </li>
                    <li >
                        <Link to="/organization_register" activeClassName="actived">新机构注册</Link>
                    </li>
                    {
                        this.props.loginState.username?
                            <li >
                                <Link to="/basic" activeClassName="actived">管理控制台</Link>
                            </li>:
                            null
                    }

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
