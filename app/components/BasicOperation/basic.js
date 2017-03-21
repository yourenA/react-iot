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
                        <SubMenu key="sub0" title={<span><Icon type="mail" /><span>账号设置</span></span>}>
                            <Menu.Item key="/basic"><IndexLink to="/basic" >密码修改</IndexLink></Menu.Item>
                            <Menu.Item key="/basic/news">  <Link  to="/basic/news" >账号安全</Link></Menu.Item>
                            <Menu.Item key="/basic/news">  <Link  to="/basic/news" >资料修改</Link></Menu.Item>
                            <Menu.Item key="3">Option 3</Menu.Item>
                            <Menu.Item key="4">Option 4</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="3"><span><Icon type="mail" /><span>信息概况</span></span></Menu.Item>
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>接入管理</span></span>}>
                            <Menu.Item key="/basic"><IndexLink to="/basic" >设备管理</IndexLink></Menu.Item>
                            <Menu.Item key="/basic/news">  <Link  to="/basic/news" >策略管理</Link></Menu.Item>
                            <Menu.Item key="/basic/device_groups"> <Link  to="/basic/device_groups" >分组管理</Link></Menu.Item>
                            <Menu.Item key="/basic/device_categories"> <Link  to="/basic/device_categories" >分类管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>应用</span></span>}>
                            <Menu.Item key="5">数据统计</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>后台管理</span></span>}>
                            <Menu.Item key="9">安全认证参数</Menu.Item>
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
