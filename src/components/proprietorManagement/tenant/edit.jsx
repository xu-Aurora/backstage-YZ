import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,Modal,DatePicker, Col, message} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';
import Moment from 'moment';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
      userData: '',
      startShow: false,
      endShow: false,
      name: '',
      house: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.getZxhs({
      params: {userId: userData.id, comId : self.props.tenantInfo.comId, comCourtId: self.props.tenantInfo.comCourtId}
    })
    self.props.detailUser({userId: userData.id, id: self.props.tenantInfo.id})
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.userDatail.areaDetail,
      house: nextProps.userDatail.addressName
    })
  }
  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              let addressId,addressName,roomId,roomName
              if(self.state.houseVal) {
                addressId = `${self.state.zxhsVal.key}-${self.state.unitVal.key}-${self.state.houseVal.key}`
                addressName = `${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
                roomId = self.state.houseVal.key
                roomName = self.state.houseVal.label
              } else {
                addressId = self.props.tenantInfo.addressId
                addressName = self.props.tenantInfo.addressName
                roomId = self.props.tenantInfo.roomId
                roomName = self.props.tenantInfo.roomName
              }
              self.props.updateUser({
                params: {
                  id: self.props.tenantInfo.id,
                  userId: userData.id,
                  name: values.name,
                  phone: values.phone,
                  type: values.type,
                  idCard: values.idCard,
                  birthday: values.birthday ? Moment(values.birthday).format("YYYY-MM-DD") : '',
                  comId: self.props.tenantInfo.comId,
                  comName: self.props.tenantInfo.comName,
                  roomId: roomId,
                  roomName: roomName,
                  addressId: addressId,
                  addressName: addressName,
                  comCourtId: self.props.tenantInfo.comCourtId,
                  comCourtName: self.props.tenantInfo.comCourtName,
                  areaDetail: self.props.tenantInfo.areaDetail
                },
                func: function(){
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
  rex (item) {
    //身份证正则
    const regS = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
    //手机号码正则
    let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    let self = this
    message.destroy();
    if(!item.name){
      message.warning('户主姓名不能为空');
      return false
    }
    if(!item.phone){
      message.warning('联系电话不能为空');
      return false
    }
    if(!regPhone.test(item.phone)){
      message.warning('联系电话格式不正确');
      return false
    }
    if(item.idCard) {
      let reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if(!reg.test(item.idCard)) {
        message.warning('身份证号格式不正确');
        return false        
      }  
    }
    return true;
  }
  zxhsChange(lable) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      zxhsVal: lable,
      unitVal: undefined,
      houseVal: undefined
    })
    // 查询单元
    this.props.getUnit({
      params:{userId: userData.id,type: "2,3,4", parentId: lable.key}
    }) 
  }
  unitChange(lable) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      unitVal: lable,
      houseVal: undefined
    })
    //  查询户
    this.props.getHose({userId: userData.id, addressId: lable.key})
  }
  houseChange(lable) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      houseVal: lable
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
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.save.bind(this)}>保存</Button> :
              <Button type="primary">保存</Button>
            }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>户主姓名</td>
                  <td>
                    {getFieldDecorator('name', {
                        initialValue: content.name
                      })(<Input placeholder="请输入户主姓名" />)}
                  </td>
                  <td>角色类型</td>
                  <td>{getFieldDecorator('type', {
                        initialValue: content.type
                      })(
                        <Select
                            style={{ width: '100%'}} placeholder="请选择角色类型">
                            <Option value="2">亲属</Option>
                            <Option value="3">朋友</Option>
                            <Option value="4">租客</Option>
                        </Select>)}</td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>联系电话</td>
                  <td>
                    {getFieldDecorator('phone', {
                      initialValue: content.phone
                      })(<Input placeholder="请输入联系电话" />)}
                  </td>
                  <td>身份证号</td>
                  <td>
                    {getFieldDecorator('idCard', {
                      initialValue: content.idCard
                      })(<Input placeholder="请输入身份证号码" />)}
                  </td>
                </tr>
                <tr>
                  <td>出生年月</td>
                  <td>
                  {getFieldDecorator('birthday', {
                      initialValue: content.birthday ? Moment(content.birthday): null
                      })(<DatePicker />)}
                   
                  </td>
                  <td>所在小区</td>
                  <td>{this.state.name}</td>
                </tr>
                <tr>
                  <td>
                    <span className={Style.red}>*</span>关联房屋
                  </td>
                  <td colSpan={3}>
                    <div style={{height: 30}}>{this.state.house}</div>
                    <Col span={5} style={{marginRight:10}}>
                        <Select value={this.state.zxhsVal} onChange={this.zxhsChange.bind(this)} placeholder="幢" labelInValue>
                          {this.props.zxhsData ? this.props.zxhsData.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Select value={this.state.unitVal} onChange={this.unitChange.bind(this)}  placeholder="单元" labelInValue>
                            {this.props.unitData ? this.props.unitData.map(item => (
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Select value={this.state.houseVal} onChange={this.houseChange.bind(this)} placeholder="户" labelInValue>
                            {this.props.hoseData ? this.props.hoseData.map(item => (
                              <Option value={item.id} key={item.id}>{item.code}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
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
    tenantInfo: state.proprietorManagement.tenantInfo,
    userDatail: state.proprietorManagement.userDatail,
    roleType: state.proprietorManagement.roleType,
    zxhsData: state.proprietorManagement.zxhsData,
    unitData: state.proprietorManagement.unitData,
    hoseData: state.proprietorManagement.hoseData,
  }
}
function dispatchToProps(dispatch) {
  return {
    getZxhs(payload= {}) {
      dispatch({type: 'proprietorManagement/getZxhs', payload })
    },
    getUnit(payload = {}) {
      dispatch({
        type: 'proprietorManagement/getUnit',
        payload
      })
    },
    getHose(payload = {}) {
      dispatch({
        type: 'proprietorManagement/getHose',
        payload
      })
    },
    detailUser(payload = {}) {
      dispatch({
        type: 'proprietorManagement/detailUser',
        payload
      })
    },
    updateUser(payload = {}) {
      dispatch({
        type: 'proprietorManagement/updateUser',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
