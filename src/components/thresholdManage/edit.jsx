import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Icon,Modal} from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userData: '',
      requestStatus: true
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetails({
        id: this.props.argument.id,
        userId: userData.id
    });
  }

  update = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
   
    this.props.form.validateFields((err, values) => {
        let rex = this.regx(values);
        if(rex) {
            if(this.state.requestStatus){
                self.setState({requestStatus: false},() => {
                    this.props.update({
                        params: {
                            ...values,
                            id: self.props.argument.id,
                            userId: userData.id
                        },
                        func: function () {
                            message.success('添加成功!', 1.5, function () {
                                self.props.search('editVisible')
                                
                            });
                        }
                    })
                })
            }
        }

    });
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
    const { getFieldDecorator } = this.props.form;
    const { data} = this.props;
    const content = data || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
                {
                  this.state.requestStatus ? <Button type="primary" onClick={this.update.bind(this)}>保存</Button> :
                  <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                    <tr>
                        <td>
                            <span className={Style.red}>*</span>名称</td>
                        <td>
                            <span>{getFieldDecorator('thresholdName', {initialValue: content.thresholdName})(<Input/>)}</span>
                        </td>
                        <td>
                            <span className={Style.red}>*</span>阀值类型</td>
                        <td>
                            <span>
                              {getFieldDecorator('thresholdType', {initialValue: `${content.thresholdType}`})(
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
                                {getFieldDecorator('thresholdKey', {initialValue: content.thresholdKey})(<Input />)}
                            </div>
                        </td>
                        <td>
                            <span className={Style.red}>*</span>阀值</td>
                        <td>
                            <div>
                                {getFieldDecorator('value', {initialValue: content.value})(<Input />)}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={Style.red}></span>备注
                        </td>
                        <td colSpan='3'>
                            <div>
                                {getFieldDecorator('memo', {initialValue: content.memo})(<Input />)}
                            </div>
                        </td>
                    </tr>
                </tbody>
              </table>
            </Form>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.thresholdManagement.details,
    argument: state.thresholdManagement.saveSeslect, //从redux中获取,获取到的是列表组件点击高亮的那个数据
    linkID: state.login.userMsg.id
  }
}
function dispatchToProps(dispatch) {
  return {
    queryDetails(payload = {}) {
      dispatch({type: 'thresholdManagement/details', payload})
    },
    update(payload = {}) {
        dispatch({type: 'thresholdManagement/update', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
