import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const params = this.props.argument;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const self = this;
          self.props.instDelete({
              params: {
                  ids: params.id,
                  userId: userData.id,
              },
              func: function () {
                message.success('删除成功', 1.5, ()=>{
                    self.props.search('detailVisible');
                });
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
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道名称</td>
                                    <td>
                                        <span>{getFieldDecorator('channelName', {
                                                initialValue: content.channelName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>机构编码</td>
                                    <td>
                                        <span>{getFieldDecorator('instCode', {
                                                initialValue: content.instCode || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>通道类型</td>
                                    <td>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择" disabled>
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
                                        <Tabs activeKey={String(content.status)}>
                                            <TabPane disabled tab="启用" key="0"></TabPane>
                                            <TabPane disabled tab="禁用" key="1"></TabPane>
                                        </Tabs>

                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>版本</td>
                                    <td>
                                        <span>{getFieldDecorator('channelVersion', {
                                                initialValue: content.channelVersion || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('memo', {
                                                initialValue: content.memo || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td colSpan='2'></td>
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
                    <p>确定删除?</p>
                </Modal>
              
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
        instDelete(payload = {}) {
            dispatch({type: 'agencyChannel/instDelete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));