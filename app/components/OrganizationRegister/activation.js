import React, {Component} from 'react';
import {Form, Col, Input, Button, Row,message} from 'antd';
import './index.scss';
import axios from 'axios';
import messageJson from './../../common/message.json';
import configJson from './../../../config.json';
import {converErrorCodeToMsg,getUrlParam} from './../../common/common.js';
import {hashHistory} from 'react-router'
class Activation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:''
        };
    }
    componentDidMount=()=>{
        const urlParam=getUrlParam('code');
        console.log("urlParam",urlParam);
        const that=this;
        if(urlParam){
            axios({
                url:`${configJson.prefix}/register/activation`,
                method: 'post',
                data: {
                    code: urlParam,
                }
            })
                .then(function (response) {
                    that.setState({
                        message:'激活成功'
                    })
                })
                .catch(function (error) {
                    that.setState({
                        message:'链接过期或不存在'
                    })
                });
        }else{
            hashHistory.replace('/organization_register')
        }
    }
    render() {
        return (
            <div className="Home">
                <div className="home-info ">
                    <p className="active-success">
                        {this.state.message}
                    </p>
                </div>
            </div>

        );
    }
}

export default Activation;