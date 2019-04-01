import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Tabs} from 'antd';
import { connect } from 'dva';
import Style from './style.less';

import verifyEmail from '../../util/verifyEmail';


const Option = Select.Option;
const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      tabKey: this.props.data.status,
      instCode: this.props.data.instCode,
      Visible: false
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryRoloList({ userId: userData.id, requestType: true });
    this.props.queryDetail({id: this.props.argument.id, userId: userData.id});
    this.props.instCode({ 
      userId: userData.id,
      code: userData.instCode
    })
    
    if(userData.id == this.props.argument.id) {
      this.setState({
        Visible: true
      })
    }
  }
  addUserSub = () =>{
    this.props.form.validateFields((err, values) => {
      const self = this;
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.userUpdate({
                params: { 
                  id: self.props.argument.id, 
                  userId: userData.id, 
                  ...values, 
                  instCode: self.state.instCode,
                  instName: self.state.instName,
                  roleIds: values.roleIds.join(','),
                  status: self.state.roloStatus
                }, 
                func: function(){
                  message.success('操作成功!', 1.5, function() {
                    self.props.search('editVisible');
                  });
                }
              })
          })
        }
      } 


    })
  }
  rex (item) {
    message.destroy();
    if(!item.name){
      message.warning('用户名称不能为空');
      return false
    }
    if(!this.state.instCode){
      message.warning('所属机构不能为空');
      return false
    }
    if(!item.loginAccount){
      message.warning('用户账号不能为空');
      return false
    }
    if(!item.roleIds){
      message.warning('所属角色不能为空');
      return false
    }
    if(item.phoneNo){
      let regPhone =  /^((0?1[34578]\d{9})|((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}))$/   //手机号码+固定电话
      if(!regPhone.test(item.phoneNo)) {
        message.warning('用户电话格式不正确');
        return false        
      }      
    }
    if(item.email){
      if(!verifyEmail(item.email)) {
        message.warning('输入的邮箱格式不正确!', 1.5);
        return false        
      }
    }
    return true;
  }
  //所属角色
  roloOption = (data, type) => {
    const children = [];
    data.forEach((item) => {
      if (type === 1) {
        children.push((
          <Option key={item.id} value={item.id.toString()} >{item.name}</Option>
        ))
      } else {
        children.push(item.roleId.toString())
      }
    })
    return children;
  }
  //所属机构
  instCodeOption = (data) => {
    const children = [];
    if(data){
      data.forEach((item) => {
        children.push((
          <Option key={item.code} value={item.code.toString()} >{item.name}</Option>
        ))
      })
      return children;
    }

  }
  handleSelect(val,name){
    this.setState({
      instCode: val,
      instName: name.props.children
    })
  }

  tabKey (item) {
    this.setState({
      tabKey: item
    })
  }
  render() {
    const { data} = this.props;
    const { getFieldDecorator } = this.props.form;
    const content = data || {};
    const roloList = this.props.roloList ? this.roloOption(this.props.roloList.list, 1) : null;
    const instCodeList = this.props.instCodeData ? this.instCodeOption(this.props.instCodeData.list) : null;
    const defaultRolo = content.userRoles ? this.roloOption(content.userRoles, 0) : [];
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.addUserSub}>确定提交</Button> :
              <Button type="primary">确定提交</Button>
            }
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>用户名称</td>
                    <td>
                      <span>{getFieldDecorator('name', {
                          initialValue: content.name
                        })(<Input />)}</span>
                    </td>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td>
                        <Select
                          value={ this.state.instCode }
                          onChange={ this.handleSelect.bind(this) }
                          style={{ width: '100%' }}
                          placeholder="请选择!"
                          disabled={this.state.Visible}
                        >
                          {instCodeList}
                        </Select>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>用户状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={this.state.tabKey} onTabClick={this.tabKey.bind(this)}>
                          <TabPane   tab="正常" key="0"></TabPane>
                          <TabPane  tab="注销" key="1"></TabPane>
                        </Tabs>
                    </td>
                    <td><span className={Style.red}>*</span>用户账号</td>
                    <td>
                      <span>{getFieldDecorator('loginAccount', {
                          initialValue: content.loginAccount
                        })(<Input disabled/>)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>所属角色</td>
                    <td colSpan='3'>
                      <span>{getFieldDecorator('roleIds', {
                            initialValue: defaultRolo || null
                        })(<Select
                          mode='multiple'
                          style={{ width: '100%' }}
                          placeholder="请选择!"
                          disabled={this.state.Visible}
                        >
                          {roloList}
                        </Select>)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>用户电话</td>
                    <td>
                      <span>{getFieldDecorator('phoneNo', {
                          initialValue: content.phoneNo
                        })(<Input maxLength={50} />)}</span>
                    </td>
                    <td>邮箱</td>
                    <td>
                      <span>{getFieldDecorator('email', {
                          initialValue: content.email
                        })(<Input />)}</span>
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
    argument: state.adminManage.saveSeslect,
    data: state.adminManage.detail,
    instCodeData: state.adminManage.instCode,
    roloList: state.roloManage.data//角色
  }
}
function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'adminManage/detail', payload})
    },
    instCode(payload = {}) {
      dispatch({
        type: 'adminManage/instCode',
        payload
      })
    },
    userUpdate(payload = {}) {
      dispatch({
        type: 'adminManage/userUpdate',
        payload
      })
    },
    queryList(payload, params) {
      dispatch({type: 'adminManage/search', payload})
    },
    deleteUser(payload = {}) {
      dispatch({
        type: 'adminManage/deleteUser',
        payload
      })
    },
    queryRoloList(payload = {}) {//获取角色数据
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
