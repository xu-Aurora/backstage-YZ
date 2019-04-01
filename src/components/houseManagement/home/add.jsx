import React, {Component} from 'react';
import Md5 from 'js-md5';
import {Input,Select,Button,Row,Col,Tabs,Form,message} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';

import {mul} from '../../../util/count';

const TabPane = Tabs.TabPane;
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
      type: ''
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let name
    if(this.props.gardenRight) {
      name = `${this.props.communityRight.name}-${this.props.gardenRight.name}-${this.props.zxhsInfo.name}-${this.props.unitInfo.name}`
    } else {
      name = `${this.props.communityRight.name}-${this.props.zxhsInfo.name}-${this.props.unitInfo.name}`
    }
    name = name.replace(/\-无单元/,'')
    this.setState({
      name
    })
  }
  componentWillReceiveProps(nextProps){
  }
  handleReturn = () => {
    history.back(-1);
  }
  addUserSub () {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.addRoom({
                params: {
                  userId: userData.id,            
                  name: `${this.props.zxhsInfo.name}-${this.props.unitInfo.name}-${values.code}室`.replace(/\-无单元/,''),
                  address: this.props.unitInfo.name,
                  addressId: this.props.unitInfo.id,
                  comId: this.props.communityRight.id,
                  comName: this.props.communityRight.name, 
                  comCourtId: this.props.gardenRight ? this.props.gardenRight.id : '',
                  comCourtName: this.props.gardenRight ? this.props.gardenRight.name : '',
                  typeCode: this.state.type.key,
                  typeCodeName: this.state.type.label,
                  square: this.state.square,
                  floor: values.floor,
                  code: `${values.code}室`,
                  propertyRate: this.state.propertyRate
                },
                func: function(){
                  message.success('操作成功!', 1.5, function() {
                    self.props.search('addNo')
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
    if(!self.state.type){
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
      if(self.state.propertyRate == '0') {
        message.warning('物业费率不能为0');
        return false        
      }
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

  floors = () => {
    const data = [];
    for (let i = 1; i < 51; i++) {
      data.push(<Option value={i} key={i}>{i}层</Option>)
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
                      <Select placeholder="请选择" onChange={this.selectChange.bind(this)} labelInValue >
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
                        <Input style={{width:'90%'}}  onChange={this.inputChange.bind(this, 'square')}/>&ensp;㎡
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>楼层</td>
                  <td>
                    {getFieldDecorator('floor', {})(
                      <Select placeholder="请选择楼层">
                        { this.floors() }
                      </Select>
                      )}
                  </td>
                  <td><span className={Style.red}>*</span>户号</td>
                  <td>
                    {getFieldDecorator('code', {
                      })(<Input style={{width:'90%'}}  placeholder="请输入户号" />)}&ensp;室
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>物业费率</td>
                  <td>
                    <span>
                        <Input style={{width:'75%'}}  onChange={this.inputChange.bind(this, 'propertyRate')}/>&ensp;元/㎡*月
                    </span>
                  </td>
                  <td>物业费</td>
                  <td>
                    {
                      mul(this.state.square, this.state.propertyRate) ? mul(this.state.square, this.state.propertyRate) : 0
                    }元/月
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
    zxhsInfo: state.houseManagement.zxhsInfo,
    unitInfo: state.houseManagement.unitInfo,
    gardenRight: state.houseManagement.gardenRight,
    communityRight: state.houseManagement.communityRight,
  }
}
function dispatchToProps(dispatch) {
  return {
    addRoom(payload = {}) {
      dispatch({
        type: 'houseManagement/addRoom',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
