import React, {Component} from 'react';
import {Link,IndexLink} from 'react-router'
import logo from './logo.svg';
import './App.scss'
import {message} from 'antd';
import Mask from '../Login/mask';
import LoginDiv from '../Login/login'
import RegisterDiv from '../Login/register'
import UserSubMenu from '../Login/userSubmenu'
import $ from 'jquery'
import messageJson from './../../common/message.json'
class App extends Component {
    state = {
        showMask: false,
        showLoginDiv: false,
        showRegisterDiv: false,
        username:null,
        showPhoneMenu:false
    }
    componentWillMount = ()=> {
        const username=localStorage.getItem('username') ||sessionStorage.getItem('username')  ;
        this.setState({
            username:username
        });
    }
    componentDidMount=()=>{
        console.log("mount");
        const nav_list=document.querySelector('.nav>ul');
        window.addEventListener("resize", function () {
            const clientW=document.documentElement.clientWidth;
            if(clientW > 620){
                nav_list.style.display='block'
            }else{
                nav_list.style.display='none'
            }
        }, false);

    }
    showLogin = ()=> {
        this.setState({
            showRegisterDiv: false,
            showMask: true,
            showLoginDiv: true
        });
    }
    showRegister = ()=> {
        this.setState({
            showLoginDiv: false,
            showMask: true,
            showRegisterDiv: true
        });
    }
    hideMask = ()=> {
        this.setState({
            showMask: false,
            showLoginDiv: false,
            showRegisterDiv: false
        });
    }
    login=(username)=>{
        this.setState({
            username:username
        });
    }
    loginout=()=>{
        const that=this;
        $.ajax({
            url: 'http://local.iothub.com.cn/logout',
            method: 'POST',
            headers:{Authorization:`Bearer ${localStorage.getItem('usertoken') ||sessionStorage.getItem('usertoken')}`},
            success: function(msg){
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('usertoken');
                localStorage.removeItem('username');
                localStorage.removeItem('usertoken');
                message.success(messageJson['sign out success']);
                that.setState({
                    username:null
                });
            },
            error:function (XMLHttpRequest) {
                message.error(`${XMLHttpRequest.responseJSON.message},请重新登陆`);
                that.setState({
                    username:null
                });
                that.showLogin()
            }
        });

    }
    showOrHoidePhoneMenu=()=>{
        const clientW=document.documentElement.clientWidth

        if(clientW <= 620){
            $(".nav ul").slideToggle(200);
        }
    }
    render() {
        return (
            <div className="App">
                <div className="header-nav">
                    <div className="header-nav-content">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <div className="nav">
                            <ul ref="nav_list">
                                <li >
                                    <IndexLink  to="/" onClick={this.showOrHoidePhoneMenu}  activeClassName="actived">网站首页</IndexLink>
                                </li>
                                <li >
                                    <Link to="/page2" onClick={this.showOrHoidePhoneMenu} activeClassName="actived">公司案例</Link>
                                </li>
                                <li >
                                    <Link to="/page3" onClick={this.showOrHoidePhoneMenu} activeClassName="actived">公司相册</Link>
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
                        <div className="loginOrRegisterBtn">
                            {
                                this.state.username?<div className="username"><span>{this.state.username}</span> <UserSubMenu showLogin={this.showLogin} loginout={this.loginout}/></div> :
                                    <p> <span className="loginBtn" onClick={this.showLogin}>登录</span> | <span onClick={this.showRegister} className="registerBtn">注册</span></p>
                            }
                        </div>
                    </div>


                </div>
                <Mask hideMask={this.hideMask} isHide={!this.state.showMask}/>
                <LoginDiv login={this.login} hideMask={this.hideMask} isHide={!this.state.showLoginDiv}  showRegister={this.showRegister}/>
                <RegisterDiv isHide={!this.state.showRegisterDiv} showLogin={this.showLogin}/>
                <div className="container">
                    {this.props.children }
                </div>
            </div>
        );
    }
}

export default App;
