/**
 * Created by Administrator on 2017/2/24.
 */
import React, {Component} from 'react';
class mask extends Component {
    hideMask=()=>{
        console.log("hideMask")
        this.props.hideMask();
    }
    render() {
        const display=this.props.isHide ? 'none': 'block';
        return (
            <div className="mask" style={{display:display}} onClick={this.hideMask}>
            </div>
        );
    }
}

export default mask;
