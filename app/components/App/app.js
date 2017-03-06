import React, {Component} from 'react';
import logo from './logo.svg';
import './app.scss'
import {message} from 'antd';
import Mask from '../Login/mask';
import LoginDiv from '../Login/login'
import RegisterDiv from '../Login/register'
import UserSubMenu from '../Login/userSubmenu'
import Nav from './nav'
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
    render() {
        return (
            <div className="App">
                <div className="header-nav">
                    <div className="header-nav-content">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <Nav />
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
