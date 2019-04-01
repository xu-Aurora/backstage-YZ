import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
        };
    }
    update () {
            const self = this;
            const userData = JSON.parse(localStorage.getItem('userDetail'));
            let rex = this.regx()
            if (rex) {
                this.props.form.validateFields((err, values) => {
                    if(this.state.requestStatus){
                        self.setState({requestStatus: false},() => {
                            this.props.update({
                                params: {
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                   ...values 
                                },
                                func: function () {
                                    message.success('操作成功!', 1.5, function() {
                                        self.props.search('editVisible')
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
        if (!value.quota) {
            message.warning('定额不能为空')
            return false
        }
        if (!value.intervalUpper) {
            message.warning('上限不能为空')
            return false
        }
        if (value.upperType === undefined) {
            message.warning('请选择上限类型')
            return false
        }
        if (!value.intervalFloor) {
            message.warning('下限不能为空')
            return false
        }
         if (value.floorType === undefined) {
            message.warning('请选择下限类型')
            return false
        }
        if (!value.percent) {
            message.warning('百分比不能为空')
            return false
        }
        return true
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
      
        this.props.queryDetails({
            id: this.props.argument.id,
            userId: userData.id
        });
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
                                      <span className={Style.red}>*</span>模板标识</td>
                                  <td>
                                      <span>{getFieldDecorator('templateKey', {
                                              initialValue: content.templateKey || null
                                          })(<Input maxLength={30} />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>定额</td>
                                  <td>
                                      <span>{getFieldDecorator('quota', {
                                              initialValue: content.quota || null
                                          })(<Input maxLength={30} />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>上限</td>
                                  <td>
                                      <span>{getFieldDecorator('intervalUpper', {
                                              initialValue: content.intervalUpper || null
                                          })(<Input maxLength={30} />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>上限类型</td>
                                  <td>
                                        <span>{getFieldDecorator('upperType', {
                                              initialValue: `${content.upperType}` || null
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择" >
                                                  <Option value="1">包含</Option>
                                                  <Option value="2">不包含</Option>
                                              </Select>
                                          )}</span>
                                  </td>                               
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>下限</td>
                                  <td>
                                      <span>{getFieldDecorator('intervalFloor', {
                                              initialValue: content.intervalFloor || null
                                          })(<Input maxLength={30} />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>下限类型</td>
                                  <td>
                                        <span>{getFieldDecorator('floorType', {
                                              initialValue: `${content.floorType}` || null
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择" >
                                                  <Option value="1">包含</Option>
                                                  <Option value="2">不包含</Option>
                                              </Select>
                                          )}</span>
                                  </td>                               
                              </tr>
                                <tr>
                                  <td>
                                      <span className={Style.red}>*</span>百分比</td>
                                  <td style={{borderRight:'1px solid #A2A2A2'}}>
                                      <span>{getFieldDecorator('percent', {
                                              initialValue: content.percent || null
                                          })(<Input maxLength={30} />)}</span>
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
    return {
      data: state.computationManagement.pDetail, 
      argument: state.computationManagement.p_data, 
      linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'computationManagement/p_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'computationManagement/p_update', payload})
        },
        queryKey(payload = {}) {
            dispatch({type: 'paymentManage/key1', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));