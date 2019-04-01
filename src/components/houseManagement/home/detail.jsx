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
    let name
    // console.log(this.props.houseDetail)

    if(this.props.houseDetail.comCourtName) { 
      name = `${this.props.houseDetail.comName}-${this.props.houseDetail.comCourtName}-${this.props.houseDetail.name}`
    } else {
      name = `${this.props.houseDetail.comName}-${this.props.houseDetail.name}`
    }
    name = name.replace(/\-无单元/,'')

    let type = {
        key: `${this.props.houseDetail.typeCode}`,
        label: this.props.houseDetail.typeCodeName,
    }

    this.setState({
        type,
        name,
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
        self.props.addRoom({
          params: {
            userId: userData.id,            
            name: `${this.props.zxhsInfo.name}-${this.props.unitInfo.name}-${values.code}`,
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
            code: values.code,
            propertyRate: this.state.propertyRate
          },
          func: function(){
            message.success('操作成功!', 1.5, function() {self.props.search('addNo')});
          }
        })
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
    }
    if(!item.floor) {
      message.warning('请选择楼层');
      return false
    }
    if(!item.code) {
      message.warning('户号不能为空');
      return false
    }
    if(!self.state.propertyRate){
      message.warning('物业费率不能为空');
      return false
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
            <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
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
                      <Select placeholder="请选择" value={this.state.type} onChange={this.selectChange.bind(this)} labelInValue disabled>
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
                        <Input style={{width:'90%'}} value={this.state.square}  onChange={this.inputChange.bind(this, 'square')} disabled/>㎡
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>楼层</td>
                  <td>
                    {getFieldDecorator('floor', {initialValue: houseDetail.floor})(
                      <Select placeholder="请选择楼层" disabled>
                        { this.floors() }
                      </Select>
                      )}
                  </td>
                  <td><span className={Style.red}>*</span>户号</td>
                  <td>
                    {getFieldDecorator('code', {
                        initialValue: houseDetail.code ?   houseDetail.code.replace('室', '') : ""
                      })(<Input style={{width:'90%'}}  placeholder="请输入户号" disabled/>)}室
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>物业费率</td>
                  <td>
                    <span>
                        <Input style={{width:'75%'}} value={ mul(this.state.propertyRate,1) }   onChange={this.inputChange.bind(this, 'propertyRate')} disabled/>元/㎡*月
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
    houseDetail: state.houseManagement.houseDetail
  }
}
function dispatchToProps(dispatch) {
  return {
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
