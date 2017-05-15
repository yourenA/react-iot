import React, {Component} from 'react';
import logo from './car.svg';
import './app.scss'
import Mask from '../Login/mask';
import LoginDiv from '../Login/login'
import RegisterDiv from '../Login/register'
import UserSubMenu from '../Login/userSubmenu'
import Nav from './nav'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginActions from '../../actions/checkLogin';
class App extends Component {
    componentDidMount=()=>{
        this.props.checkLogin();
        const nav_list=document.querySelector('.nav>ul');
        window.addEventListener("resize", function () {
            const clientW=document.documentElement.clientWidth;
            if(clientW > 740){
                nav_list.style.display='block'
            }else{
                nav_list.style.display='none'
            }
        }, false);

    }
    render() {
        return (
            <div className="App">
                <div className="header-nav">
                    <div className="header-nav-content">
                        <div className="logo">
                            <p>辂轺科技IoT</p>
                        </div>
                        <Nav {...this.props}/>
                        <div className="loginOrRegisterBtn" >
                            {
                                this.props.loginState.username?<div className="username"><span>{this.props.loginState.username}</span> <UserSubMenu showLogin={this.props.showLogin} signout={this.props.signout}/></div> :
                                    <p> <span className="loginBtn" onClick={this.props.showLogin}>登录</span></p>
                            }
                        </div>
                    </div>
                </div>
                <Mask hideMask={this.props.hideMask} isHide={!this.props.loginState.showMask}/>
                <LoginDiv activeSuccess={this.props.loginState.activeSuccess} login={this.props.login} hideMask={this.props.hideMask} isHide={!this.props.loginState.showLoginDiv}  showRegister={this.props.showRegister}/>
                <RegisterDiv hideMask={this.props.hideMask}  isHide={!this.props.loginState.showRegisterDiv} showLogin={this.props.showLogin}/>
                <div className="container">
                    {this.props.children }
                </div>
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
        loginState:state.loginState
    };
}
function mapDispatchToProps(dispath){
    return bindActionCreators(LoginActions,dispath);
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
