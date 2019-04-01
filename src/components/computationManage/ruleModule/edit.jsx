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
            this.props.form.validateFields((err, values) => {
              let rex = self.regx(values);
              if(rex){

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
            }



            })
    }
    regx(item){
        message.destroy();
      if(!item.templateKey){
        message.warning('模板标识不能为空');
        return;
      }
      if(!item.templateName){
        message.warning('模板名称不能为空')
        return;
      }
      if(!item.describe){
        message.warning('描述不能为空')
        return;
      }
      return true;
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
                                      <span className={Style.red}>*</span>模板名称</td>
                                  <td>
                                      <span>{getFieldDecorator('templateName', {
                                              initialValue: content.templateName || null
                                          })(<Input maxLength={30} />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>获取来源</td>
                                  <td>
                                        <span>{getFieldDecorator('resourceType', {
                                              initialValue: `${content.resourceType}` || "1"
                                          })(
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
                                        <span>{getFieldDecorator('status', {
                                              initialValue: `${content.status}` || "1"
                                          })(
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
                                      <span>{getFieldDecorator('describe', {
                                              initialValue: content.describe || null
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
      data: state.computationManagement.hDetail, 
      argument: state.computationManagement.h_data, 
      linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
          dispatch({type: 'computationManagement/h_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'computationManagement/h_update', payload})
        },
        queryKey(payload = {}) {
            dispatch({type: 'paymentManage/key1', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
