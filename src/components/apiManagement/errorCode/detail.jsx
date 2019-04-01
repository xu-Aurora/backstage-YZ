import React, {Component} from 'react';
import {Input,Button,Row,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const userData = JSON.parse(localStorage.getItem('userDetail'));


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
                id: params.id,
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
                    <Button type="primary" onClick={this.delete.bind(this)}
                        style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                  <tr>
                                    <td>
                                        <span className={Style.red}>*</span>接口id</td>
                                    <td>
                                        <span>{getFieldDecorator('interfaceId',  {
                                                initialValue: content.interfaceId || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>接口名</td>
                                    <td>
                                        <span>{getFieldDecorator('interfaceName', {
                                                initialValue: content.interfaceName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>模块id</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('moduleId', {
                                                initialValue: content.moduleId || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>模块名</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('moduleName', {
                                                initialValue: content.moduleName || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>内部系统结果码</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('retCode', {
                                                initialValue: content.retCode || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>内部系统结果消息</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('retMsg', {
                                                initialValue: content.retMsg || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>返回结果码</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('returnCode', {
                                                initialValue: content.returnCode || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>返回结果消息</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('returnMsg', {
                                                initialValue: content.returnMsg || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        创建时间</td>
                                    <td>
                                        <span>{getFieldDecorator('createTime', {
                                                initialValue: content.createTime ? Moment(content.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                            })(<Input disabled/>)}</span> 
                                    </td>
                                    <td>
                                        创建人</td>
                                    <td>
                                        <span>{getFieldDecorator('createUserName', {
                                                initialValue: content.createUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>
                                        更新人</td>
                                    <td>
                                        <span>{getFieldDecorator('updateUserName', {
                                                initialValue: content.updateUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        更新时间</td>
                                    <td>
                                        <span>{getFieldDecorator('updateTime', {
                                                initialValue: content.updateTime ? Moment(content.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                            })(<Input disabled/>)}</span> 
                                    </td>
                                </tr>    
                            </tbody>
                        </table>
                    </Row>
                </div>

             {/* 删除消息 */}
              <Modal
                  title="删除"
                  visible={this.state.visibleShow}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  >
                  <p style={{fontSize:16}}>确定删除?</p>
              </Modal>
              
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {data: state.apiManagement.tDetail, argument: state.apiManagement.t_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'apiManagement/t_detail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'apiManagement/t_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));