import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Icon,Modal} from 'antd';
import { connect } from 'dva'
import Style from './style.less';
import verifyEmail from '../../util/verifyEmail';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetails({
        id: this.props.argument.id,
        userId: userData.id
    });
  }

  update() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let rex = this.regx(values)
      if(rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() =>{
            this.props.update({
              params: {
                ...values,
                id: self.props.argument.id,
                userId: userData.id, 
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
    });
  }

  regx (item) {
    message.destroy();
    if(!item.title){
      message.warning('标题不能为空');
      return false
    }
    if(!item.types){
      message.warning('请选择消息分类');
      return false
    }
    if(!item.newsType){
      message.warning('请选择消息类型');
      return false
    }
    if(item.toEmail){
      if(!verifyEmail(item.toEmail)) {
        message.warning('发送目标邮箱格式不正确!', 1.5);
        return false        
      }
    } else {
      message.warning('发送目标邮箱不能为空');
      return false
    }
    if(item.toPhone){
      let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;  //手机号码正则
      if(!regPhone.test(item.toPhone)) {
        message.warning('发送目标手机号格式不正确');
        return false        
      }      
    }else {
      message.warning('发送目标手机号不能为空');
      return false
    }
    if(!item.toUserId){
      message.warning('接收者用户号不能为空');
      return false
    }
    if(!item.terminal){
      message.warning('终端不能为空');
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
        </div>
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
                  <td><span className={Style.red}>*</span>标题</td>
                  <td>
                    <span>{getFieldDecorator('title', {
                        initialValue: content.title
                      })(<Input placeholder="请输入标题" />)}</span>
                  </td>
                  <td><span className={Style.red}>*</span>消息分类</td>
                  <td>
                    {getFieldDecorator('types', {initialValue: content.types})(
                      <Select placeholder="请选择">
                        <Option value="0">app消息</Option>
                        <Option value="1">站内信</Option>
                        <Option value="2">短信</Option>
                        <Option value="3">邮件</Option>
                        <Option value="4">公众号</Option>
                        <Option value="5">商户</Option>
                      </Select>
                      )}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>消息类型</td>
                  <td>
                    {getFieldDecorator('newsType', {initialValue: content.newsType})(
                      <Select placeholder="请选择">
                        <Option value="0">系统通知</Option>
                        <Option value="1">信贷通知</Option>
                        <Option value="2">还款通知</Option>
                        <Option value="3">活动通知</Option>
                        <Option value="4">卡券通知</Option>
                        <Option value="5">短信</Option>
                      </Select>
                      )}
                  </td>
                  <td><span className={Style.red}>*</span>发送目标邮箱</td>
                  <td>
                    <span>
                      {getFieldDecorator('toEmail', {initialValue: content.toEmail})(
                        <Input placeholder="请输入目标邮箱" />
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>发送目标手机号</td>
                  <td>
                     <span>{getFieldDecorator('toPhone', {initialValue: content.toPhone})(
                      <Input placeholder="请输入目标手机号" />)}</span>
                  </td>
                  <td><span className={Style.red}>*</span>接收者用户号</td>
                  <td>
                     <span>{getFieldDecorator('toUserId', {initialValue: content.toUserId})(
                      <Input placeholder="请输入接收者用户号" />)}</span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>终端</td>
                  <td>
                    {getFieldDecorator('terminal', {initialValue: content.terminal})(
                      <Select placeholder="请选择">
                        <Option value="0">光伏贷</Option>
                        <Option value="1">壹税通</Option>
                      </Select>
                      )}
                  </td>
                  <td>内容</td>
                  <td>
                    <span>
                      {getFieldDecorator('content', {initialValue: content.content})(
                        <Input placeholder="请输入内容" />
                      )}
                    </span>
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
    data: state.message.details,
    argument: state.message.newsData,
  }
}
function dispatchToProps(dispatch) {
  return {
    queryDetails(payload = {}) {
      dispatch({type: 'message/details', payload})
    },
    update(payload = {}) {
      dispatch({type: 'message/newsUpdate', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
