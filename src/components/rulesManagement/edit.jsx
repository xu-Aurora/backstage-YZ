import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            strategyType: this.props.data.strategyType
        };
    }

    update = () => {
        const self = this;
        this.props.form.validateFields((err, values) => {
            let rex = this.regx(values);
            if(rex){
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.update({
                                params: {
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                    strategyType: this.state.strategyType,
                                    ...values
                                },
                                func: function () {
                                    message.success('更新成功!', 1.5, function () {
                                        self.props.search('editVisible');
                                        
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
    regx(item){
        //正则匹配只能输入英文
        let regName =/^[a-zA-Z]+$/;
        //正则匹配只能输入数字
        let regNum = /^[0-9]*$/;
        message.destroy();
        if(!item.channelCode){
            message.warning('通道编码不能为空');
            return;
        }else if(!item.fieldEName){
            message.warning('字段英文名不能为空');
            return;
        }else if(!regName .test(item.fieldEName)){
            message.warning('字段英文名只能输入英文');
            return;
        }else if(!item.fieldId){
            message.warning('字段ID不能为空');
            return;
        }else if(!regNum.test(item.fieldId)){
            message.warning('字段ID只能输入数字');
            return;
        }else if(!item.fieldName){
            message.warning('字段名称不能为空');
            return;
        }else if(!item.ruleGroup){
            message.warning('规则组不能为空');
            return;
        }else if(!item.ruleValue){
            message.warning('校对值不能为空');
            return;
        }else if(!item.score){
            message.warning('分值不能为空');
            return;
        }else if(!regNum.test(item.score)){
            message.warning('分值只能输入数字');
            return;
        }else if(!item.type){
            message.warning('规则类型不能为空');
            return;
        }else{
            return true;
        }
    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if (this.props.argument) {
            if (this.props.argument.id) {
                this.props.queryDetails({
                        id: this.props.argument.id,
                        userId: userData.id
                });
                // this.setState({argument: this.props.argument});
            } else {
                message.error('未选择表中数据!', 1.5, function () {
                    // history.back(-1);
                });
            }
        } else {
            message.error('未选择表中数据!', 1.5, function () {
                // history.back(-1);
            });
        }
    }

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.update}>保存</Button> :
                        <Button type="primary">保存</Button>
                    }
                    
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {
                                                initialValue: content.channelCode || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段英文名</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldEName', {
                                                initialValue: content.fieldEName || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>字段ID</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldId', {
                                                initialValue: content.fieldId || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段名称</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldName', {
                                                initialValue: content.fieldName || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则组</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleGroup', {
                                                initialValue: content.ruleGroup || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>校对值</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleValue', {
                                                initialValue: content.ruleValue || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <Tabs activeKey={String(this.state.strategyType)} onTabClick={this.tabChange.bind(this)}>
                                            <TabPane tab="否决策略" key="0"></TabPane>
                                            <TabPane tab="选优策略" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td><span className={Style.red}>*</span>分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {
                                                initialValue: content.score || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则类型</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择" disabled={this.state.isEdiut == 0 ? true : false}>
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
    return {data: state.rulesManagement.ItemDetail, argument: state.rulesManagement.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'rulesManagement/instDetail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'rulesManagement/update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));