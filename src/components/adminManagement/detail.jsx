import React, { Component, PropType } from 'react';
import {Input,Select,Radio,Button,Row,Col,Tabs,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import Md5 from 'js-md5';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: this.props.argument.status,
      visibleShow: false,
      delvisibleShow: false,
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
    });
    if(userData.id == this.props.argument.id) {
      this.setState({
        Visible: true
      })
    }
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

  goEdit(){
    this.props.goEdit(true)
  }
  tabKey (item) {
    this.setState({
      tabKey: item
    })
  }
  //重置密码确定
  restPwd = (e) => {
    let self = this
    const params = self.props.argument;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      self.props.userUpdate({
        params: {
          name: params.name,
          password: Md5('123456'),
          loginAccount: params.loginAccount,
          id: params.id,
          userId: userData.id
        },
        func: function () {
          Modal.success({title: '', content: '密码重置成功，初始密码123456'});
          self.setState({
            visibleShow: false
          })
        }
      })
  }
  sure (e) {
    this.setState({
      [e]: true
    })
  }
  handleCancel(e) {
    this.setState({
        [e]: false
    })
  }
  del () {
    let self = this
    const params = self.props.argument;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      self.props.deleteUser({
        params: {
          id: params.id,
          userId: userData.id
        },
        func: function () {
          message.success('操作成功!', 1.5, function() {
            self.setState({
              delvisibleShow: false
            })
            self.props.search('detailVisible')
          })
         
        }
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
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
          <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <Button type="primary" 
                      style={{marginLeft: 10}}
                      onClick={this.sure.bind(this, 'visibleShow')}>重置密码</Button>
              {
                this.state.Visible ? null:(<Button type="primary" 
                style={{marginLeft: 10}}
                onClick={this.sure.bind(this, 'delvisibleShow')}>删除用户</Button>)
              }
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>用户名称</td>
                    <td>
                      <span>{getFieldDecorator('name', {
                          initialValue: content.name
                        })(<Input disabled/>)}</span>
                    </td>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td>
                        <Select
                          defaultValue={ content.instCode }
                          style={{ width: '100%' }}
                          placeholder="请选择!"
                          disabled
                        >
                          {instCodeList}
                        </Select>
                    </td>

                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>用户状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={this.state.tabKey} onTabClick={this.tabKey.bind(this)}>
                          <TabPane  disabled tab="正常" key="0"></TabPane>
                          <TabPane disabled tab="注销" key="1"></TabPane>
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
                    <td colSpan={3}>
                      <span>{getFieldDecorator('roleIds', {
                            initialValue: defaultRolo || null
                        })(<Select
                          mode='multiple'
                          style={{ width: '100%' }}
                          placeholder="请选择!"
                          disabled
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
                        })(<Input maxLength={50} disabled/>)}</span>
                    </td>
                    <td>邮箱</td>
                    <td>
                      <span>{getFieldDecorator('email', {
                          initialValue: content.email
                        })(<Input disabled/>)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
          </Row>  
            </Form>
        </div>
        {/* 重置密码提示框 */}
        <Modal
            title="重置密码"
            visible={this.state.visibleShow}
            onOk={this.restPwd.bind(this)}
            onCancel={this.handleCancel.bind(this,'visibleShow')}
            >
            <p style={{fontSize:16}}>确定重置密码?</p>
        </Modal>
         {/* 删除提示框 */}
         <Modal
            title="删除用户"
            visible={this.state.delvisibleShow}
            onOk={this.del.bind(this)}
            onCancel={this.handleCancel.bind(this,'delvisibleShow')}
            >
            <p style={{fontSize:16}}>确定删除?</p>
        </Modal>
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
