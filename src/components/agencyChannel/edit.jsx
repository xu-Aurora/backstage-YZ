import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            status: this.props.data.status
        };
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
    tabChange (item) {
        this.setState({
          status: item
        })
    }
    update() {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.update({
                                params: {
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                    status: self.state.status,
                                    ...values
                                },
                                func: function () {
                                    message.success('操作成功', 1.5, ()=>{
                                        self.props.search('editVisible')
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
    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.update.bind(this)}>保存</Button> :
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
                                            })(<Input />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道名称</td>
                                    <td>
                                        <span>{getFieldDecorator('channelName', {
                                                initialValue: content.channelName || null
                                            })(<Input />)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>机构编码</td>
                                    <td>
                                        <span>{getFieldDecorator('instCode', {
                                                initialValue: content.instCode || null
                                            })(<Input />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道类型</td>
                                    <td>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                                <Select  style={{width:'100%'}} placeholder="请选择" >
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
                                        <Tabs activeKey={String(this.state.status)} onTabClick={this.tabChange.bind(this)}>
                                            <TabPane tab="启用" key="0"></TabPane>
                                            <TabPane tab="禁用" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>版本</td>
                                    <td>
                                        <span>{getFieldDecorator('channelVersion', {
                                                initialValue: content.channelVersion || null
                                            })(<Input />)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('memo', {
                                                initialValue: content.memo || null
                                            })(<Input />)}</span>
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
    return {data: state.agencyChannel.ItemDetail, argument: state.agencyChannel.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'agencyChannel/instDetail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'agencyChannel/update', payload})
        },
        queryList(payload = {}) {
            dispatch({type: 'agencyChannel/serch', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));