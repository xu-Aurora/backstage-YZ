import React, {Component} from 'react';
import {Input,Select,Radio,Row,Form,message,Button} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
        };
        this.regx = this.regx.bind(this)
    }

    add = () => {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {

                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.instAdd({
                                params: {
                                    ...values,
                                    userId: this.props.linkID ? this.props.linkID : userData.id
                                },
                                func: function () {
                                    message.success('新增成功', 1.5, function() {
                                        self.props.search('addVisible')
                                    });
                                }
                            })
                    })
                }
            }


        })
        
    }
    regx () {
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.itfcId) {
            message.warning('接口id不能为空')
            return false
        }
        if (!value.param) {
            message.warning('参数不能为空')
            return false
        }
        if (!value.paramName) {
            message.warning('参数名称不能为空')
            return false
        }
        if (value.paramType === undefined) {
            message.warning('请选择请求参数类型')
            return false
        }
        if (value.dataType === undefined) {
            message.warning('请选择数据类型')
            return false
        }
        if (value.isEnable === undefined) {
            message.warning('请选择是否启用')
            return false
        }
        if (value.isnull === undefined) {
            message.warning('请选择是否为空')
            return false
        }
        return true
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.add}>保存</Button> :
                        <Button type="primary">确定</Button>
                    }
                    
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>接口id</td>
                                    <td>
                                        <span>{getFieldDecorator('itfcId', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>参数</td>
                                    <td>
                                        <span>{getFieldDecorator('param', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>参数名称</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('paramName', {})(<Input />)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>请求参数类型</td>
                                    <td>
                                        <div>
                                            <span>{getFieldDecorator('paramType', {})(
                                                <Select style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="0">请求参数</Option>
                                                    <Option value="1">返回参数</Option>
                                                    <Option value="2">默认请求参数</Option>
                                                    <Option value="3">默认返回参数</Option>
                                                </Select>
                                            )}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>数据类型</td>
                                    <td>
                                        <div>
                                            <span>{getFieldDecorator('dataType', {})(
                                                <Select style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="0">varchar</Option>
                                                    <Option value="1">int</Option>
                                                    <Option value="2">date</Option>
                                                    <Option value="3">object</Option>
                                                </Select>
                                            )}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>是否启用</td>
                                    <td>
                                        <span>{getFieldDecorator('isEnable', {})(
                                                <RadioGroup>
                                                    <Radio value="0">启用</Radio>
                                                    <Radio value="1">禁用</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>是否为空</td>
                                    <td>
                                        <span>{getFieldDecorator('isnull', {})(
                                                <RadioGroup>
                                                    <Radio value="0">可以</Radio>
                                                    <Radio value="1">不可以</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                    <td>
                                        默认参数值</td>
                                    <td>
                                        <span>{getFieldDecorator('dataValue', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                      <td>
                                        长度</td>
                                    <td>
                                        <span>{getFieldDecorator('length', {})(<Input/>)}</span>
                                    </td>
                                      <td>
                                        备注</td>
                                    <td>
                                        <span>{getFieldDecorator('remark', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

function dispatchToProps(dispatch) {
    return {
        instAdd(payload = {}) {
            dispatch({type: 'apiManagement/h_add', payload})
        },
        h_list(payload, params) {
            dispatch({type: 'apiManagement/h_list', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
