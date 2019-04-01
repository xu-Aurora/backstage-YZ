import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Icon,Modal,Col, DatePicker } from 'antd';
import { connect } from 'dva';
import Style from '../addStyle.less';
import Moment from 'moment';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      year:'年',
      month:'月',
      day:'日',
      name: '',
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.getZxhs({
      params: {userId: userData.id, comId : self.props.communityRight.id, comCourtId: self.props.gardenRight ? self.props.gardenRight.id : ''}
    })
    if(this.props.gardenRight) { 
      let name = `${this.props.communityRight.area}-${this.props.communityRight.name}-${this.props.gardenRight.name}`
      this.setState({
        name
      })
    } else {
      let name = `${this.props.communityRight.area}-${this.props.communityRight.name}`
      this.setState({
        name
      })
    } 
  }

  addUserSub() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              let areaDetail
              if(self.props.gardenRight) {
                areaDetail = `${self.props.communityRight.area}-${self.props.communityRight.name}-${self.props.gardenRight.name}`
              } else {
                areaDetail = `${self.props.communityRight.area}-${self.props.communityRight.name}`
              }
              self.props.addUser({
                params: { 
                  userId: userData.id,
                  name: values.name,
                  phone: values.phone,
                  type: 1,
                  idCard: values.idCard,
                  birthday: values.birthday ? Moment(values.birthday).format("YYYY-MM-DD") : '',
                  comId: self.props.communityRight.id,
                  comName: self.props.communityRight.name,
                  roomId: self.state.houseVal.key,
                  roomName: self.state.houseVal.label,
                  addressId: `${self.state.zxhsVal.key}-${self.state.unitVal.key}-${self.state.houseVal.key}`,
                  addressName: `${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`,
                  comCourtId: self.props.gardenRight ? self.props.gardenRight.id : '',
                  comCourtName: self.props.gardenRight ? self.props.gardenRight.name : '',
                  areaDetail: areaDetail,
                },
                func: function(){
                  message.success('操作成功!', 1.5, function() {
                  self.props.search('addVisible')
                    
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
    } else{
      let regPhone =  /^((0?1[34578]\d{9})|((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}))$/   //手机号码+固定电话
      if(!regPhone.test(item.phone)) {
        message.warning('用户电话格式不正确');
        return false        
      }  
    }
    if(item.idCard) {
      let reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if(!reg.test(item.idCard)) {
        message.warning('身份证号格式不正确');
        return false        
      }  
    }
    if(!regPhone.test(item.phone)){
      message.warning('联系电话格式不正确');
      return false
    }
    if(item.idCard){
      if(!regS.test(item.idCard)){
        message.warning('身份证号格式不正确');
        return false
      }
    }
    if(!self.state.zxhsVal){
      message.warning('请选择幢');
      return false
    }
    if(!self.state.unitVal){
      message.warning('请选择单元');
      return false
    }
    if(!self.state.houseVal){
      message.warning('请选择户');
      return false
    }
    return true;
  }
  toggle = () => {
    if (this.state.roloStatus === '1' || !this.state.roloStatus) {
      this.setState({isUp: '0', roloStatus: '0'});
    } else {
      this.setState({isUp: '1', roloStatus: '1'});
    }
  }
  roloOption = (data) => {
    const children = [];

    data.forEach((item) => {
      if(item.status === "0"){
        children.push((
          <Option key={item.id} value={item.id.toString()} >{item.name}</Option>
        ))
      }

    })
    return children;
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
      params:{userId: userData.id,type: 2, parentId: lable.key}
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
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.addUserSub.bind(this)}>保存</Button> :
              <Button type="primary">保存</Button>
            }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>户主姓名</td>
                  <td>
                    {getFieldDecorator('name', {
                      })(<Input placeholder="请输入户主姓名" />)}
                  </td>
                  <td>角色类型</td>
                  <td>{this.props.roleType}</td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>联系电话</td>
                  <td>
                    {getFieldDecorator('phone', {
                      })(<Input placeholder="请输入联系电话" />)}
                  </td>
                  <td>身份证号</td>
                  <td>
                    {getFieldDecorator('idCard', {
                      })(<Input placeholder="请输入身份证号码" />)}
                  </td>
                </tr>
                <tr>
                  <td>出生年月</td>
                  <td>
                  {getFieldDecorator('birthday', {
                      })(<DatePicker />)}
                   
                  </td>
                  <td>所在小区</td>
                  <td>{this.state.name}</td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>关联房屋</td>
                  <td colSpan={3}>
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
    communityRight: state.proprietorManagement.communityRight,
    gardenRight: state.proprietorManagement.gardenRight,
    zxhsData: state.proprietorManagement.zxhsData,
    unitData: state.proprietorManagement.unitData,
    hoseData: state.proprietorManagement.hoseData,
    roleType: state.proprietorManagement.roleType,

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
    addUser(payload = {}) {
      dispatch({
        type: 'proprietorManagement/addUser',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
