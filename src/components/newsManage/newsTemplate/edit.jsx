import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Icon,Modal} from 'antd';
import { connect } from 'dva'
import Style from '../style.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userData: '',
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
        id: this.props.argument.id,
        userId: userData.id
    });
  }

  update = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let rex = this.regx(values)
      if(rex) {
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
      }
    });
  }

  regx (item) {
    message.destroy();
    if(!item.templetName){
      message.warning('模版名不能为空');
      return false
    }
    if(!item.templetType){
      message.warning('请选择模版类型');
      return false
    }
    if(!item.types){
      message.warning('请选择消息类型');
      return false
    }
    if(!item.isInuse){
      message.warning('请选择是否禁用');
      return false
    }
    if(!item.templetTerminal){
      message.warning('终端不能为空');
      return false
    }
    if(!item.templetContent){
      message.warning('模版内容不能为空');
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
                this.state.requestStatus ? <Button type="primary" onClick={this.update}>保存</Button> :
                <Button type="primary">保存</Button>
            }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>模版名</td>
                  <td>
                    <span>{getFieldDecorator('templetName', {initialValue: content.templetName})(
                      <Input placeholder="请输入模版名" />)}
                    </span>
                  </td>
                  <td><span className={Style.red}>*</span>模版类型</td>
                  <td>
                    {getFieldDecorator('templetType', {initialValue: content.templetType})(
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
                    {getFieldDecorator('types', {initialValue: content.types})(
                      <Select placeholder="请选择">
                        <Option value="0">系统通知</Option>
                        <Option value="1">信贷通知</Option>
                        <Option value="2">还款通知</Option>
                        <Option value="3">活动通知</Option>
                        <Option value="4">卡券通知</Option>
                        <Option value="5">短信</Option>
                        <Option value="6">重置密码</Option>
                      </Select>
                      )}
                  </td>
                  <td><span className={Style.red}>*</span>是否启用</td>
                  <td>
                    <span>
                      {getFieldDecorator('isInuse', {initialValue: `${content.isInuse}`})(
                        <Select placeholder="请选择！">
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>终端</td>
                  <td>
                    {getFieldDecorator('templetTerminal', {initialValue: content.templetTerminal})(
                        <Select placeholder="请选择">
                          <Option value="0">光伏贷</Option>
                          <Option value="1">壹税通</Option>
                        </Select>
                    )}
                  </td>
                  <td><span className={Style.red}>*</span>模版内容</td>
                  <td>
                     <span>{getFieldDecorator('templetContent', {initialValue: content.templetContent})(
                      <Input placeholder="请输入模版内容" />)}</span>
                  </td>
                </tr>
                <tr>
                  <td>模版描述</td>
                  <td colSpan={3}>
                    <span>
                      {getFieldDecorator('templetDescribe', {initialValue: content.templetDescribe})(
                        <Input placeholder="请输入模版描述" />
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
    data: state.message.detail,
    argument: state.message.itemData,
  }
}
function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'message/detail', payload})
    },
    update(payload = {}) {
      dispatch({type: 'message/update', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
