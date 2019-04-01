import React, {Component} from 'react';
import {Input,Select,Button,Row,Cascader,Tabs,Form,message,Icon,Modal,Col} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
      value: 'hangzhou',
      label: 'Hangzhou',
      children: [{
        value: 'xihu',
        label: 'West Lake',
      }],
    }],
  }, 
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
      value: 'nanjing',
      label: 'Nanjing',
      children: [{
        value: 'zhonghuamen',
        label: 'Zhong Hua Men',
      }],
    }],
  }
];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      delvisibleShow: false
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.detailParking({
      params:{userId: userData.id, id: self.props.info.id}
    }) 
  }
  componentWillReceiveProps(nextProps) {
      if (nextProps.parkingInfo) {
        this.setState({
            house: nextProps.parkingInfo.name,
            status:  nextProps.parkingInfo.status,
        })
        if(nextProps.parkingInfo.cars.length) {
            this.setState({
                carData: nextProps.parkingInfo.cars
            })
        }
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
        //点小区
        let gardenNo = `${province}-${self.props.communityRight.area}-${self.props.communityRight.name}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
        //点苑
        let garden = `${province}-${self.props.communityRight.area}-${self.props.communityRight.name}-${self.props.gardenRight.name}-${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`
        self.props.addParking({
          params: { 
            userId: userData.id,
            code: values.code,
            type: values.type,
            status: self.state.status,
            acreage: values.acreage,
            fee:  values.fee,
            name: self.props.gardenRight ? garden : gardenNo,
            comId: self.props.communityRight.id,
            comName: self.props.communityRight.name,
            comCourtId: self.props.gardenRight ? self.props.gardenRight.id : '',
            comCourtName: self.props.gardenRight ? self.props.gardenRight.name : '',
            addressId: `${self.state.zxhsVal.key}-${self.state.unitVal.key}-${self.state.houseVal.key}`,
            addressName: `${self.state.zxhsVal.label}-${self.state.unitVal.label}-${self.state.houseVal.label}`,
            carsJson: self.state.carData[0].card ? JSON.stringify(self.state.carData) : undefined, 
            roomId: self.state.houseVal.key,
            roomName: self.state.houseVal.label
          },
          func: function(){
            // message.success('操作成功!', 1.5, function() {self.props.search('addVisible')});
          }
        })
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
    if(!item.acreage){
      message.warning('车位面积不能为空');
      return false
    }
    if(!item.fee){
      message.warning('管理费用不能为空');
      return false
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

  loop (data) {
    let self = this
    let children = []
    data.forEach(function(item, index){
        children.push(
          <tr key={index + 1}>
          <td>
            <span>
                <Input placeholder="请输入车牌号" value={item.card} onChange={self.inputChange.bind(self, 'card', index)} disabled/>
            </span>
          </td>
          <td>
            <span>
              <Input placeholder="请输入车主姓名" value={item.owner} onChange={self.inputChange.bind(self, 'owner', index)} disabled/>
            </span>
          </td>
          <td>
              <span>
                <Input placeholder="请输入车主电话" value={item.ownerPhone} onChange={self.inputChange.bind(self, 'ownerPhone', index)} disabled/>
              </span>
          </td>
          <td>
              <span>
                  <Select placeholder="请选择" value={item.type} onChange={self.selectChange.bind(self, 'type', index)} disabled>
                    <Option value="1">两厢轿车</Option>
                    <Option value="2">三厢轿车</Option>
                    <Option value="3">SUV</Option>
                    <Option value="4">跑车</Option>
                    <Option value="5">面包车</Option>
                    <Option value="6">卡车</Option>
                  </Select>
              </span>
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
    //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
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
    const params = self.props.parkingInfo;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      self.props.deleteParking({
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
            <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
            <Button type="primary" 
              style={{marginLeft: 10}}
              onClick={this.sure.bind(this, 'delvisibleShow')}>删除</Button>
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>车位编号</td>
                  <td>
                    <span>{getFieldDecorator('code', {
                          initialValue: content.code
                      })(<Input placeholder="请输入车位编号" disabled/>)}</span>
                  </td>
                  <td  style={{width:'15%'}}><span className={Style.red}>*</span>车位类型</td>
                  <td>
                    {getFieldDecorator('type', {initialValue: content.type})(
                      <Select placeholder="请选择" disabled>
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
                      <Tabs activeKey={this.state.status}>
                        <TabPane tab="自用" key="1"></TabPane>
                        <TabPane tab="出租" key="2"></TabPane>
                        <TabPane tab="空置" key="3"></TabPane>
                      </Tabs>
                  </td>
                  <td>车位面积</td>
                  <td>
                    <span>
                      {getFieldDecorator('acreage', {initialValue: content.acreage})(<Input placeholder="请输入车位面积" disabled/>)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>管理费用</td>
                  <td>
                     <span>{getFieldDecorator('fee', {
                         initialValue: content.fee
                      })(<Input style={{width:'87%'}} placeholder="请输入车位管理费用" disabled/>)}</span>元/月
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>所有者姓名</td>
                  <td>
                     <span>{getFieldDecorator('ownerName', {
                        initialValue: content.ownerName
                      })(<Input style={{width:'100%'}} placeholder="请输入所有者姓名" disabled/>)}</span>
                  </td>
                  <td>所有者电话</td>
                  <td>
                    <span>{getFieldDecorator('ownerPhone', {
                        initialValue: content.ownerPhone
                      })(<Input style={{width:'100%'}} placeholder="请输入所有者电话" disabled/>)}</span>
                  </td>
                </tr>
                <tr>
                  <td>所在小区</td>
                  <td>
                      <span>{content.comGarden}</span>
                  </td>
                  <td>关联房屋</td>
                  <td>
                      <span>{content.addressName}</span>
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
                            </tr>
                            {this.loop(this.state.carData)}
                        </tbody>
                      </table>
                  </td>
                </tr>
              </tbody>
            </table>
              
            </Form>
          </Row>
        </div>
          {/* 删除提示框 */}
          <Modal
            title="删除车位"
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
    deleteParking(payload = {}) {
      dispatch({
        type: 'carportManagement/deleteParking',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
