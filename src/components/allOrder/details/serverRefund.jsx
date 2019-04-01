import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Form,Card,message,Col,Checkbox,Input,Radio } from 'antd';
import {connect} from 'dva';
import Style from './detail.less';

let ids = [];   //用来储存选中的数据的id
let list = [];  //用来储存选中的数据

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      inpDisabled: true,
      radioValue: '',
      datas: [],
      list: [],
      amount: 0,
      ticket: 0
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.refundInfo({
      params: {
        userId: userData.id, 
        orderNo: this.props.argument.orderNo,
        instCode: userData.instCode
      },
      func: () => {
        let list = [];
        this.props.data.orderSkus.forEach((item) => {
          list.push(Object.assign({}, item))
        })
        this.setState({
          datas: this.props.data.orderSkus,
          list
        })
      }
    });
  }

  handleCheck(id,e){
    let data = this.state.datas;
    let origData = this.state.list;
    data.forEach(ele => {   
      if(ele.id == id){
        if(e.target.checked){ //选中,把input设为可以输入
          ele.checked = e.target.checked;
          ids.push(id); //把选中的那个数据id储存起来
        }else{  //取消选中,把input的值变为原来的初始值
          origData.forEach((item) => {
            if(item.id == ele.id){
              ele.num = item.num
            }
          })
          ele.checked = e.target.checked;
          //把取消选中的那个数据id从ids数组中移除
          ids.forEach((e,i) => {
            if(e == id){
              ids.splice(i,1)
            }
          });
        }
      }
    });

    if(e.target.checked){
      data.forEach((item) => 
        ids.forEach((ele) => {
          if(item.id == ele){
            if(list.indexOf(item) == -1){
              list.push(item)
            }
          }
        })
      )
    }else{
      list.forEach((item,i) => {
        if(item.id == id){
          list.splice(i,1)
        }
      })
    }

    let sumTicket = [];
    let sumAmount = [];
    list.forEach((item) => {
      sumTicket.push(Math.ceil(item.ticket/item.nums*item.num));
      sumAmount.push(Math.ceil(item.amount/item.nums*item.num));
    })

    this.setState({
      datas: data,
      ticket: JSON.stringify(sumTicket) == '[]' ? 0 : sumTicket.reduce((accumulator, currentValue) => accumulator + currentValue),
      amount: JSON.stringify(sumAmount) == '[]' ? 0 : sumAmount.reduce((accumulator, currentValue) => accumulator + currentValue)
    })
  }
  handleInp(id,e){
    let data = this.state.datas;
    let origData = this.state.list;
    const reg = /^[1-9]+\d*$/;  //匹配只能输入大于0的数字

    message.destroy();
    if(e.target.value) {
      if(!reg.test(e.target.value)){
        message.warning('退款数量只能输入大于0的数字')
        return
      }
    }
  

    data.forEach(ele => {   
      if(ele.id == id){
        origData.forEach((item) => {
          if(item.id == ele.id){
            ele.num = e.target.value
          }
        })
      }
    });

    list.forEach(ele => {   
      if(ele.id == id){
        origData.forEach((item) => {
          if(item.id == ele.id){
            ele.num = e.target.value
          }
        })
      }
    });



    let sumTicket = [];
    let sumAmount = [];
    list.forEach((item) => {
      sumTicket.push(Math.ceil(item.ticket/item.nums*item.num));
      sumAmount.push(Math.ceil(item.amount/item.nums*item.num));
    })

    this.setState({
      datas: data,
      ticket:  sumTicket.reduce((accumulator, currentValue) => accumulator + currentValue),
      amount: sumAmount.reduce((accumulator, currentValue) => accumulator + currentValue)
    })
  }


  confirm(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));

    let lists = [];
    let arr = [];
    let arr1 = [];

    list.forEach((item) => {
      if(item.num == ''){
        arr.push(1)
      }
      if(item.num > item.nums){
        arr1.push(2)
      }
      lists.push({
        amount: item.amount,
        goodId: item.goodId,
        goodName: item.goodName,
        num: item.num,
        skuName: item.skuName,
        skuId: item.skuId,
        ticket: item.ticket,
      })
    })
    if(arr.length > 0){
      message.warning('退款数量不能为空');
      return
    }
    if(arr1.length > 0){
      message.warning('退款数量不能大于最大退款数量');
      return
    }


    if(this.state.requestStatus){
      this.setState({requestStatus: false},() => {
        this.props.serverRefund({
          params: {
            userId: userData.id,
            origOrderNo: this.props.argument.orderNo,
            source: '3',
            amount: this.state.amount,
            ticket: this.state.ticket,
            orderSkus: lists
          },
          func: () => {
            message.success('操作成功', 1.5, () => {
              this.props.search('serverRefundVisible');
            });
          }
        })
      })
    }


  }


  render() {
    const { data } = this.props;
    const { datas } = this.state;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            {
              this.state.requestStatus ? <Button type="primary" onClick={ this.confirm.bind(this) }>确定</Button> :
              <Button type="primary">确定</Button>
            }
            
            <Button onClick={ () => this.props.closeOrder() }>取消</Button>
            <Row>
              <Card className="cards" style={{marginTop:20}}>
                <Col style={{marginBottom:20}}>
                  <span style={{marginRight:20}}>选择退款</span> 
                  <Radio style={{width:'86%',paddingBottom: 15,borderBottom: '1px solid #e8e8e8'}} defaultChecked={true}>按项目退款</Radio>
                </Col>
                <table cellSpacing="0" className={Style.mytable}>
                  <thead>
                    <tr>
                      <th>选择项目</th>
                      <th>退款数量</th>
                      <th>现金总额</th>
                      <th>粮票总额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      datas ? datas.map((item) => 
                        <tr key={item.id}>
                          <td>
                            <Checkbox onChange={this.handleCheck.bind(this,item.id)}>{item.skuName}</Checkbox>
                          </td>
                          <td>
                            <Input
                              onChange={ this.handleInp.bind(this,item.id) }
                              disabled={!item.checked}
                              value={item.num} />
                          </td>
                          <td>
                            <span>&yen; { item.amount.toFixed(2) }</span>
                          </td>
                          <td>
                            { Math.ceil(item.ticket) }
                          </td>
                        </tr>
                      ) : <tr><td>''</td></tr>
                    }

                  </tbody>
                </table>
                <Col style={{display:'flex',justifyContent:'flex-end'}}>
                    <div style={{borderBottom: '1px dashed #C6C6C6',paddingBottom: 10}}>
                      实付金额 : 
                      <span style={{margin:'0 20px'}}>&yen; { data?data.amount.toFixed(2):'' }</span> 
                      <span>粮票 { data?Math.ceil(data.ticket):'' }</span>
                    </div>
                </Col>
                <Col style={{textAlign:'right',marginTop:10}}>
                    退款申请 : <span style={{margin:'0 20px'}}>&yen; { this.state.amount }</span> <span>粮票 { this.state.ticket }</span>
                </Col>

              </Card>


            </Row>
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
    argument: state.orderList.saveSeslect,
    data: state.orderList.refundInfoData,
  }
}

function dispatchToProps(dispatch) {
  return {
    refundInfo(payload = {}) {
      dispatch({type: 'orderList/refundInfo', payload})
    },
    serverRefund(payload = {}) {
      dispatch({type: 'orderList/serverRefund', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
