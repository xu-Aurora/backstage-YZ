import React, {Component} from 'react';
import {Input,Row,Form,message,Button} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
        };
        this.regx = this.regx.bind(this)
    }

    add = () => {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let rex = this.regx()
          this.props.form.validateFields((err, values) => {
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.instAdd({
                                params: {
                                    ...values,
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
                                      <span className={Style.red}>*</span>接口id</td>
                                  <td>
                                      <span>{getFieldDecorator('interfaceId', {})(<Input/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>接口名</td>
                                  <td>
                                      <span>{getFieldDecorator('interfaceName', {})(<Input/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模块id</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('moduleId', {})(<Input />)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模块名</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('moduleName', {})(<Input />)}
                                      </div>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>内部系统结果码</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('retCode', {})(<Input />)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>内部系统结果消息</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('retMsg', {})(<Input />)}
                                      </div>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>返回结果码</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('returnCode', {})(<Input />)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>返回结果消息</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('returnMsg', {})(<Input />)}
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

function mapStateToProps(state) {
    return {}
}

function dispatchToProps(dispatch) {
    return {
        instAdd(payload = {}) {
            dispatch({type: 'apiManagement/t_add', payload})
        },
        t_list(payload, params) {
            dispatch({type: 'apiManagement/t_list', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
