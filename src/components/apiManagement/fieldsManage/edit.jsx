import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const RadioGroup = Radio.Group;
const Option = Select.Option;
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
        if (!value.itfcId) {
            message.warning('接口id不能为空')
            return false
        }
        if (!value.param) {
            message.warning('参数不能为空')
            return false
        }
        if (!value.paramName) {
            message.warning('参数名称不能为空')
            return false
        }
        if (value.paramType === undefined) {
            message.warning('请选择请求参数类型')
            return false
        }
        if (value.dataType === undefined) {
            message.warning('请选择数据类型')
            return false
        }
        if (value.isEnable === undefined) {
            message.warning('请选择是否启用')
            return false
        }
        if (value.isnull === undefined) {
            message.warning('请选择是否为空')
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
                                      <span>{getFieldDecorator('itfcId', {
                                              initialValue: content.itfcId || null
                                          })(<Input />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>参数</td>
                                  <td>
                                      <span>{getFieldDecorator('param', {
                                              initialValue: content.param || null
                                          })(<Input />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>参数名称</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('paramName', {
                                              initialValue: content.paramName || null
                                          })(<Input />)}
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>请求参数类型</td>
                                  <td>
                                      <div>
                                          <span>{getFieldDecorator('paramType', {
                                              initialValue: `${content.paramType}` || null
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择">
                                                  <Option value="0">请求参数</Option>
                                                  <Option value="1">返回参数</Option>
                                                  <Option value="2">默认请求参数</Option>
                                                  <Option value="3">默认返回参数</Option>
                                              </Select>
                                          )}</span>
                                      </div>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>数据类型</td>
                                  <td>
                                      <div>
                                          <span>{getFieldDecorator('dataType', {
                                              initialValue: `${content.dataType}` || null
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择">
                                                  <Option value="0">varchar</Option>
                                                  <Option value="1">int</Option>
                                                  <Option value="2">date</Option>
                                                  <Option value="3">object</Option>
                                              </Select>
                                          )}</span>
                                      </div>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>是否启用</td>
                                  <td>
                                      <span>{getFieldDecorator('isEnable', {
                                              initialValue:`${content.isEnable}` || null
                                          })(
                                              <RadioGroup >
                                                  <Radio value="0">启用</Radio>
                                                  <Radio value="1">禁用</Radio>
                                              </RadioGroup>
                                          )}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>是否为空</td>
                                  <td>
                                      <span>{getFieldDecorator('isnull', {
                                              initialValue: `${content.isnull}` || null
                                          })(
                                              <RadioGroup >
                                                  <Radio value="0">可以</Radio>
                                                  <Radio value="1">不可以</Radio>
                                              </RadioGroup>
                                          )}</span>
                                  </td>
                                  <td>默认参数值</td>
                                  <td>
                                      <span>{getFieldDecorator('dataValue', {
                                              initialValue: content.dataValue || null
                                          })(<Input />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                    <td>长度</td>
                                  <td>
                                      <span>{getFieldDecorator('length', {
                                              initialValue: content.length || null
                                          })(<Input />)}</span>
                                  </td>
                                    <td>备注</td>
                                  <td>
                                      <span>{getFieldDecorator('remark', {
                                              initialValue: content.remark || null
                                          })(<Input />)}</span>
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
    return {data: state.apiManagement.hDetail, argument: state.apiManagement.h_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'apiManagement/h_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'apiManagement/h_update', payload})
        },
        h_list(payload, params) {
            dispatch({type: 'apiManagement/h_list', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
