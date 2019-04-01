import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,Modal,DatePicker,message} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';
import Moment from 'moment';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      userData: '',
      startShow: false,
      endShow: false,
      name: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.detailUser({userId: userData.id, id: self.props.houseInfo.id})
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      name: `${nextProps.userDatail.areaDetail}-${nextProps.userDatail.addressName}`
    })
  }
  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }

  //取消停用/启用
  handleCancel(e) {
    this.setState({
        [e]: false
    })
  }
  loop(self, item) {
    if(item == 0) {
      return (<Button type="primary" 
      onClick={self.show.bind(self, 'endShow')}
      style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>停用</Button>)
    } else if(item == 1) {
      return (<Button type="primary" 
      onClick={self.show.bind(self, 'startShow')}
      style={{marginLeft:15}}>启用</Button>)
    } else {
      return null
    }
  }
  show(item){
    this.setState({
      [item]: true
    })
  }
  start() {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    self.props.setStatus({
      params:{
        userId: userData.id,
        id: self.props.houseInfo.id
      },
      func: function(){
        message.success('操作成功!', 1.5, function() {
          // self.setState({
          //   startShow: false
          // })
          self.props.search('detailVisible')
        });
      }
    })
  }
  end() {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    self.props.setStatus({
      params:{
        userId: userData.id,
        id: self.props.houseInfo.id
      },
      func: function(){
        message.success('操作成功!', 1.5, function() {
          // self.setState({
          //   startShow: false
          // })
          self.props.search('detailVisible')
        });
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userDatail} = this.props;
    const content = userDatail || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
            {
              this.loop(this, content.dataStatus)
            }
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>户主姓名</td>
                  <td>
                    {getFieldDecorator('name', {
                        initialValue: content.name
                      })(<Input placeholder="请输入户主姓名" disabled/>)}
                  </td>
                  <td>角色类型</td>
                  <td>{this.props.roleType}</td>
                </tr>
                <tr>
                  <td>认证状态</td>
                  <td>
                    {getFieldDecorator('status', {initialValue: content.status})(
                      <Select placeholder="请选择" disabled>
                        <Option value="1">未认证</Option>
                        <Option value="2">已认证</Option>
                      </Select>
                    )}
                  </td>
                  <td><span className={Style.red}>*</span>联系电话</td>
                  <td>
                    {getFieldDecorator('phone', {
                      initialValue: content.phone
                      })(<Input placeholder="请输入联系电话" disabled/>)}
                  </td>
                </tr>
                <tr>
                  <td>身份证号</td>
                  <td>
                    {getFieldDecorator('idCard', {
                      initialValue: content.idCard
                      })(<Input placeholder="请输入身份证号码" disabled/>)}
                  </td>
                  <td>出生年月</td>
                  <td>
                  {getFieldDecorator('birthday', {
                      initialValue: content.birthday ? Moment(content.birthday): null
                      })(<DatePicker disabled/>)}
                   
                  </td>
                </tr>
                <tr>
                  <td>数据状态</td>
                  <td>
                    {getFieldDecorator('dataStatus', {initialValue: content.dataStatus})(
                      <Select placeholder="请选择" disabled>
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                      </Select>
                    )}
                  </td>
                  <td>创建时间</td>
                  <td>{content.createTime ? Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss"): null}</td>
                </tr>
                <tr>
                  <td>关联房屋</td>
                  <td colSpan={3}>{this.state.name}</td>
                </tr>
              </tbody>
            </table>

            </Form>
          </Row>
        </div>

        {/* 停用户主提示框 */}
        <Modal
            title="启用"
            visible={this.state.startShow}
            onOk={this.start.bind(this)}
            onCancel={this.handleCancel.bind(this, 'startShow')}
            >
            <p style={{fontSize:16}}>确定启用?</p>
        </Modal>
        <Modal
            title="停用"
            visible={this.state.endShow}
            onOk={this.end.bind(this)}
            onCancel={this.handleCancel.bind(this, 'endShow')}
            >
            <p style={{fontSize:16}}>确定停用?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    houseInfo: state.proprietorManagement.houseInfo,
    userDatail: state.proprietorManagement.userDatail,
    roleType: state.proprietorManagement.roleType
  }
}
function dispatchToProps(dispatch) {
  return {
    detailUser(payload = {}) {
      dispatch({
        type: 'proprietorManagement/detailUser',
        payload
      })
    },
    setStatus(payload = {}) {
      dispatch({
        type: 'proprietorManagement/setStatus',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
