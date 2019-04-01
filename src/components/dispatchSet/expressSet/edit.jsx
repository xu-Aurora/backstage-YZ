import React, { Component } from 'react';
import {Button,Row,Form,Radio,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import { Math } from 'core-js';
import areaAddress from '../../../util/selectBank';   //省市区数据
import { arrayOfDeffered } from 'redux-saga/utils';

const RadioGroup = Radio.Group;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: true,
      requestStatus: true,
      buyerList: [ 
        {
          distributionAreaName: '所有区域默认（未勾选地区适用此费用）', // 
          distributionAreaCityCode: '0', 
          firstPrice: '', //首件
          firstPriceFreight: '', //运费
          continuation: '', //续件
          continuationFreight: '', //续费
          distributionAreaProvinceCode: ''
        }
      ], //买家
      type: '1',
      templateName: '',
      calculationMethod: '1',
      defaultStatus: '',
      initialize: true,
      allNameList: []
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    this.props.queryDetail({
      params: {
        userId: userData.id, 
        id: this.props.argument.id,
        instCode: userData.instCode
      },
      func: function(){
        let data = self.props.data
        self.setState({
          type: data.templateType,
          buyerList: data.freightTemplateAreas,
          templateName: data.templateName,
          calculationMethod:  data.calculationMethod,
          defaultStatus:  data.defaultStatus
        })
        let provinceCode
        let provinceCodeList = []

        let cityCode
        let cityCodeList = []

        let allName
        let allNameList = []
        data.freightTemplateAreas.forEach((item, index)=>{
          if(index) {
            provinceCode = item.distributionAreaProvinceCode.split(',')
            provinceCodeList.push(provinceCode)
            cityCode = item.distributionAreaCityCode.split(',')
            cityCodeList.push(cityCode)
            allName = item.distributionAreaNameDetails ? JSON.parse(item.distributionAreaNameDetails):''
            allNameList.push(allName)
          }   
        })
        self.props.setList({
          provinceCodeList,
          cityCodeList,
          allNameList,
          buyerList: data.freightTemplateAreas
        })
      }
    });
  }
  componentWillReceiveProps(nextProps){
      //编辑
      if(nextProps.editStatus) {
        console.log(nextProps)
        //重新组装数组 拼接配送区域的名称
        let array = []
        nextProps.allNameList.forEach(list=>{
          let arrayList = []
          list.forEach(data=>{
            for(let name in data) {
              if(data[name].length == name.split('-')[1]) {
                arrayList.push(`${name.split('-')[0]}(全部)`)
              } else {
                arrayList.push(`${name.split('-')[0]}(${data[name].join()})`)
              }
            }
          })
          array.push(arrayList)
        })
  
        let buyerList = []
        this.state.buyerList.forEach(item=>{
          buyerList.push(Object.assign({},item))
        })
        buyerList[nextProps.editIndex+1].distributionAreaName = array[nextProps.editIndex].join('、')
        buyerList[nextProps.editIndex+1].distributionAreaNameDetails = JSON.stringify(nextProps.allNameList[nextProps.editIndex])
        buyerList[nextProps.editIndex+1].distributionAreaCityCode = nextProps.cityCodeList[nextProps.editIndex].join()
        buyerList[nextProps.editIndex+1].distributionAreaProvinceCode = nextProps.provinceCodeList[nextProps.editIndex].join()
  
        this.setState({ 
          buyerList
        },()=>{
          if(this.state.buyerList.length > 1){
            this.setState({
              type: '2'
            })
          }
        })
      } else if (JSON.stringify(nextProps.allNameList) != JSON.stringify(this.state.allNameList)) { //新增
        //props赋值给state 
        let allNameList = []
        nextProps.allNameList.forEach((item, i)=>{
          let list = []
          item.forEach(data=>{
            list.push(Object.assign({},data))
          })
          allNameList.push(list)
        })
        this.setState({
          allNameList
        })
  
        //重新组装数组 拼接配送区域的名称
        let array = []
        nextProps.allNameList.forEach(list=>{
          let arrayList = []
          list.forEach(data=>{
            for(let name in data) {
              if(data[name].length == name.split('-')[1]) {
                arrayList.push(`${name.split('-')[0]}(全部)`)
              } else {
                arrayList.push(`${name.split('-')[0]}(${data[name].join()})`)
              }
            }
          })
          array.push(arrayList)
        })
  
        let buyerList = []
        this.state.buyerList.forEach(item=>{
          buyerList.push(Object.assign({},item))
        })
        // 根据区域名称数组长度push数组
        array.forEach((item, index)=>{
          //判断区域名称是否已在buyerList数组内存在
          let rex = buyerList.some((element)=>{
            return element.distributionAreaName == item.join('、')
          })
          if(!rex) {
            buyerList.push(Object.assign({},{
              distributionAreaName: item.join('、'),
              distributionAreaNameDetails:  JSON.stringify(nextProps.allNameList[index]),
              distributionAreaCityCode: nextProps.cityCodeList[index].join(), 
              firstPrice: '', //首件
              firstPriceFreight: '', //运费
              continuation: '', //续件
              continuationFreight: '', //续费
              distributionAreaProvinceCode: nextProps.provinceCodeList[index].join()
            }))
          }      
        })
  
        this.setState({ 
          buyerList
        })
      }

    // console.log(this.state.initialize)
    // if(!this.state.initialize) {

    //   let allNameList = this.props.allNameList

    //   let array = []
    //   allNameList.forEach(list=>{
    //     let arrayList = []
    //     list.forEach(data=>{
    //       for(let name in data) {
    //         if(data[name].length == name.split('-')[1]) {
    //           arrayList.push(`${name.split('-')[0]}(全部)`)
    //         } else {
    //           arrayList.push(`${name.split('-')[0]}(${data[name].join()})`)
    //         }
    //       }
    //     })
    //     array.push(arrayList)
    //   })
    //   let list = [ 
    //       {
    //       distributionAreaName: '所有区域默认（未勾选地区适用此费用）', // 
    //       distributionAreaCityCode: '0', 
    //       firstPrice: '', //首件
    //       firstPriceFreight: '', //运费
    //       continuation: '', //续件
    //       continuationFreight: '', //续费
    //       distributionAreaProvinceCode: ''
    //     }
    //   ]
    //   // this.props.data.freightTemplateAreas.forEach(item=>{
    //   //   list.push(Object.assign({}, item))
    //   // })
    //   array.forEach((item, index)=>{
    //     if(item.length) {
    //       list.push(Object.assign({},{
    //         distributionAreaName: item.join('、'),
    //         distributionAreaNameDetails:  JSON.stringify(this.props.allNameList[index]),
    //         distributionAreaCityCode: this.props.cityCodeList[index].join(), 
    //         firstPrice: '', //首件
    //         firstPriceFreight: '', //运费
    //         continuation: '', //续件
    //         continuationFreight: '', //续费
    //         distributionAreaProvinceCode: this.props.provinceCodeList[index].join()
    //       }))
    //     }
    //   })
    //   this.setState({ 
    //     buyerList: list
    //   })
  // }
  }
  loop = (data) => {
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "4":
            data[i] = "交易完成"
            break;
          case "5":
            data[i] = "交易关闭"
            break;
          case "6":
            data[i] = "已退款"
            break;
        }
      }
      if(i == "terminal"){
        switch (data[i]) {
          case "1":
            data[i] = "APP"
            break;
          case "2":
            data[i] = "微信公众号"
            break;
          case "3":
            data[i] = "支付宝生活号"
            break;
        }
      }
    }
    return data;
  }

  cancel() {
    this.props.closeEdit()
    this.props.setList({
      provinceCodeList:[],
      cityCodeList:[],
      allNameList:[]
    })
  }

  RadioChange(ev) {

    this.setState({
      type: ev.target.value
    })
  }
  //买家
  buyerApply() {
    let children = []
    this.state.buyerList.forEach((item, index)=>{
      children.push (
        <tr key={index}>
          <td>
            <div>
              <div>{item.distributionAreaName}</div>
              {index ? ( <div style={{ textAlign: "right"}}>
                <span style={{ paddingRight: '8px',color: '#0066FF',cursor: 'pointer'}} onClick={this.onEdit.bind(this, index)}>修改</span>
                <span style={{color: '#0066FF',cursor: 'pointer'}} onClick={this.onDel.bind(this, index)}>删除</span>
              </div>):''}
            </div>
          
          </td>
          <td> <Input value={item.firstPrice} onChange={this.buyerChange.bind(this, 'firstPrice', index)}/></td>
          <td> <Input value={item.firstPriceFreight} onChange={this.buyerChange.bind(this, 'firstPriceFreight', index)}/></td>
          <td> <Input value={item.continuation} onChange={this.buyerChange.bind(this, 'continuation', index)}/></td>
          <td> <Input value={item.continuationFreight} onChange={this.buyerChange.bind(this, 'continuationFreight', index)}/></td>
        </tr>
      )
    })
    return children
  }
  //卖家
  sellerApply() {
     let children = (<tr key={Math.random}>
          <td>所有区域默认（未勾选地区适用此费用）</td>
          <td> <Input value='1' disabled/></td>
          <td> <Input value='0' disabled/></td>
          <td> <Input value='1' disabled/></td>
          <td> <Input value='0' disabled/></td>
        </tr>
      )
    return children
  }
  buyerChange(params, index, ev) {
    let list = []
    this.state.buyerList.forEach(data=>{
      list.push(Object.assign({},data))
    })
    list[index][params] = ev.target.value
    this.setState({
      buyerList: list
    })
  }

  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let reg = self.regx(self.state);
    if(!reg) return

    this.props.update({
      params: {
          templateName: self.state.templateName,
          calculationMethod: self.state.calculationMethod,
          defaultStatus: self.state.defaultStatus,
          userId: userData.id,
          instCode: userData.instCode,
          freightTemplateAreaJson: self.state.type == 1 ? '' : JSON.stringify(self.state.buyerList),
          setType: 2,
          templateType: self.state.type,
          id: this.props.argument.id
      },
      func: function () {
          message.success('添加成功!', 1.5, function() {self.props.search('editVisible')});
      }
    })
  }
  regx (item) {
    message.destroy();
    if(!item.templateName){
      message.warning('模板名称不能为空');
      return false
    }
    return true;
  }
  areaShow() {
    this.props.setList({
      editStatus: false
    })
    this.setState({
      initialize: false
    })
    this.props.openArea('editVisible')
  }
  //编辑
  onEdit(index){
    this.props.setList({
      editStatus: true,
      editIndex: (index - 1)
    })
    this.setState({
      initialize: false
    })
    this.props.openArea('editVisible')    
  }
  //删除
  onDel(index){
    let buyerList = this.state.buyerList
    buyerList.splice(index, 1)

    let provinceCodeList = this.props.provinceCodeList
    provinceCodeList.splice((index - 1), 1)

    let cityCodeList = this.props.cityCodeList
    cityCodeList.splice((index - 1), 1)

    let allNameList = this.props.allNameList
    allNameList.splice((index - 1), 1)

    this.props.setList({
      provinceCodeList,
      cityCodeList,
      allNameList
    })
    this.setState({
      buyerList,
      initialize: false
    })
  }
  handelChange(params, ev) {
    this.setState({
      [params]: ev.target.value
    })
  }
  render() {
    const {data} = this.props;
    const { getFieldDecorator } = this.props.form;
    const content = data || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.save.bind(this)}>确定</Button> :
                <Button type="primary">确定</Button>
              }
              
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>模板名称</td>
                    <td>
                      <Input placeholder="请输入模板名称" onChange={this.handelChange.bind(this, 'templateName')}  value={this.state.templateName} maxLength={20}/>
                    </td>
                  </tr>
                  <tr>
                    <td>模板类型</td>
                    <td>
                          <RadioGroup onChange={this.RadioChange.bind(this)} value={this.state.type}>
                            <Radio value="1">卖家包邮</Radio>
                            <Radio value="2">买家承担运费</Radio>
                          </RadioGroup>
                    </td>
                  </tr>
                  <tr>
                    <td>计件方式</td>
                    <td>
                          <RadioGroup  onChange={this.handelChange.bind(this, 'calculationMethod')} value={this.state.calculationMethod}>
                            <Radio value="1">按件数</Radio>
                            <Radio value="2">按重量</Radio>
                            <Radio value="3">按体积</Radio>
                          </RadioGroup>
                    </td>
                  </tr>
                  <tr>
                    <td>默认模板</td>
                    <td>
                        <RadioGroup  onChange={this.handelChange.bind(this, 'defaultStatus')} value={this.state.defaultStatus}>
                          <Radio value="1">设为默认</Radio>
                        </RadioGroup>
                    </td>
                  </tr>

                </tbody>
              </table>
            </Row>
            <Row>
              <table cellSpacing="0" className={Style.mytable2}>
                <tbody>
                  <tr>
                    <td style={{width:263}}>配送区域</td>
                    <td>首件(个)</td>
                    <td>运费(元)</td>
                    <td>续件(个)</td>
                    <td>续费(元)</td>
                  </tr>
                  {
                    this.state.type == 1 ? this.sellerApply() : this.buyerApply()
                  }
                </tbody>
              </table>
              {
                    this.state.type == 1 ? null : (<Button onClick={this.areaShow.bind(this)}>新增配送区域</Button>)
              }
             
            </Row>
          </Form>
        </div>

      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    argument: state.dispatchSet.saveSeslect,
    data: state.dispatchSet.detail,
    provinceCodeList: state.area.provinceCodeList,
    cityCodeList: state.area.cityCodeList,
    allNameList: state.area.allNameList,
    buyerList: state.area.buyerList,
    editStatus: state.area.editStatus,
    editIndex: state.area.editIndex
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'dispatchSet/detail', payload})
    },
    setList(payload = {}) {
      dispatch({type: 'area/setList', payload})
    },
    update(payload = {}) {
      dispatch({type: 'dispatchSet/update', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));


