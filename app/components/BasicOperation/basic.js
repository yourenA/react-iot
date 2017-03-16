/**
 * Created by Administrator on 2017/2/27.
 */
import React, {Component} from 'react';
import {Link,IndexLink,browserHistory } from 'react-router'
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import './basic.scss'
class Basic extends React.Component {
    constructor(props){
        super(props);
    }

    handleClick=(e)=> {
        const sidebar=document.querySelector('.sidebar');
        sidebar.style.left='-240px';
    }
    showSidebar=()=>{
        const sidebar=document.querySelector('.sidebar');
        if(sidebar.offsetLeft == 0){
            sidebar.style.left='-240px';
        }else{
            sidebar.style.left=0;
        }

    }
    render() {
        const currentMenu = this.props.location.pathname ;
        return (
            <div className="basic">
                <div className="sidebar" id="sidebar" ref='sidebar'>
                    <Menu
                        onClick={this.handleClick}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        selectedKeys={[currentMenu]}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                            <Menu.Item key="/basic"><IndexLink to="/basic" >Option 1</IndexLink></Menu.Item>
                            <Menu.Item key="/basic/news">  <Link  to="/basic/news" >Option 2</Link></Menu.Item>
                            <Menu.Item key="3">Option 3</Menu.Item>
                            <Menu.Item key="4">Option 4</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigtion Two</span></span>}>
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="7">Option 7</Menu.Item>
                                <Menu.Item key="8">Option 8</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </Menu>
                    <div className="sidebar-icon" onClick={this.showSidebar}>

                    </div>
                </div>
                <div className="basic-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Basic;
