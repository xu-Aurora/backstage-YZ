import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            visible: false,
            argument: {},
            userStatus: '0',
            isEdiut: 0,
            dataSource: []
        };
        this.regx = this.regx.bind(this)
    }
    add () {
        let rex = this.regx()
        if (rex) {
            const self = this;
            const userData = JSON.parse(localStorage.getItem('userDetail'));
            this.props.form.validateFields((err, values) => {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                        this.props.instAdd({
                            params: {
                                ...values,
                                userId: userData.id
                            },
                            func: function () {
                                message.success('新增成功!', 1.5, function () {
                                    self.props.search('addVisible')
                                    
                                });
                            }
                        })
                    })
                }

    
            })
        }
    }
    regx () {
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.templateKey) {
            message.warning('模板标识不能为空')
            return false
        }
         if (!value.templateName) {
            message.warning('模板名称不能为空')
            return false
        }
         if (value.resourceType === undefined) {
            message.warning('请选择获取来源')
            return false
        }
         if (value.status === undefined) {
            message.warning('请选择状态')
            return false
        }
         if (!value.describe) {
            message.warning('描述不能为空')
            return false
        }
        return true
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={Style.userBox}>
                <div style={{ width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.add.bind(this)}>保存</Button> :
                        <Button type="primary">保存</Button>
                    }
                  
                  <Row>
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模板标识</td>
                                  <td>
                                      <span>{getFieldDecorator('templateKey', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模板名称</td>
                                  <td>
                                      <span>{getFieldDecorator('templateName', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>获取来源</td>
                                  <td>
                                        <span>{getFieldDecorator('resourceType', {})(
                                              <Select style={{width:'100%'}} placeholder="请选择">
                                                  <Option value="1">业务</Option>
                                                  <Option value="2">渠道</Option>
                                                  <Option value="3">资源</Option>
                                              </Select>
                                          )}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>状态</td>
                                  <td>
                                        <span>{getFieldDecorator('status', {})(
                                              <Select style={{width:'100%'}} placeholder="请选择">
                                                  <Option value="1">启用</Option>
                                                  <Option value="2">禁用</Option>
                                              </Select>
                                          )}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>描述</td>
                                  <td style={{borderRight:'1px solid #A2A2A2'}}>
                                      <span>{getFieldDecorator('describe', {})(<Input maxLength={50}/>)}</span>
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
            dispatch({type: 'computationManagement/h_add', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
