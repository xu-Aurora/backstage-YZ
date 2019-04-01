import React, {Component} from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,message,Popconfirm} from 'antd';
import {connect} from 'dva';
import Style from './addStyle.less';

const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
        };
    }
    add = () => {
        //form.validateFields参数values可拿到所有input里输入的数据
        this.props.form.validateFields((err, values) => {
            const self = this;
            const userData = JSON.parse(localStorage.getItem('userDetail'));
            let rex = this.regx(values)
            if(rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.addProduct({
                            params: {
                                ...values,
                                userId: userData.id
                            },
                            func: function () {
                                message.success('添加成功!', 1.5, function () {
                                self.props.search('addVisible')
                                    
                                });
                            }
                            })
                    })
                }
            }

        })
    }
    regx (item) {
        message.destroy();
        if(!item.thresholdName){
          message.warning('名称不能为空');
          return false
        }
        if(!item.thresholdKey){
          message.warning('key不能为空');
          return false
        }
        if(item.value){
            //正则匹配只能输入数字
            let regNum = /^[0-9]*$/;
            if(!regNum.test(item.value)){
                message.warning('阀值只能输入数字');
                return false
            } 
        } else {
            message.warning('阀值不能为空');
            return false
        }
        if(!item.thresholdType){
            message.warning('请选择阀值类型');
            return false
        } 
        return true;
      }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={Style.userBox}>
              <Row>
              {
                  this.state.requestStatus ? <Button type="primary" onClick={this.add}>保存</Button> :
                  <Button type="primary">保存</Button>
              }
                  
                  <table cellSpacing="0" className={Style.mytable}>
                      <tbody>
                          <tr>
                              <td>
                                  <span className={Style.red}>*</span>名称</td>
                              <td>
                                  <span>{getFieldDecorator('thresholdName', {})(<Input maxLength={30} />)}</span>
                              </td>
                              <td>
                                  <span className={Style.red}>*</span>阀值类型</td>
                              <td>
                                  <span>
                                    {getFieldDecorator('thresholdType', {})(
                                        <Select style={{width:'100%'}}>
                                            <Option value="0">日清</Option>
                                            <Option value="1">月清</Option>
                                        </Select>
                                      )}
                                    </span>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <span className={Style.red}>*</span>key
                              </td>
                              <td>
                                  <div>
                                      {getFieldDecorator('thresholdKey', {})(<Input maxLength={30} />)}
                                  </div>
                              </td>
                              <td>
                                  <span className={Style.red}>*</span>阀值</td>
                              <td>
                                  <div>
                                      {getFieldDecorator('value', {})(<Input maxLength={30} />)}
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <span className={Style.red}></span>备注
                              </td>
                              <td colSpan='3'>
                                  <div>
                                      {getFieldDecorator('memo', {})(<Input maxLength={30} />)}
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </Row>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
  return {linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        addProduct(payload = {}) {
          dispatch({type: 'thresholdManagement/addProduct', payload})
      }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
