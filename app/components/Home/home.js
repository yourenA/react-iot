import React, {Component} from 'react';
class Home extends Component {
    handleClick=()=>{
    }
    render() {
        return (
            <div className="Home" onClick={this.handleClick}>
                <a href="www.baidu.com" style={{fontSize:'80px'}}>this is home page</a>
            </div>
        );
    }
}

export default Home;
