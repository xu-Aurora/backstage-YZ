import React, { Component } from 'react';
import {Button,Row,Col,Form,Checkbox,Icon } from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import areaAddress from '../../../util/selectBank';   //省市区数据
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provinceData: [], //省
      cityData: [],//市
      areaData: [],//区,
      provinceIndex: undefined
    }
  }
  componentWillMount() {
    console.log(this.props)
    let provinceCodeList = this.props.provinceCodeList
    let cityCodeList = this.props.cityCodeList
    if(cityCodeList.length){
      const provinceData = areaAddress.map((item) => { //省
        return {areaCode: item.code, areaName: item.p, checked: false, bgStatus: false};
      });
      provinceCodeList.forEach(data=>{
        data.forEach(item=>{ // 选中的areaCode
          provinceData.forEach(params=>{
            if(item == params.areaCode) {
              params.checked = true
              params.disable = true
            }
          })
        })
      })

      const cityData = areaAddress.map((item) => {  //市
        return item.c.map(data=>{
          return {areaCode: data.code, areaName: data.n, checked: false}
        })
      });
      cityCodeList.forEach(data=>{
        data.forEach(item=>{ // 选中的areaCode
          cityData.forEach(params=>{
            params.forEach(list=>{
              if(item == list.areaCode) {
                list.checked = true
                list.disable = true
              }
            })
          })
        })
      })
      if(this.props.editStatus){
        provinceCodeList[this.props.editIndex].forEach(element => {
          provinceData.forEach(params=>{
              if(element == params.areaCode) {
                params.disable = false              
              }
          })
        });
        cityCodeList[this.props.editIndex].forEach(element => {
          cityData.forEach(params=>{
            params.forEach(list=>{
              if(element == list.areaCode) {
                list.disable = false              
              }
            })
          })
        });
      }
      this.setState({
        cityData,
        provinceData
      });
    } else {
       //一进入页面把省市区的数据push到空数组里面
      const provinceData = areaAddress.map((item) => { //省
        return {areaCode: item.code, areaName: item.p, checked: false, bgStatus: false, disable: false};
      });
      const cityData = areaAddress.map((item) => {  //市
        return item.c.map(data=>{
          return {areaCode: data.code, areaName: data.n, checked: false, disable: false}
        })
      });
      this.setState({
        cityData,
        provinceData
      });
    }
    
  }
  privateApply() {
    let chilrden = this.state.provinceData.map((item, i) => (
      <li  className={item.bgStatus ? Style.bgColor: ''} key={item.areaCode}>
        <Checkbox checked={item.checked} onChange={this.privateChange.bind(this, i)} disabled={item.disable}/>
        <span className={Style.lable} style={{width: 'calc(100% - 16px)'}} onClick={this.privateClick.bind(this, i)}>
            {item.areaName}
          <Icon type="right" className={Style.icon}/>
        </span>
      </li>
    ))
    return chilrden
  }
  privateClick(index,ev) {
    let list = []
    this.state.provinceData.forEach(item=>{
      list.push(Object.assign({},item))
    })
    list.forEach((data, i)=>{
      if(i == index) {
        data.bgStatus = true
      } else {
        data.bgStatus = false
      }
    })
    this.setState({
      provinceData: list,
      provinceIndex: index
    })
  }
  privateChange(index) {
    let provincelist = []
    this.state.provinceData.forEach(item=>{
      provincelist.push(Object.assign({},item))
    })
    let citylist = []
    this.state.cityData.forEach(item=>{
      citylist.push(item)
    })

    provincelist.forEach((data, i)=>{
      if(i == index) {
        data.checked = !data.checked
        if(data.checked) {
          citylist[i].forEach(item=>{
            if(!item.disable) {
              item.checked = true
            }
          })
        } else {
          citylist[i].forEach(item=>{
            if(!item.disable) {
              item.checked = false
            }
          })
        }
      }
    })
    this.setState({
      provinceData: provincelist,
      cityData: citylist
    })
  }

  cityApply() {
    let chilrden = []
    if(this.state.provinceIndex != undefined) {
      chilrden = this.state.cityData[this.state.provinceIndex].map((item, i) =>
        (
          <li  className={item.bgStatus ? Style.bgColor: ''} key={item.areaCode}>
            <Checkbox checked={item.checked}  onChange={this.cityChange.bind(this, i)} disabled={item.disable} />
            <span className={Style.lable} style={{width: 'calc(100% - 16px)'}}>
                {item.areaName}
            </span>
          </li>
        )
      )
    }
    return chilrden
  }
  cityChange(index) {
    let provincelist = []
    this.state.provinceData.forEach(item=>{
      provincelist.push(Object.assign({},item))
    })
    let citylist = []
    this.state.cityData.forEach(item=>{
      citylist.push(item)
    })

    citylist[this.state.provinceIndex].forEach((data, i)=>{
      if(i == index) {
        data.checked = !data.checked
      }
    })
    let status = citylist[this.state.provinceIndex].some((data)=>{
      return data.checked == false
    }) //如果有等于false的取消省的选择
    if(status) {
      if(!provincelist[this.state.provinceIndex].disable){
        provincelist[this.state.provinceIndex].checked = false
      }
    } else {
      if(!provincelist[this.state.provinceIndex].disable){
        provincelist[this.state.provinceIndex].checked = true
      }
    }
   
    this.setState({
      provinceData: provincelist,
      cityData: citylist
    })
  }

  selectedApply(){
    let chilrden = []
    this.state.provinceData.forEach((item, i) => {
        let array = this.state.cityData[i].filter(data=>{
          if(!data.disable) {
            return data.checked == true
          }
        })
        if(array.length) {
          if(array.length == this.state.cityData[i].length) {
            chilrden.push(
              <div className={Style.content} key={Math.random}>
                <div className={Style.chunk}>
                  <div>{item.areaName}</div>
                  <div className={Style.chunk__list}>
                    <div>全部</div>
                  </div>
                </div>
              </div>
            )
          } else {
            chilrden.push(
              <div className={Style.content} key={Math.random}>
                <div className={Style.chunk}>
                  <div>{item.areaName}</div>
                  <div className={Style.chunk__list}>
                    {array.map(params => (
                             <div>{params.areaName}</div>
                            ))}
                  </div>
                </div>
              </div>
            )
          }
        }
       
      }
    )
    return chilrden
  }
  allChange(e) {
    let provincelist = []
    this.state.provinceData.forEach(item=>{
      provincelist.push(Object.assign({},item))
    })
    let citylist = []
    this.state.cityData.forEach(item=>{
      citylist.push(item)
    })

    provincelist.forEach((data, i)=>{
      if(!data.disable) {
        data.checked = e.target.checked
      }
    })
    citylist.forEach((data, i)=>{
      data.forEach(item=>{
        if(!item.disable){
          item.checked = e.target.checked
        }
      })
    })
    this.setState({
      provinceData: provincelist,
      cityData: citylist
    })
  }
  save() {
    let provinceCode = []
    let provinceName = []
    this.state.provinceData.forEach(item=>{
        if(item.checked && !item.disable) {
          provinceCode.push(item.areaCode)
          provinceName.push(item.areaName)
        }
    })
    let cityCode = []
    let cityName = []
    let test=[]
    this.state.cityData.forEach((item, i)=>{
      let array = []
      item.forEach(data=>{
        if(data.checked && !data.disable) {
          array.push(data.areaName)
          cityCode.push(data.areaCode)
          cityName.push(data.areaName)
        }
      })
      if(array.length) {
        test.push({[`${this.state.provinceData[i].areaName}-${this.state.cityData[i].length}`]: array})
      }
    })
    let provinceCodeList = this.props.provinceCodeList
    let cityCodeList = this.props.cityCodeList
    let allNameList = this.props.allNameList
    if(this.props.editStatus){
      if(cityCode.length) {
        provinceCodeList[this.props.editIndex] = provinceCode
        cityCodeList[this.props.editIndex] = cityCode
        allNameList[this.props.editIndex] = test
      }
    } else {
      if(cityCode.length) {
        provinceCodeList.push(provinceCode)
        cityCodeList.push(cityCode)
        allNameList.push(test)
      }
    }
    this.props.setList({
      provinceCodeList,
      cityCodeList,
      allNameList
    })
    this.props.closeArea()
  }
  onClose() {
    this.props.closeArea()
  }
  render() {
    return (
      <div className={Style.areaBox}>
        <div className={Style.header}>
            <Button type="primary" style={{marginRight: 10}} onClick={this.save.bind(this)}>确定</Button>
            <Button onClick={this.onClose.bind(this)}>取消</Button>
        </div>
        <div className={Style.content}>
            <Row gutter={24}>
                <Col span={7}>
                    <ul className={Style.list}>
                      <li><Checkbox  onChange={this.allChange.bind(this)}>全部</Checkbox></li>
                      {this.privateApply()}
                      {/* {this.state.provinceData ? this.state.provinceData.map(item => (
                            <li>
                               <li><Checkbox >{item.areaName}</Checkbox><Icon type="right" className={Style.icon}/></li>
                            </li>
                          )) : ( <Option value={' '}>暂无数据</Option> )} */}
                      {/* <li><Checkbox>全部</Checkbox><Icon type="right" className={Style.icon}/></li> */}
                    </ul>
                  
                </Col>
                <Col span={7}>
                  <div className={Style.list}>
                      {this.cityApply()}
                  </div>
                </Col>
                <Col span={3}></Col>
                <Col span={7}>
                  <div className={Style.list}>
                    <div className={Style.header}>已选城市</div>
                    {this.selectedApply()}
                  </div>
                </Col>
            </Row>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    provinceCodeList: state.area.provinceCodeList,
    cityCodeList: state.area.cityCodeList,
    allNameList: state.area.allNameList,
    editStatus: state.area.editStatus,
    editIndex: state.area.editIndex
  }
}

function dispatchToProps(dispatch) {
  return {
    setList(payload = {}) {
      dispatch({type: 'area/setList', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
