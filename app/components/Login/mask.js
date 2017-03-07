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
        const classNames=this.props.isHide ? 'mask hide': 'mask show';
        return (
            <div className={classNames}   onClick={this.hideMask}>
            </div>
        );
    }
}

mask.propTypes = {
    hideMask: React.PropTypes.func
};

export default mask;
