import React, {Component} from 'react';
import {Input,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const userData = JSON.parse(localStorage.getItem('userDetail'));


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
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
        if (!value.interfaceId) {
            message.warning('接口id不能为空')
            return false
        }
        if (!value.interfaceName) {
            message.warning('接口名不能为空')
            return false
        }
        if (!value.moduleId) {
            message.warning('模块id不能为空')
            return false
        }
        if (!value.moduleName) {
            message.warning('模块名不能为空')
            return false
        }
        if (!value.retCode) {
            message.warning('内部系统结果码不能为空')
            return false
        }
        if (!value.retMsg) {
            message.warning('内部系统结果消息不能为空')
            return false
        }
        if (!value.returnCode) {
            message.warning('返回结果码不能为空')
            return false
        }
        if (!value.returnMsg) {
            message.warning('返回结果消息不能为空')
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
                                      <span className={Style.red}>*</span>接口id</td>
                                  <td>
                                      <span>{getFieldDecorator('interfaceId',  {
                                              initialValue: content.interfaceId || null
                                          })(<Input/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>接口名</td>
                                  <td>
                                      <span>{getFieldDecorator('interfaceName', {
                                              initialValue: content.interfaceName || null
                                          })(<Input/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模块id</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('moduleId', {
                                              initialValue: content.moduleId || null
                                          })(<Input/>)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模块名</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('moduleName', {
                                              initialValue: content.moduleName || null
                                          })(<Input/>)}
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
                                          })(<Input/>)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>内部系统结果消息</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('retMsg', {
                                              initialValue: content.retMsg || null
                                          })(<Input/>)}
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
                                          })(<Input/>)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>返回结果消息</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('returnMsg', {
                                              initialValue: content.returnMsg || null
                                          })(<Input/>)}
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
    return {data: state.apiManagement.tDetail, argument: state.apiManagement.t_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'apiManagement/t_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'apiManagement/t_update', payload})
        },
        t_list(payload, params) {
            dispatch({type: 'apiManagement/t_list', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));