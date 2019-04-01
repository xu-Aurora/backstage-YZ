import React, { Component } from 'react';
import {Button,Row,Form,TimePicker,Input,Select, message,Icon,Col } from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import Style from './style.less';
import { Map,Marker } from 'react-amap';//地图
import debounce from 'lodash/debounce';//antd select
import areaAddress from '../../../util/selectBank';   //省市区数据

const Option = Select.Option;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_869860_8ie8gwt5bj9.js',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      data: [],
      value: [],
      fetching: false,
      position: { //默认坐标
        longitude: 120.178883,
        latitude: 30.273886
      },
      positions: {
        longitude: '',
        latitude: ''
      },
      display: 'none',
      provinceData: [], //省
      cityData: [],//市
      areaData: [],//区
      qval: '选择省',
      cval: '选择市',
      aval: '选择区',
      areaCode: '',
      cityName: '',
      proName: '',
      proCode: '',
      startTime:'',
      endTime:'',
      open: false,
      open1: false,
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  //地图
  showCenter(){
    this.setState({
      center: `${this.mapInstance.getCenter()}`
    });
  }
  mapEvents = () => {
    let self = this;
    return {
      created: (map) => { 
        this.mapInstance = map;
        this.showCenter();
      },
      moveend: () => { this.showCenter() },
      click: (a) => { //获取点击的坐标
        let position =  {
          longitude: a.lnglat.lng,
          latitude: a.lnglat.lat
        }
        let positions =  {
          longitude: a.lnglat.lng,
          latitude: a.lnglat.lat
        }
        return self.setState({
          position,
          positions
        })
      }
    }
  }


  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  }

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryInstCode({ //所属机构
      userId: userData.id,
      instCode: userData.instCode
    });
    //一进入页面把省市区的数据push到空数组里面
    const provinceData = areaAddress.map((item) => { //省
      return {areaCode: item.code, areaName: item.p};
    });
    const cityData = areaAddress[0].c.map((item) => {  //市
        return {areaCode: item.code, areaName: item.n}
    });
    const areaData = areaAddress[0].c[0].a.map((item) => { //区
      return {areaCode: item.code, areaName: item.n};
    });
    this.setState({
      provinceData
    });
  }
  //省市操作
  provinceChange(lable) {
    let provinceData = JSON.parse(lable)
    let dataContent = areaAddress;
    let cityData
    dataContent.forEach((item)=>{
      if(provinceData.areaCode == item.code) {
        cityData = item.c.map((item) => {
          return {areaCode: item.code, id: item.code, areaName: item.n} //市
      })
      }
    })
    this.setState({
      proName: provinceData.areaName,
      proCode: provinceData.areaCode,
      qval: lable,
      cval: '选择市',
      aval: '选择区',
      cityData
    })
  }
  cityChange (lable) {
    let cityData = JSON.parse(lable)
    let dataContent = areaAddress;
    let areaData
    dataContent.forEach((item)=>{
      item.c.forEach((i)=>{
        if(cityData.areaCode == i.code) {
          areaData = i.a.map((item) => {
            return {areaCode: item.code, id: item.code, areaName: item.n} //市
          })
        }
      })
    })
    this.setState({
      cval: lable,
      cityName: cityData.areaName,
      cityCode: cityData.areaCode,
      areaData,
      aval: '选择区'
    })
  }
  areaChange (lable) {
    let areaData = JSON.parse(lable)
    this.setState({
      aval: lable,
      area: areaData.areaName,
      areaCode : areaData.areaCode,
      countyName: areaData.areaName,
      countyCode: areaData.areaCode,
    })
  }

  timeRange(type,a,time){
    if(type == 'x1') {
      this.setState({
        startTime: time
      })
    }
    if(type == 'x2') {
      this.setState({
        endTime: time
      })
    }
  }
  cancel(){
    this.props.closeAdd()
  }

  add = () => {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      let rex = this.rex(values);
        if (rex) {
          if(this.state.requestStatus){
            if (values.instData) {
              values.instCode = values.instData.split(',')[0]
              values.instId = values.instData.split(',')[1]
              values.instName = values.instData.split(',')[2]
            }
              self.setState({requestStatus: false},() => {
                self.props.add({
                  params: {
                    ...values,
                    status: '1',
                    userId: userData.id,
                    institutionsCode: values.instCode,
                    institutionsId: values.instId,
                    institutionsName: values.instName,
                    provinceCode: self.state.proCode,
                    provinceName: self.state.proName,
                    cityName: self.state.cityName,
                    cityCode: self.state.cityCode,
                    countyCode: self.state.countyCode,
                    countyName: self.state.countyName,
                    serverTime: `${self.state.startTime}-${self.state.endTime}`,
                    longitude: self.state.position.longitude,
                    latitude: self.state.position.latitude
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
    //手机号码正则
    let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    message.destroy();
    if(!item.name){
      message.warning('自提点名称不能为空');
      return false
    }
    if(!this.state.proName) {
      message.warning('请选择省');
      return false
    }
    if(!this.state.cityName) {
      message.warning('请选择市');
      return false
    }
    if(!this.state.area) {
      message.warning('请选择区');
      return false
    }
    if(!item.address) {
      message.warning('详细地址不能为空');
      return false
    }
    if(!this.state.position.longitude || !this.state.position.latitude) {
      message.warning('自提点坐标不能为空');
      return false
    }
    if(!item.instData) {
      message.warning('所属机构不能为空');
      return false
    }
    if(!item.principal) {
      message.warning('负责人不能为空');
      return false
    }
    if(!item.principalPhone) {
      message.warning('负责人电话不能为空');
      return false
    }
    if(!regPhone.test(item.principalPhone)) {
      message.warning('负责人电话格式不正确');
      return false
    }
    if(!item.phone) {
      message.warning('自提点电话不能为空');
      return false
    }
    if(!regPhone.test(item.phone)) {
      message.warning('自提点电话格式不正确');
      return false
    }
    if(!this.state.startTime || !this.state.endTime) {
      message.warning('服务时间不能为空');
      return false
    }
    let time1H = this.state.startTime.split(':')[0];
    let time1M = this.state.startTime.split(':')[1];
    let time2H = this.state.endTime.split(':')[0];
    let time2M = this.state.endTime.split(':')[1];
    if(time1H > time2H) {
        message.warning('服务时间起始时间不能大于结束时间');
        return false
    }else if(time1H == time2H){
      if(time1M>time2M){
        message.warning('服务时间起始时间不能大于结束时间');
        return false
      }
      message.warning('服务时间起始时间不能等于结束时间');
      return false
    }

    return true;
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.add}>确定</Button> :
                <Button type="primary">确定</Button>
              }
              
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>自提点名称</td>
                    <td colSpan="3">
                        {getFieldDecorator('name')(
                          <Input maxLength={20} placeholder="请输入自提点名称" />
                        )} 
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>自提点地址</td>
                    <td colSpan="3">
                      <Col span={4} style={{marginRight:10}}>
                          <Select value={this.state.qval} onChange={this.provinceChange.bind(this)}>
                            {this.state.provinceData ? this.state.provinceData.map(item => (
                              <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                          </Select>
                      </Col>
                      <Col span={4}  style={{marginRight:10}}>
                          <Select value={this.state.cval} onChange={this.cityChange.bind(this)}>
                              {this.state.cityData ? this.state.cityData.map(item => (
                                <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                              )) : ( <Option value={' '}>暂无数据</Option> )}
                          </Select>
                      </Col>
                      <Col span={4} style={{marginRight:10}}>
                          <Select value={this.state.aval} onChange={this.areaChange.bind(this)}>
                              {this.state.areaData ? this.state.areaData.map(item => (
                                <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                              )) : ( <Option value={' '}>暂无数据</Option> )}
                          </Select>
                      </Col>
                      <Col span={10}>
                        {getFieldDecorator('address', {})(
                          <Input placeholder="请输入详细地址" maxLength={30}/>)}
                      </Col>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>自提点坐标</td>
                    <td colSpan="3">
                        <div>
                          <IconFont type="icon-zuobiao" style={{fontSize:22,marginRight: 8}} />
                          <span onClick={()=>this.setState({display: 'block'})} className={Style.isShow}>
                            { this.state.positions.longitude ? '当前选择的地址坐标在此' : '选择地图坐标' }
                          </span>
                          <span>
                              {`${ this.state.position.longitude }-${ this.state.position.latitude }`}
                          </span>
                        </div>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td colSpan="3">
                      {getFieldDecorator('instData')(
                        <Select 
                          maxLength={30}
                          showSearch
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          placeholder="请选择">
                          {this.props.instCodeData ? this.props.instCodeData.list.map(item => (
                                <Option value={`${item.code},${item.id},${item.name}`} key={item.id}>{item.name}</Option>
                              )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>负责人</td>
                    <td colSpan="3">
                        {getFieldDecorator('principal', {})(
                          <Input placeholder="请输入自提点负责人姓名" />
                        )} 
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>负责人电话</td>
                    <td colSpan="3">
                        {getFieldDecorator('principalPhone', {})(
                          <Input placeholder="请输入负责人电话" />
                        )} 
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>自提点电话</td>
                    <td colSpan="3">
                        {getFieldDecorator('phone')(
                          <Input placeholder="请输入自提点电话" />
                        )} 
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>服务时间</td>
                    <td colSpan="3">
                      <TimePicker 
                        open={this.state.open}
                        onOpenChange={ (open) => this.setState({ open }) }
                        onChange={this.timeRange.bind(this,'x1')}
                        addon={() => (
                          <Button size="small" type="primary" onClick={ () => this.setState({ open: false }) }>
                            Ok
                          </Button>
                        )}
                        format={'HH:mm'} />
                      <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                      <TimePicker 
                        open={this.state.open1}
                        onOpenChange={ (open) => this.setState({ open1: open }) }
                        onChange={this.timeRange.bind(this,'x2')}
                        addon={() => (
                          <Button size="small" type="primary" onClick={ () => this.setState({ open1: false }) }>
                            Ok
                          </Button>
                        )}
                        format={'HH:mm'} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </Form>
        </div>

        {/* 地图 */}
        <div className={Style.addMap} style={{display: this.state.display}}>
            <Map events={this.mapEvents()} center={this.state.position}>
              <div className={Style.controlBtn}>
                <Button type="primary" style={{width:65}} onClick={()=>this.setState({display: 'none'})}>取消</Button>
                <Button type="primary" style={{width:65}} onClick={()=>this.setState({display: 'none'})}>确定</Button>
              </div>
              <Marker position={this.state.position} />
            </Map>
        </div>


      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    instCodeData: state.adminManage.instCode  //所属机构数据
  }
}

function dispatchToProps(dispatch) {
  return {
    add(payload = {}) {
      dispatch({type: 'selfFetchSet/add', payload})
    },
    queryInstCode(payload = {}) {  //所属机构
      dispatch({
        type: 'adminManage/instCode',
        payload
      })
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
