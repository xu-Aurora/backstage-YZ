import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Col,Icon,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

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
                                userId: userData.id
                            },
                            func: function () {
                                message.success('新增成功!', 1.5, function () {
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
        //正则匹配只能输入英文
        var regName =/^[a-zA-Z]+$/;
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (value.dataType === undefined) {
            message.error('请选择字段数据类型')
            return false
        }

        if (!value.eName) {
            message.error('英文名不能为空')
            return false
        }
        if(!regName .test(value.eName)){
            message.warning('英文名只能输入英文');
            return false;
        }
        if (!value.name) {
            message.error('字段名不能为空')
            return false
        }
        if (value.strategyType === undefined) {
            message.error('请选择策略类型')
            return false
        }
        if (value.type === undefined) {
            message.error('请选择字段类型')
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
                                        通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段数据类型</td>
                                    <td>
                                        <span>{getFieldDecorator('dataType', {initialValue:"0"})(
                                            <Select style={{width:'100%'}} placeholder="请选择">
                                                <Option value="0">数字</Option>
                                                <Option value="1">字符串</Option>
                                                <Option value="2">时间</Option>
                                            </Select>
                                        )}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>英文名</td>
                                    <td>
                                        <span>{getFieldDecorator('eName', {})(<Input/>)}</span>
                                    </td>
                                        <td>
                                        <span className={Style.red}>*</span>字段名</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <span>{getFieldDecorator('strategyType', {initialValue:"0"})(
                                            <Select style={{width:'100%'}} placeholder="请选择">
                                                <Option value="0">否决策略</Option>
                                                <Option value="1">选优策略</Option>
                                            </Select>
                                        )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>字段类型</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('type', {initialValue:"0"})(
                                            <Select style={{width:'100%'}} placeholder="请选择">
                                                <Option value="0">原始</Option>
                                                <Option value="1">开发</Option>
                                                <Option value="2">订单</Option>
                                            </Select>
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
            dispatch({type: 'routerField/add', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));