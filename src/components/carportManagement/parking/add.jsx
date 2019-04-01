import React, {Component} from 'react';
import {Input,Select,Button,Row,Tabs,Form,message,Col} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      carNumberData: [{plateNumber: '',name: '',phone: '',carType: ''}],
      name: '',
      status: '1',
      carData:[{
        card: '',
        owner: '',
        ownerPhone:'',
        type: ''
      }],
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
      let provinceData = self.props.communityRight.areaInfo.split('-')[0]
      let province = JSON.parse(provinceData).areaName
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              //点小区
              let gardenNo = `${province}-${self.props.communityRight.area}-${self.props.communityRight.name}`
              
              //点苑
              let garden = `${province}-${self.props.communityRight.area}-${self.props.communityRight.name}-${self.props.gardenRight.name}`
      
              self.props.addParking({
                params: { 
                  userId: userData.id,
                  code: values.code,
                  type: values.type,
                  status: self.state.status,
                  acreage: values.acreage,
                  fee:  values.fee,
                  name: self.props.gardenRight ? (self.state.zxhsVal ? `${garden}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`: garden) : (self.state.zxhsVal ? `${gardenNo}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`:gardenNo),
                  comId: self.props.communityRight.id,
                  comName: self.props.communityRight.name,
                  comCourtId: self.props.gardenRight ? self.props.gardenRight.id : '',
                  comCourtName: self.props.gardenRight ? self.props.gardenRight.name : '',
                  addressId: self.state.zxhsVal ? `${self.state.zxhsVal.key}-${self.state.unitVal.key}-${self.state.houseVal.key}`:'',
                  addressName: self.state.zxhsVal ? `${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`: '',
                  carsJson: self.state.carData[0].card ? JSON.stringify(self.state.carData) : undefined, 
                  roomId: self.state.houseVal ? self.state.houseVal.key: '',
                  roomName: self.state.houseVal ? self.state.houseVal.label: '',
                  ownerPhone: values.ownerPhone,
                  ownerName: values.ownerName
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
    let self = this
    message.destroy();
    if(!item.code){
      message.warning('车位编号不能为空');
      return false
    }
    if(!item.type){
      message.warning('车位类型不能为空');
      return false
    }
    if(item.acreage){
      let re = /^\d+(\.\d{1,2})?$/
      if(!re.test(item.acreage)) {
        message.warning('车位面积仅限输入正数字（小数点后2位）');
        return false 
      }       
    }
    if(!item.fee){
      message.warning('管理费用不能为空');
      return false
    } else {
      let re = /^\d+(\.\d{1,3})?$/
      if(!re.test(item.fee)) {
        message.warning('管理费用仅限输入正数字（小数点后3位）');
        return false        
      }
    }
    if(item.ownerPhone) {
      let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
      if(!regPhone.test(item.ownerPhone)) {
        message.warning('所有者电话格式不正确');
        return false 
      }    
    }
    if(self.state.zxhsVal){
      if(!self.state.unitVal){
        message.warning('请选择单元');
        return false
      } else {
        if(!self.state.houseVal){
          message.warning('请选择户');
          return false
        }
      }
    }
    return true;
  }

  loop (data) {
    let self = this
    let children = []
    data.forEach(function(item, index){
        children.push(
          <tr key={index + 1}>
          <td>
            <span>
                <Input placeholder="请输入车牌号" value={item.card} onChange={self.inputChange.bind(self, 'card', index)}/>
            </span>
          </td>
          <td>
            <span>
              <Input placeholder="请输入车主姓名" value={item.owner} onChange={self.inputChange.bind(self, 'owner', index)}/>
            </span>
          </td>
          <td>
              <span>
                <Input placeholder="请输入车主电话" value={item.ownerPhone} onChange={self.inputChange.bind(self, 'ownerPhone', index)}/>
              </span>
          </td>
          <td>
              <span>
                  <Select placeholder="请选择" value={item.type} onChange={self.selectChange.bind(self, 'type', index)}>
                    <Option value="1">两厢轿车</Option>
                    <Option value="2">三厢轿车</Option>
                    <Option value="3">SUV</Option>
                    <Option value="4">跑车</Option>
                    <Option value="5">面包车</Option>
                    <Option value="6">卡车</Option>
                  </Select>
              </span>
          </td>
          <td>
            <Button onClick={self.delete.bind(self, index)}>删除</Button>
          </td>
      </tr>
            )
    })
    return children
  }
  inputChange (item, index, ev) {
      let list = this.state.carData
      list[index][item] = ev.target.value
      console.log(index);
      this.setState({
        carData: list
      })
  }
  selectChange (item, index, val) {
    let list = this.state.carData
    list[index][item] = val
    this.setState({
      carData: list
    })
  }
  addCar() {
    let data = {
      card: '',
      owner: '',
      ownerPhone: '',
      type: ''
    }
    let list = this.state.carData
    list.push(data)
    this.setState({
      carData: list
    })
  }
  delete(index) {
    let list = []
    this.state.carData.forEach((data)=>{
      list.push(Object.assign({},data))
    })
    if(list.length == 1) {
      list.forEach((i)=>{
        i.card = ''
        i.owner = ''
        i.ownerPhone = ''
        i.type = ''
      })
      this.setState({
        carData: list
      })
    } else {
      list.splice(index, 1)
      this.setState({
        carData: list
      })
    }
  }
  tabChange (item) {
    this.setState({
      status: item
    })
  }
  zxhsChange(lable) {
    if(lable) {
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
    } else {
      this.setState({
        zxhsVal: undefined,
        unitVal: undefined,
        houseVal: undefined
      })
    }
  }
  unitChange(lable) {
    if (lable) {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.setState({
        unitVal: lable,
        houseVal: undefined
      })
      //  查询户
      this.props.getHose({params:{userId: userData.id, addressId: lable.key}})
    } else {
      this.setState({
        unitVal: undefined,
        houseVal: undefined
      })
    }
   
  }
  houseChange(lable) {
    if(lable) {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.setState({
        houseVal: lable
      })
    } else{
      this.setState({
        houseVal: undefined
      })
    }
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
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>车位编号</td>
                  <td>
                    <span>{getFieldDecorator('code', {
                      })(<Input placeholder="请输入车位编号" />)}</span>
                  </td>
                  <td  style={{width:'15%'}}><span className={Style.red}>*</span>车位类型</td>
                  <td>
                    {getFieldDecorator('type', {})(
                      <Select placeholder="请选择">
                        <Option value="1">正常</Option>
                        <Option value="2">人防</Option>
                        <Option value="3">子母</Option>
                      </Select>
                      )}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>车位状态</td>
                  <td style={{textAlign:'status',paddingLeft:10}}>
                      <Tabs defaultActiveKey="1" onTabClick={this.tabChange.bind(this)}>
                        <TabPane tab="自用" key="1"></TabPane>
                        <TabPane tab="出租" key="2"></TabPane>
                        <TabPane tab="空置" key="3"></TabPane>
                      </Tabs>
                  </td>
                  <td>车位面积</td>
                  <td>
                    <span>
                      {getFieldDecorator('acreage', {})(<Input placeholder="请输入车位面积" />)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>管理费用</td>
                  <td>
                     <span>{getFieldDecorator('fee', {
                      })(<Input style={{width:'87%'}} placeholder="请输入车位管理费用" />)}</span>元/月
                  </td>
                  <td>所在小区</td>
                  <td>
                   {this.state.name}
                  </td>
                </tr>
                <tr>
                  <td>所有者姓名</td>
                  <td>
                     <span>{getFieldDecorator('ownerName', {
                      })(<Input style={{width:'100%'}} placeholder="请输入所有者姓名" />)}</span>
                  </td>
                  <td>所有者电话</td>
                  <td>
                    <span>{getFieldDecorator('ownerPhone', {
                      })(<Input style={{width:'100%'}} placeholder="请输入所有者电话" />)}</span>
                  </td>
                </tr>
                <tr>
                  <td>关联房屋</td>
                  <td colSpan={3}>
                    <Col span={5} style={{marginRight:10}}>
                        <Select value={this.state.zxhsVal} onChange={this.zxhsChange.bind(this)} placeholder="幢" labelInValue allowClear>
                          {this.props.zxhsData ? this.props.zxhsData.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5}  style={{marginRight:10}}>
                        <Select value={this.state.unitVal} onChange={this.unitChange.bind(this)}  placeholder="单元" labelInValue allowClear>
                            {this.props.unitData ? this.props.unitData.map(item => (
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Select value={this.state.houseVal} onChange={this.houseChange.bind(this)} placeholder="户" labelInValue allowClear>
                            {this.props.hoseData ? this.props.hoseData.map(item => (
                              <Option value={item.id} key={item.id}>{item.code}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                  </td>
                </tr>
                <tr>
                  <td>绑定车牌号</td>
                  <td colSpan={3}>
                      <table cellSpacing="0" className={Style.mytable} style={{margin: 0}}>
                        <tbody>
                            <tr>
                                <td>车牌号</td>
                                <td>车主姓名</td>
                                <td>联系电话</td>
                                <td>车辆类型</td>
                                <td>操作</td>
                            </tr>
                            {this.loop(this.state.carData)}
                        </tbody>
                      </table>
                      <div onClick={this.addCar.bind(this)}>+新增</div>
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
    communityRight: state.carportManagement.communityRight,
    gardenRight: state.carportManagement.gardenRight,
    zxhsData: state.carportManagement.zxhsData,
    unitData: state.carportManagement.unitData,
    hoseData: state.carportManagement.hoseData,
  }
}
function dispatchToProps(dispatch) {
  return {
    getZxhs(payload= {}) {
      dispatch({type: 'carportManagement/getZxhs', payload })
    },
    getUnit(payload = {}) {
      dispatch({
        type: 'carportManagement/getUnit',
        payload
      })
    },
    getHose(payload = {}) {
      dispatch({
        type: 'carportManagement/getHose',
        payload
      })
    },
    addParking(payload = {}) {
      dispatch({
        type: 'carportManagement/addParking',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
