import React, { Component } from 'react';
import {Button,Row,Form,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';
import { List } from 'immutable';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      headerLIst: [],
      tableArray: []
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));

    this.props.getStock({
      params:{ 
        userId: userData.id, 
        goodId: this.props.argument.id, 
      },
      func: () =>{

        let headerLIst = this.props.stockInfo.listTitle
        let goodSkus = this.props.stockInfo.goodSkus
        let tableArray = []
        goodSkus.forEach(item=>{
          tableArray.push(Object.assign({},{
              oneConfig: item.oneConfig, 
              twoConfig: item.twoConfig, 
              threeConfig: item.threeConfig, 
              sellingPrice: item.sellingPrice, 
              ticket: item.ticket,
              costPrice: item.costPrice,
              stock: item.stock,
              id: item.id,
              editStock: '',
              nowTicket: item.stock
            })
          )
        })
        this.setState({
          headerLIst,
          tableArray
        })
      }
    })

  }
    //表格标题
  tableHeader() {

    let children = []
    this.state.headerLIst.forEach(function(item, index){
        children.push(
            item ? (<td key={index}>{item}</td>): null
        )
    })
    return children
  }
  //表格内容
  tableApply() {
    let children = []
    this.state.tableArray.forEach((item, index) => {
        children.push(
          <tr key={index}>
            {item.oneConfig ? <td>{item.oneConfig}</td> : null}
            {item.twoConfig ? <td>{item.twoConfig}</td> : null}
            {item.threeConfig ? <td>{item.threeConfig}</td> : null}
            <td>
              <Input value={item.sellingPrice} onChange={this.inputChange.bind(this, 'sellingPrice', item)}/>
            </td>
            <td>
              <Input value={item.ticket} onChange={this.inputChange.bind(this, 'ticket', item)}/>
            </td>
            <td>
              <Input value={item.costPrice} onChange={this.inputChange.bind(this, 'costPrice', item)}/>
            </td>
            <td>{item.stock}</td>
            <td>
              <Input value={item.editStock}  onChange={this.editStock.bind(this, item)}/>
            </td>
            <td>{item.nowTicket}</td>
          </tr>
        )
    })
    return children
  }
  inputChange(params, data, ev) {
    let list =  []
    this.state.tableArray.forEach(item=>{
      list.push(
        Object.assign({}, item)
      )
    })
    list.forEach(item=>{
      if(item.id == data.id) {
        item[params] = ev.target.value
      }
    })
    this.setState({
      tableArray: list
    })
  }
  editStock(data, ev) {
    let list =  []
    this.state.tableArray.forEach(item=>{
      list.push(
        Object.assign({}, item)
      )
    })
    list.forEach(item=>{
      if(item.id == data.id) {
        let val = ev.target.value
       if(val.indexOf('-') == 0) {
         val = val.replace(/-/g,'').replace(/[^0-9]/g,'')
         if(val) {
          item.editStock = -val
          let num = Number(item.stock) - Number(val)
          if(num < 0) {
            item.nowTicket = 0
          } else {
            item.nowTicket = num
          }
         } else {
          item.editStock = '-'
         }

       } else {
        val =  val.replace(/-/g,'').replace(/[^0-9]/g,'')
        item.editStock = val
        let num = Number(item.stock) + Number(val)
          item.nowTicket = num
       }
       
      }
    })
    this.setState({
      tableArray: list
    })
  }
  amend(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    let list =  []
    self.state.tableArray.forEach(item=>{
      list.push(
        Object.assign({}, {
          sellingPrice: item.sellingPrice, 
          ticket: item.ticket,
          costPrice: item.costPrice,
          stock: item.nowTicket,
          id: item.id
        })
      )
    })
      this.props.updateStock({
        params: {
          userId: userData.id,
          goodId: self.props.argument.id,
          goodSkuJson: JSON.stringify(list)
        },
        func: function () {
          message.success('操作成功', 1.5, ()=>{
           
            self.props.search('amendPriceVisible')
          });
        }
      })
  }

  cancel(){
    this.props.closeAmendPrice(false)
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              <Button type="primary" onClick={this.amend.bind(this)}>确定</Button>
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    {this.tableHeader()}
                  </tr>
                  {this.tableApply()}
                </tbody>
              </table>
            </Row>
        </div>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.goodsManage.saveSeslect,
    stockInfo: state.goodsManage.stockInfo
  }
}

function dispatchToProps(dispatch) {
  return {
    getStock(payload = {}) {
      dispatch({type: 'goodsManage/getStock', payload})
    },
    updateStock(payload = {}) {
      dispatch({type: 'goodsManage/updateStock', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
