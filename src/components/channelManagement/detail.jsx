import React, {Component} from 'react';
import {Input,Modal,Tabs,Button,Row,Form,message, } from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleShow: false,
        };
    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryDetails({
                id: this.props.argument.id,
                userId: userData.id
        });

    }

    //点击跳转编辑页面
    goEdit(){
        this.props.goEdit(true)
    }
    //点击删除弹出模态框
    delete () {
        this.setState({visibleShow: true});
    }
    //确定删除
    handleOk = (e) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const params = this.props.argument;
        let self = this;
        self.props.instDelete({
            params: {
                ids: params.id,
                userId: userData.id,
            },
            func: function () {
                message.success('删除成功!', 1.5, function () {
                    self.props.search('detailVisible');
                    self.props.queryList({
                        userId: userData.id, 
                        page: 1, 
                        size: 10
                    })
                })
            }
        });

    }
    //取消删除
    handleCancel = (e) => {
        this.setState({
            visibleShow: false,
        });
    }

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
       
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
                    <Button type="primary" 
                      onClick={this.delete.bind(this)}
                      style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>渠道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('code', {
                                                initialValue: content.code || null                                              
                                        })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>名称</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {
                                            initialValue: content.name || null                                                                                            
                                        })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <Tabs activeKey={String(content.status)}>
                                            <TabPane disabled tab="启用" key="0"></TabPane>
                                            <TabPane disabled tab="禁用" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>类型</td>
                                    <td>
                                        <Tabs activeKey={String(content.type)}>
                                            <TabPane disabled tab="支付渠道" key="0"></TabPane>
                                            <TabPane disabled tab="收单渠道" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                </tr>
                                <tr>
                                    <td>备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <div>
                                            {getFieldDecorator('memo', {
                                                initialValue: `${content.memo}` || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Row>
                </div>

                <Modal
                    title="删除"
                    visible={this.state.visibleShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <p>确定删除所选项?</p>
                </Modal>
              
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.channelManagement.ItemDetail, 
        argument: state.channelManagement.saveSeslect, 
        linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'channelManagement/instDetail', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'channelManagement/instDelete', payload})
        },
        queryList(payload = {}) {
            dispatch({type: 'channelManagement/serch', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));