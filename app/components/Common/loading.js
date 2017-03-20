/**
 * Created by Administrator on 2017/3/6.
 */
import React, {Component} from 'react';
import './loading.scss'
class Loading extends Component {
    render() {
        const display=this.props.show ? 'none':'block';
        return (
            <div id="loading" style={{display:display}}>
                    <div id="loading-center">
                        <div id="loading-center-absolute">
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                            <div className="object"></div>
                        </div>
                    </div>
            </div>
        );
    }
}

export default Loading;
