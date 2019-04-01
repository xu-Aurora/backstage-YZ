import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            strategyType: '0'
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
                                    strategyType: this.state.strategyType,
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
    tabChange (item) {
        this.setState({
            strategyType: item
        })
    }
    regx () {
        //正则匹配只能输入英文
        var regName =/^[a-zA-Z]+$/;
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.channelCode) {
            message.warning('通道编码不能为空')
            return false
        }
        if (!value.fieldEName) {
            message.warning('字段英文名不能为空')
            return false
        }
        if(!regName .test(value.fieldEName)){
            message.warning('英文名只能输入英文');
            return false;
        }
        if (!value.fieldId) {
            message.warning('字段ID不能为空')
            return false
        }
        if (!value.fieldName) {
            message.warning('字段名称不能为空')
            return false
        }
         if (!value.ruleGroup) {
            message.warning('规则组不能为空')
            return false
        }
        if (!value.ruleValue) {
            message.warning('校对值不能为空')
            return false
        }
         if (!value.score) {
            message.warning('分值不能为空')
            return false
        }
        if(!regNum.test(value.score)){
            message.warning('分值只能输入数字');
            return;
        }
         if (value.type === undefined) {
            message.warning('请选择规则类型')
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
                                        <span className={Style.red}>*</span>通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段英文名</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldEName', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>字段ID</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldId', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段名称</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldName', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则组</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleGroup', {})(<Input/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>校对值</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleValue', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <Tabs activeKey={this.state.strategyType} onTabClick={this.tabChange.bind(this)}>
                                            <TabPane tab="否决策略" key="0"></TabPane>
                                            <TabPane tab="选优策略" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {})(<Input/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则类型</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('type', {initialValue:"0"})(
                                            <Select style={{width:'100%'}} placeholder="请选择">
                                                <Option value="0">大于</Option>
                                                <Option value="1">大于等于</Option>
                                                <Option value="2">等于</Option>
                                                <Option value="3">小于</Option>
                                                <Option value="4">小于等于</Option>
                                                <Option value="5">不等于</Option>
                                                <Option value="6">匹配</Option>
                                                <Option value="7">不匹配 </Option>
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
            dispatch({type: 'rulesManagement/instAdd', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
