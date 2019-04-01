import React, {Component} from 'react';
import {Input,Radio,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const RadioGroup = Radio.Group;

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
        let rex = this.regx()
        this.props.form.validateFields((err, values) => {
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
        if (!value.apiName) {
            message.warning('API名称不能为空')
            return false
        }
        if (!value.apiRemark) {
            message.warning('API中文名称不能为空')
            return false
        }
        if (value.authorizeType === undefined) {
            message.warning('请选择登录授权类型')
            return false
        }
        if (!value.groupId) {
            message.warning('分组Id不能为空')
            return false
        }
        if (!value.moduleId) {
            message.warning('模块ID不能为空')
            return false
        }
         if (!value.moduleName) {
            message.warning('模块名称不能为空')
            return false
        }
        if (!value.serviceName) {
            message.warning('服务名不能为空')
            return false
        }
        if (!value.servicePath) {
            message.warning('服务路径不能为空')
            return false
        }
        if (!value.apiMemo) {
          message.warning('API描述不能为空')
          return false
        }
        if (value.status === undefined) {
            message.warning('请选择状态')
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
                        <Button type="primary">保存</Button>
                    }
                    
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>API名称</td>
                                    <td>
                                        <span>{getFieldDecorator('apiName', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>API中文名称</td>
                                    <td>
                                        <span>{getFieldDecorator('apiRemark', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>登录授权类型</td>
                                    <td>
                                        <span>{getFieldDecorator('authorizeType', {initialValue:"0"})(
                                                <RadioGroup>
                                                    <Radio value="0">无需</Radio>
                                                    <Radio value="1">需要</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>分组Id</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('groupId', {})(<Input />)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>模块ID</td>
                                    <td>
                                        <span>{getFieldDecorator('moduleId', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>模块名称</td>
                                    <td>
                                        <span>{getFieldDecorator('moduleName', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>服务名</td>
                                    <td>
                                        <span>{getFieldDecorator('serviceName', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>服务路径</td>
                                    <td>
                                        <span>{getFieldDecorator('servicePath', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>API描述</td>
                                    <td>
                                        <span>{getFieldDecorator('apiMemo', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <span>{getFieldDecorator('status', {initialValue:'0'})(
                                                <RadioGroup>
                                                    <Radio value="0">正常</Radio>
                                                    <Radio value="1">禁用</Radio>
                                                </RadioGroup>
                                            )}</span>
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
            dispatch({type: 'apiManagement/p_add', payload})
        },
        p_list(payload, params) {
            dispatch({type: 'apiManagement/t_list', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
