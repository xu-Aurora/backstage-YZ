import React, {Component} from 'react';
import {Input,Button,Row,Form,message,Tabs} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

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
       
        this.props.queryDetails({
                id: this.props.argument.id,
                userId: userData.id
        });
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
        if (!value.code) {
            message.warning('机构编码不能为空')
            return false
        }
        if (!value.name) {
            message.warning('机构名称不能为空')
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
                                        <span className={Style.red}>*</span>机构编码</td>
                                    <td>
                                        <span>{getFieldDecorator('code', {
                                                initialValue: content.code || null
                                            })(<Input disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>机构名称</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {
                                                initialValue: content.name || null
                                            })(<Input disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
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
                                        备注</td>
                                    <td>
                                        <span>{getFieldDecorator('memo', {
                                                initialValue: content.memo || null
                                            })(<Input disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
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
    return {data: state.institutionManagement.ItemDetail, argument: state.institutionManagement.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'institutionManagement/instDetail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'institutionManagement/update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));