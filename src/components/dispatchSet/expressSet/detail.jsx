import React, { Component } from 'react';
import {Button,Row,Form,Radio,Input, message, Modal} from 'antd';
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
      visible: false
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
        console.log(self.props)
        self.setState({
          type: self.props.data.templateType,
          buyerList: self.props.data.freightTemplateAreas
        })
        let provinceCode
        let provinceCodeList = []

        let cityCode
        let cityCodeList = []

        let allName
        let allNameList = []
        self.props.data.freightTemplateAreas.forEach((data, index)=>{
          if(index) {
            provinceCode = data.distributionAreaProvinceCode.split(',')
            provinceCodeList.push(provinceCode)
            cityCode = data.distributionAreaCityCode.split(',')
            cityCodeList.push(cityCode)
            allName = data.distributionAreaNameDetails ? JSON.parse(data.distributionAreaNameDetails):''
            allNameList.push(allName)
          }
          
            // cityCode.push(data.distributionAreaCityCode)
            // allName.push(data.distributionAreaName.split('、'))
          
        })
        console.log(allNameList)
        // let provinceCodeList = self.props.provinceCodeList
        // let cityCodeList = self.props.cityCodeList
        // let allNameList = self.props.allNameList
        // provinceCodeList.push(provinceCode)
        // cityCodeList.push(cityCode)
        // allNameList.push(allName)

        self.props.setList({
          provinceCodeList,
          cityCodeList,
          allNameList,
          buyerList: self.props.data.freightTemplateAreas
        })
      }
    });
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
    this.props.closeAdd()
    this.props.setList({
      provinceCodeList:[],
      cityCodeList:[],
      allNameList:[]
    })
  }

  RadioChange(ev) {
    if(ev.target.value == 1) {
      this.props.setList({
        provinceCodeList:[],
        cityCodeList:[],
        allNameList:[]
      })
      this.setState({
        buyerList:[]
      })
    }
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
              {/* {index ? ( <div style={{ textAlign: "right"}}>
                <span style={{ paddingRight: '8px',color: '#0066FF',cursor: 'pointer'}} onClick={this.onEdit.bind(this, index)}>修改</span>
                <span style={{color: '#0066FF',cursor: 'pointer'}} onClick={this.onDel.bind(this, index)}>删除</span>
              </div>):''} */}
            </div>
          
          </td>
          <td> <Input value={item.firstPrice} onChange={this.buyerChange.bind(this, 'firstPrice', index)} disabled/></td>
          <td> <Input value={item.firstPriceFreight} onChange={this.buyerChange.bind(this, 'firstPriceFreight', index)} disabled/></td>
          <td> <Input value={item.continuation} onChange={this.buyerChange.bind(this, 'continuation', index)} disabled/></td>
          <td> <Input value={item.continuationFreight} onChange={this.buyerChange.bind(this, 'continuationFreight', index)} disabled/></td>
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
    this.props.form.validateFields((err, values) => {
      this.props.instAdd({
          params: {
              ...values,
              userId: userData.id,
              instCode: userData.instCode,
              freightTemplateAreaJson: self.state.type == 1 ? '' : JSON.stringify(self.state.buyerList),
              setType: 2,
              templateType: self.state.type
          },
          func: function () {
              message.success('添加成功!', 1.5, function() {self.props.search('editVisible')});
          }
      })

    })
  }
  areaShow() {
    this.props.setList({
      editStatus: false
    })
    this.props.openArea('editVisible')
  }
  //编辑
  onEdit(index){
    this.props.setList({
      editStatus: true,
      editIndex: (index - 1)
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
      buyerList
    })
  }
  sure() {
    this.setState({
      visible: true
    })
  }
  del() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.del({
      params: {
        userId: userData.id, 
        id: this.props.argument.id
      },
      func: ()=>{
        message.success('操作成功!', 1.5, ()=>{
          this.setState({
            visible: false
          })
          this.props.search('detailVisible')
        });
      }
    })
  }
  handleCancel(e) {
    this.setState({
        [e]: false
    })
  }
  goEdit() {
    this.props.closeDetail()
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
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <Button onClick={this.sure.bind(this)}>删除</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>模板名称</td>
                    <td>
                        {getFieldDecorator('templateName', {initialValue: content.templateName})(
                          <Input placeholder="请输入模板名称" disabled/>
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>模板类型</td>
                    <td>
                          <RadioGroup onChange={this.RadioChange.bind(this)} value={this.state.type} disabled>
                            <Radio value="1">卖家包邮</Radio>
                            <Radio value="2">买家承担运费</Radio>
                          </RadioGroup>
                    </td>
                  </tr>
                  <tr>
                    <td>计件方式</td>
                    <td>
                        {getFieldDecorator('calculationMethod', {initialValue: content.calculationMethod})(
                          <RadioGroup disabled>
                            <Radio value="1">按件数</Radio>
                            <Radio value="2">按重量</Radio>
                            <Radio value="3">按体积</Radio>
                          </RadioGroup>
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>默认模板</td>
                    <td>
                        {getFieldDecorator('defaultStatus', {initialValue: content.defaultStatus})(
                          <RadioGroup disabled>
                            <Radio value="1">设为默认</Radio>
                          </RadioGroup>
                        )}
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
                    this.state.type == 1 ? null : (<Button onClick={this.areaShow.bind(this)} disabled>新增配送区域</Button>)
              }
             
            </Row>
          </Form>
        </div>
        <Modal
            title="删除"
            visible={this.state.visible}
            onOk={this.del.bind(this)}
            onCancel={this.handleCancel.bind(this,'visible')}
            >
            <p style={{fontSize:16}}>确定删除?</p>
        </Modal>
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
    allNameList: state.area.allNameList
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
    del(payload = {}) {
      dispatch({type: 'dispatchSet/del', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));


