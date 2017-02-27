/**
 * Created by Administrator on 2017/2/24.
 */
import React, {Component} from 'react';
class SubMenu extends Component {
    loginout=()=>{
        this.props.loginout()
    }
    render() {
        return (
            <ul className="userSubMenu">
                <li onClick={this.loginout}>退出</li>
                <li>管理账号</li>
                <li>切换账号</li>
            </ul>
        );
    }
}

export default SubMenu;
