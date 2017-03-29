/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Select} from 'antd';
import {formItemLayout, formItemLayoutWithLabel, formItemLayoutWithOutLabel} from './../../common/common';
import axios from 'axios';
import AddCategory from './addCategory';
import AddPolicy from './addpolicy';
import configJson from './../../../config.json';
import {getHeader} from './../../common/common.js';
const FormItem = Form.Item;
const Option = Select.Option;
class AddDeviceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCategory: false,
            newGroup: false,
            newPolicy: false,
            categoryArr:[],
            groupArr:[],
            policyArr:[]
        };
    }
    componentDidMount = () => {
        const that=this;
        axios({
            url:`${configJson.prefix}/device_categories`,
            method: 'get',
            params:{
                return:'all'
            },
            headers:getHeader()
        }).then(function (response) {
            that.setState({
                categoryArr:response.data.data
            })
        });
        axios({
            url:`${configJson.prefix}/device_groups`,
            method: 'get',
            params:{
                return:'all'
            },
            headers:getHeader()
        }).then(function (response) {
            that.setState({
                groupArr:response.data.data
            })
        });
        axios({
            url:`${configJson.prefix}/endpoints/${this.props.endpoint_uuid}/policies`,
            method: 'get',
            params:{
                return:'all'
            },
            headers:getHeader()
        }).then(function (response) {
            that.setState({
                policyArr:response.data.data
            })
        })
        const {form,editRecord} = this.props;
        console.log("是否存在editRecord：",Boolean(editRecord));
        if(editRecord){
            form.setFieldsValue({
                name:editRecord.name,
                description:editRecord.description,
                category: {key:editRecord.category.uuid,label:editRecord.category.name},
                group:  editRecord.group?{key:editRecord.group.uuid,label:editRecord.group.name}:{key:'',label:''},
                policy:  {key:editRecord.policy.uuid,label:editRecord.policy.name},
            });
        }

    }
    handleChange = (value)=> {
        console.log(value);
        const selectValue=value?value.key:'';
        if (selectValue === 'newcategory') {
            this.setState({
                newCategory: true,
                newGroup: false,
                newPolicy: false
            })
        }else if(selectValue === 'newgroup'){
            this.setState({
                newCategory: false,
                newGroup: true,
                newPolicy: false
            })
        } else if(selectValue === 'newpolicy'){
            console.log('新建');
            this.setState({
                newCategory: false,
                newGroup: false,
                newPolicy: true
            })
        }else {
            this.setState({
                newCategory: false,
                newGroup: false,
                newPolicy: false
            })
        }
    };
    addNewcb=(type,name,uuid)=>{
        const {form} = this.props;
        if(type === 'category'){
            const categoryArr=this.state.categoryArr;
            this.setState({
                newCategory: false,
                categoryArr:categoryArr.concat([{name:name,uuid:uuid}])
            })
            form.setFieldsValue({
                category: {key:uuid,label:name},
            });
        }else if(type === 'group'){
            const groupArr=this.state.groupArr;
            this.setState({
                newGroup: false,
                categoryArr:groupArr.concat([{name:name,uuid:uuid}])
            })
            form.setFieldsValue({
                group:  {key:uuid,label:name},
            });

        }else if(type === 'policy'){
            const policyArr=this.state.policyArr;
            this.setState({
                newPolicy: false,
                categoryArr:policyArr.concat([{name:name,uuid:uuid}])
            })
            form.setFieldsValue({
                policy:  {key:uuid,label:name},
            });
        }}

    ;
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const newformItemsWrap = ()=> {
            if (this.state.newCategory) {
                return (
                    <AddCategory addNewcb={this.addNewcb}  type='category'/>
                )
            }else if(this.state.newGroup){
                return (
                    <AddCategory addNewcb={this.addNewcb}  type='group'/>
                )
            }else if(this.state.newPolicy){
                return(
                    <AddPolicy endpoint_uuid={this.props.endpoint_uuid} type='policy' addNewcb={this.addNewcb}/>
                )
            }else{
                return (
                    null
                )
            }
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="名称"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '名称不能为空'}],
                        })(
                            <Input  disabled={this.props.editRecord?true:false}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="描述"
                        {...formItemLayout}>
                        {getFieldDecorator('description', {
                        })(
                            <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设备分类"
                    >
                        {getFieldDecorator('category', {
                            onChange: this.handleChange,
                            rules: [
                                {required: true, message: '请选择设备分类'},
                            ],
                        })(
                            <Select labelInValue={true}>
                                <Option value='newcategory'>新建</Option>
                                { this.state.categoryArr.map(item => <Option key={item.uuid} value={item.uuid}>{item.name}</Option>) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设备组"
                    >
                        {getFieldDecorator('group', {
                            onChange: this.handleChange,
                            rules: [
                            ],
                        })(
                            <Select labelInValue={true}  allowClear={true}>
                                <Option value='newgroup'>新建</Option>
                                { this.state.groupArr.map(item => <Option key={item.uuid} value={item.uuid}>{item.name}</Option>) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="策略"
                    >
                        {getFieldDecorator('policy', {
                            rules: [
                                {required: true, message: '请选择设备策略'},
                            ],
                            onChange: this.handleChange,
                        })(
                            <Select labelInValue={true}>
                                <Option value='newpolicy'>新建</Option>

                                { this.state.policyArr.map(item => <Option key={item.uuid} value={item.uuid}>{item.name}</Option>) }
                            </Select>
                        )}
                    </FormItem>
                </Form>
                {newformItemsWrap()}
            </div>
        );
    }
}

const AddDeviceFormWrap = Form.create()(AddDeviceForm);
export default AddDeviceFormWrap;