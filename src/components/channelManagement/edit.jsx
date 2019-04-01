import React, {Component} from 'react';
import {Input,Tabs,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const userData = JSON.parse(localStorage.getItem('userDetail'));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            status: this.props.data.status,
            type: this.props.data.type,
        };
    }

    regx (values) {
        message.destroy();
        if(!values.code){
            message.warning('渠道编码不能为空');
            return;
        }else if(!values.name){
            message.warning('名称不能为空');
            return;
        }else if(!values.name){
            message.warning('名称不能为空');
            return;
        }
        return true
    }
    tabChange (type,item) {
        this.setState({
          [type]: item
        })
    }
    update = () => {
        // if (this.state.isEdiut === 1) {
            const self = this;
            this.props.form.validateFields((err, values) => {
                let reg = this.regx(values)
                if(reg){
                    if(this.state.requestStatus){
                        self.setState({requestStatus: false},() => {
                            this.props.update({
                                params: {
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                    status: self.state.status,
                                    type: self.state.type,
                                    ...values
                                },
                                func: function () {
                                    message.success('更新成功!', 1.5, function () {
                                        self.props.search('editVisible')
                                    });
            
                                }
                            })
                        })
                    }
                }

            })
            // this.setState({isEdiut: 0});
        // } else {
        //     this.setState({isEdiut: 1});
        // }
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
        const { data} = this.props;
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
                                        <span className={Style.red}>*</span>渠道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('code', {
                                                initialValue: content.code || null                                              
                                        })(<Input maxLength={30} disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>名称</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {
                                            initialValue: content.name || null                                                                                            
                                        })(<Input maxLength={30} disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <Tabs activeKey={String(this.state.status)} onTabClick={this.tabChange.bind(this,'status')}>
                                            <TabPane tab="启用" key="0"></TabPane>
                                            <TabPane tab="禁用" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>类型</td>
                                    <td>
                                        <Tabs activeKey={String(this.state.type)} onTabClick={this.tabChange.bind(this,'type')}>
                                            <TabPane tab="支付渠道" key="0"></TabPane>
                                            <TabPane tab="收单渠道" key="1"></TabPane>
                                        </Tabs>

                                    </td>
                                </tr>
                                <tr>
                                    <td>备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <div>
                                            {getFieldDecorator('memo', {
                                                initialValue: `${content.memo}` || null
                                            })(<Input maxLength={30} disabled={this.state.isEdiut == 0 ? true : false}/>)}
                                        </div>
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
    return {data: state.channelManagement.ItemDetail, argument: state.channelManagement.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'channelManagement/instDetail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'channelManagement/update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));