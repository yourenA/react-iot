/**
 * Created by Administrator on 2017/2/24.
 */
import React, {Component} from 'react';
class SubMenu extends Component {
    loginout=()=>{
        this.props.loginout()
    }
    ModifyPassword=()=>{
        this.props.showLogin()
    }
    render() {
        return (
            <ul className="userSubMenu">
                <li>管理账号</li>
                <li onClick={this.ModifyPassword}>切换账号</li>
                <li onClick={this.loginout}>退出</li>
            </ul>
        );
    }
}
SubMenu.propTypes = {
    loginout: React.PropTypes.func,
    showLogin: React.PropTypes.func,
};
export default SubMenu;
