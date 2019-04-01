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
      status: '',
      carData:[{
        card: '',
        owner: '',
        ownerPhone:'',
        type: ''
      }],
      house: '',
      deleteCradIds: []
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.detailParking({
        params:{userId: userData.id, id: self.props.info.id},
        func:function() {
          if (self.props.parkingInfo) {
            self.setState({
                house: self.props.parkingInfo.name,
                status:  self.props.parkingInfo.status,
            })
            if(self.props.parkingInfo.cars.length) {
                let list = []
                self.props.parkingInfo.cars.forEach((item)=>{
                  list.push(Object.assign({},{card: item.card, owner: item.owner, ownerPhone: item.ownerPhone, type: item.type, id: item.id}))
                })
                self.setState({
                    carData: list
                })
            }
          }
          self.props.getZxhs({
              params: {userId: userData.id, comId : self.props.parkingInfo.comId, comCourtId: self.props.parkingInfo.comCourtId},
              func: function(){
                if(self.props.parkingInfo.addressId) {
                  let addressId = self.props.parkingInfo.addressId.split('-')
                  let addressName = self.props.parkingInfo.addressName.split('-')
                  let zxhsVal = {
                    lable: addressId[0],
                    key: addressName[0]
                  }
                 
                  self.setState({
                    zxhsVal
                  })
                  self.props.getUnit({
                    params:{userId: userData.id,type: 2, parentId: addressId[0]},
                    func: function() {
                      let addressId = self.props.parkingInfo.addressId.split('-')
                      let addressName = self.props.parkingInfo.addressName.split('-')
                      let unitVal = {
                        lable: addressId[1],
                        key: addressName[1]
                      }
                      self.setState({
                        unitVal
                      })

                      self.props.getHose({
                        params:{userId: userData.id, addressId: addressId[1]},
                        func: function() {
                          let addressId = self.props.parkingInfo.addressId.split('-')
                          let addressName = self.props.parkingInfo.addressName.split('-')
                          let houseVal = {
                            lable: addressId[2],
                            key: addressName[2]
                          }
                          self.setState({
                            houseVal
                          })
                        }
                      })
                    }
                  }) 
                }
              }
          }); 

         
        }
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
              let name,addressId,addressName,roomId,roomName
              if(self.state.houseVal) {
                let provinceData = self.props.parkingInfo.name.split('-')
                if(provinceData.length == 6) {
                  name = `${provinceData[0]}-${provinceData[1]}-${provinceData[2]}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
                } else {
                  name = `${provinceData[0]}-${provinceData[1]}-${provinceData[2]}-${provinceData[3]}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
                }
                addressId = `${self.state.zxhsVal.key}-${self.state.unitVal.key}-${self.state.houseVal.key}`
                addressName = `${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
                roomId = self.state.houseVal.key
                roomName = self.state.houseVal.label
              } else {
                name = self.props.parkingInfo.name
                addressId = self.props.parkingInfo.addressId
                addressName = self.props.parkingInfo.addressName
                roomId = self.props.parkingInfo.roomId
                roomName = self.props.parkingInfo.roomName
              }
              self.props.updateParking({
                params: {
                  deleteCradIds: self.state.deleteCradIds ? self.state.deleteCradIds.join() : '',
                  id:  self.props.parkingInfo.id,
                  userId: userData.id,
                  code: values.code,
                  type: values.type,
                  ownerName: values.ownerName,
                  ownerPhone: values.ownerPhone,
                  status: self.state.status,
                  acreage: values.acreage,
                  fee:  values.fee,
                  name: name,
                  comId: self.props.parkingInfo.comId,
                  comName: self.props.parkingInfo.comName,
                  comCourtId: self.props.parkingInfo.comCourtId,
                  comCourtName: self.props.parkingInfo.comCourtName,
                  addressId: addressId,
                  addressName: addressName,
                  carsJson: self.state.carData[0].card ? JSON.stringify(self.state.carData) : undefined, 
                  roomId: roomId,
                  roomName: roomName
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
            <Button onClick={self.delete.bind(self, index, item)}>删除</Button>
          </td>
      </tr>
            )
    })
    return children
  }
  inputChange (item, index, ev) {
      let list = this.state.carData
      list[index][item] = ev.target.value
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
  delete(index,item) {
    let list = []
    let ids = this.state.deleteCradIds
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
    ids.push(item.id)
    this.setState({
      deleteCradIds: ids
    })
  }
  tabChange (item) {
    this.setState({
      status: item
    })
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
    this.props.getHose({params:{userId: userData.id, addressId: lable.key}})
  }
  houseChange(lable) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      houseVal: lable
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { parkingInfo} = this.props;
    const content = parkingInfo || {};
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
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>车位编号</td>
                  <td>
                    <span>{getFieldDecorator('code', {
                        initialValue: content.code
                      })(<Input placeholder="请输入车位编号" />)}</span>
                  </td>
                  <td  style={{width:'15%'}}><span className={Style.red}>*</span>车位类型</td>
                  <td>
                    {getFieldDecorator('type', {initialValue: content.type})(
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
                  <td style={{paddingLeft:10}}>
                      <Tabs activeKey={this.state.status} onTabClick={this.tabChange.bind(this)}>
                        <TabPane tab="自用" key="1"></TabPane>
                        <TabPane tab="出租" key="2"></TabPane>
                        <TabPane tab="空置" key="3"></TabPane>
                      </Tabs>
                  </td>
                  <td>车位面积</td>
                  <td>
                    <span>
                      {getFieldDecorator('acreage', {initialValue: content.acreage})(<Input placeholder="请输入车位面积" />)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>管理费用</td>
                  <td>
                     <span>{getFieldDecorator('fee', {
                         initialValue: content.fee
                      })(<Input style={{width:'87%'}} placeholder="请输入车位管理费用" />)}</span>元/月
                  </td>
                  <td>所在小区</td>
                  <td>
                   {content.comGarden}
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
                        <Select value={this.state.zxhsVal} onChange={this.zxhsChange.bind(this)} placeholder="幢" labelInValue>
                          {this.props.zxhsData ? this.props.zxhsData.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5} style={{marginRight:10}}>
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
    info: state.carportManagement.info,
    parkingInfo: state.carportManagement.parkingInfo,
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
    detailParking(payload = {}) {
        dispatch({
            type: 'carportManagement/detailParking',
            payload
        })
    },
    updateParking(payload = {}) {
      dispatch({
          type: 'carportManagement/updateParking',
          payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
