import React, {Component,} from 'react';
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
            status: '0'
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
                    self.setState({requestStatus:false},() => {
                            this.props.instAdd({
                                params: {
                                    ...values,
                                    status: this.state.status,
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
        if (!value.channelCode) {
            message.warning('通道编码不能为空')
            return false
        }
        if (!value.channelName) {
            message.warning('通道名称不能为空')
            return false
        }
        if (!value.instCode) {
            message.warning('机构编码不能为空')
            return false
        }
        if (!value.channelVersion) {
            message.warning('版本不能为空')
            return false
        }
         if (value.type === undefined) {
            message.warning('请选择通道类型')
            return false
        }
        return true
    }
    tabChange (item) {
        this.setState({
          status: item
        })
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
                                        <span>{getFieldDecorator('channelCode')(<Input />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道名称</td>
                                    <td>
                                        <span>{getFieldDecorator('channelName')(<Input />)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>机构编码</td>
                                    <td>
                                        <span>{getFieldDecorator('instCode')(<Input />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道类型</td>
                                    <td>
                                        <span>{getFieldDecorator('type',{initialValue:"00"})(
                                                <Select style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="00">普通通道</Option>
                                                    <Option value="01">支付通道</Option>
                                                    <Option value="02">收单通道</Option>
                                                    <Option value="03">解绑卡通道</Option>
                                                </Select>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <Tabs activeKey={this.state.status} onTabClick={this.tabChange.bind(this)}>
                                            <TabPane tab="启用" key="0"></TabPane>
                                            <TabPane tab="禁用" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>版本</td>
                                    <td>
                                        <span>{getFieldDecorator('channelVersion')(<Input />)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('memo')(<Input />)}</span>
                                    </td>
                                    <td colSpan='2'></td>
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
            dispatch({type: 'agencyChannel/instAdd', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
