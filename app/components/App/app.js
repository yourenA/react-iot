import React, {Component} from 'react';
import {Link} from 'react-router'
import logo from './logo.svg';
import './App.scss'
import {Menu, Icon,message} from 'antd';
import Mask from '../Login/mask';
import LoginDiv from '../Login/login'
import RegisterDiv from '../Login/register'
import UserSubMenu from '../Login/userSubmenu'
import $ from 'jquery'
class App extends Component {
    state = {
        current: '/',
        showMask: false,
        showLoginDiv: false,
        showRegisterDiv: false,
        username:null
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    componentWillMount = ()=> {
        const username=localStorage.getItem('username') ||sessionStorage.getItem('username')  ;
        const currentMenu = this.props.location.pathname.replace('/', '') || '/';
        this.setState({
            current: currentMenu,
            username:username
        });
    }
    showLogin = ()=> {
        this.setState({
            showMask: true,
            showLoginDiv: true
        });
    }
    showRegister = ()=> {
        this.setState({
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
                message.success('退出成功');
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
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="/">
                                <Link to="/"><Icon type="mail"/>主页</Link>
                            </Menu.Item>
                            <Menu.Item key="app">
                                <Link to="/page2"><Icon type="appstore"/>操作一</Link>
                            </Menu.Item>
                            <Menu.Item key="button">
                                <Link to="/page3">操作二</Link>
                            </Menu.Item>
                        </Menu>
                        <div className="loginOrRegisterBtn">
                            {
                                this.state.username?<div className="username"><span>{this.state.username}</span> <UserSubMenu loginout={this.loginout}/></div> :
                                    <p> <span className="loginBtn" onClick={this.showLogin}>登录</span> | <span onClick={this.showRegister} className="registerBtn">注册</span></p>
                            }
                        </div>
                    </div>


                </div>
                <Mask hideMask={this.hideMask} isHide={!this.state.showMask}/>
                <LoginDiv login={this.login} hideMask={this.hideMask} isHide={!this.state.showLoginDiv} />
                <RegisterDiv isHide={!this.state.showRegisterDiv}/>
                <div className="container">
                    {this.props.children }
                </div>
            </div>
        );
    }
}

export default App;
