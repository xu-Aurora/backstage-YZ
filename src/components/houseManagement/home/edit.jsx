import React, {Component} from 'react';
import {Input,Select,Button,Row,Tabs,Form,message} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';

import {mul} from '../../../util/count';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      name: '',
      propertyRate: '',
      square: '',
      type: {
          key: '',
          label: ''
      }
    };
  }
  componentDidMount() {
    // const userData = JSON.parse(localStorage.getItem('userDetail'));
    if(this.props.houseDetail.comCourtName) { 
      let name = `${this.props.houseDetail.comName}-${this.props.houseDetail.comCourtName}-${this.props.houseDetail.address}-${this.props.houseDetail.code}`
      this.setState({
        name
      })
    } else {
      let name = `${this.props.houseDetail.comName}-${this.props.houseDetail.address}-${this.props.houseDetail.code}`
      this.setState({
        name
      })
    }
    let type = {
        key: `${this.props.houseDetail.typeCode}`,
        label: this.props.houseDetail.typeCodeName,
    }

    this.setState({
        type,
        square: this.props.houseDetail.square,
        propertyRate: this.props.houseDetail.propertyRate
    })
  }
  addUserSub () {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.editRoom({
                params: {
                  userId: userData.id,            
                  name: this.props.houseDetail.name,
                  address: this.props.houseDetail.address,
                  addressId: this.props.houseDetail.addressId,
                  comId: this.props.houseDetail.comId,
                  comName: this.props.houseDetail.comName, 
                  comCourtId: this.props.houseDetail.comCourtId,
                  comCourtName: this.props.houseDetail.comCourtName,
                  typeCode: this.state.type.key,
                  typeCodeName: this.state.type.label,
                  square: this.state.square,
                  floor: values.floor,
                  code: `${values.code}室`,
                  propertyRate: this.state.propertyRate,
                  id: this.props.houseDetail.id
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
    let self = this
    message.destroy();
    if(!self.state.type.key){
      message.warning('请选择户型');
      return false
    }
    if(!self.state.square) {
      message.warning('面积不能为空');
      return false
    } else {
      let re = /^\d+(\.\d{1,2})?$/
      if(!re.test(self.state.square)) {
        message.warning('面积仅限输入正数字（小数点后2位）');
        return false        
      }
    }
    // if(!item.floor) {
    //   message.warning('请选择楼层');
    //   return false
    // }
    if(!item.code) {
      message.warning('户号不能为空');
      return false
    } else {
      let re = /^\d+$/
      if(!re.test(item.code)) {
        message.warning('户号只能为正整数');
        return false        
      }
    }
    if(!self.state.propertyRate){
      message.warning('物业费率不能为空');
      return false
    } else {
      let re = /^\d+(\.\d{1,3})?$/
      if(!re.test(self.state.propertyRate)) {
        message.warning('物业费率仅限输入正数字（小数点后3位）');
        return false        
      }
    }
    return true;
  }

  floors = () => {
    const data = [];
    for (let i = 1; i < 51; i++) {
      data.push(<Option value={`${i}`} key={i}>{i}层</Option>)
    }
    return data;
  }

  inputChange (item,ev) {
    this.setState({
      [item]: ev.target.value
    })
  }
  selectChange(lable) {
    this.setState({
      type: lable
    })
  }
  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit()
  }
  render() {
    const { houseDetail} = this.props;
    const {getFieldDecorator} = this.props.form;
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
              <tr style={{visibility:'hidden'}}>
                  <td  style={{width:'18%'}}></td>
                  <td></td>
                  <td  style={{width:'18%'}}></td>
                  <td></td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>当前位置</td>
                  <td colSpan='3'>
                    <span>{this.state.name}</span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>户型</td>
                  <td>
                      <Select placeholder="请选择" value={this.state.type} onChange={this.selectChange.bind(this)} labelInValue >
                        <Option value="1">多层住宅</Option>
                        <Option value="2">小高层住宅</Option>
                        <Option value="3">高层住宅</Option>
                        <Option value="4">独立式住宅</Option>
                        <Option value="5">联排别墅</Option>
                        <Option value="6">综合性住宅</Option>
                        <Option value="7">酒店式公寓</Option>
                      </Select>
                  </td>
                  <td><span className={Style.red}>*</span>面积</td>
                  <td>
                    <span>
                        <Input style={{width:'90%'}} value={this.state.square}  onChange={this.inputChange.bind(this, 'square')} />㎡
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>楼层</td>
                  <td>
                    {getFieldDecorator('floor', {initialValue: houseDetail.floor})(
                      <Select placeholder="请选择楼层" >
                        { this.floors() }
                      </Select>
                      )}
                  </td>
                  <td><span className={Style.red}>*</span>户号</td>
                  <td>
                    {getFieldDecorator('code', {
                        initialValue: houseDetail.code ?   houseDetail.code.replace('室', '') : ""
                      })(<Input style={{width:'90%'}}  placeholder="请输入户号" />)}室
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>物业费率</td>
                  <td>
                    <span>
                        <Input style={{width:'75%'}} value={this.state.propertyRate}   onChange={this.inputChange.bind(this, 'propertyRate')} />元/㎡*月
                    </span>
                  </td>
                  <td>物业费</td>
                  <td>
                    {
                      mul(this.state.square, this.state.propertyRate)
                    } 元/月
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
    houseDetail: state.houseManagement.houseDetail,
  }
}
function dispatchToProps(dispatch) {
  return {
    editRoom(payload = {}) {
      dispatch({
        type: 'houseManagement/editRoom',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
