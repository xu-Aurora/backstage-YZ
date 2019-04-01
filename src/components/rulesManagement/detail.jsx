import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Modal,Form,message } from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleShow: false,
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
        let self = this
        self.props.instDelete({
            params: {
                ids: params.id,
                userId: userData.id,
            },
            func: function () {
                message.success('删除成功!', 1.5, function () {
                    self.props.search('detailVisible');
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
                                        <span className={Style.red}>*</span>通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {
                                                initialValue: content.channelCode || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段英文名</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldEName', {
                                                initialValue: content.fieldEName || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>
                                        <span className={Style.red}>*</span>字段ID</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldId', {
                                                initialValue: content.fieldId || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段名称</td>
                                    <td>
                                        <span>{getFieldDecorator('fieldName', {
                                                initialValue: content.fieldName || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则组</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleGroup', {
                                                initialValue: content.ruleGroup || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>校对值</td>
                                    <td>
                                        <span>{getFieldDecorator('ruleValue', {
                                                initialValue: content.ruleValue || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <Tabs activeKey={String(content.strategyType)}>
                                            <TabPane disabled tab="否决策略" key="0"></TabPane>
                                            <TabPane disabled tab="选优策略" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                    <td>分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {
                                                initialValue: content.score || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>规则类型</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择"  disabled>
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
    return {data: state.rulesManagement.ItemDetail, argument: state.rulesManagement.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'rulesManagement/instDetail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'rulesManagement/instDelete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));