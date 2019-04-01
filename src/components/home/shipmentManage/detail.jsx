import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Col,Form,Modal,Card, Steps,Tabs,Avatar,message,Rate } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';
import { mul,accSub } from '../../../util/count';   //解决精度丢失函数

const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const { Meta } = Card;

const info = () => {
  message.destroy();
  message.info('该订单中有商品申请退款，请先处理！');
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      orderNo: this.props.argument.orderNo,
      instCode: userData.instCode
    });
  }


  loop = (data) => {
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "1":
            data[i] = "待付款"
            break;
          case "2":
            data[i] = "待配送"
            break;
          case "3":
            data[i] = "配送中"
            break;
          case "4":
            data[i] = "交易完成-待评价"
            break;
          case "5":
            data[i] = "已关闭"
            break;
          case "6":
            data[i] = "交易完成-已评价"
            break;
        }
      }
      if(i == "way"){
        switch (data[i]) {
          case "1":
            data[i] = "商家配送"
            break;
          case "2":
            data[i] = "快递"
            break;
          case "3":
            data[i] = "用户自取"
            break;
        }
      }
      if(i == "paymentMethod"){
        switch (data[i]) {
          case "1":
            data[i] = "线上支付-微信"
            break;
          case "2":
            data[i] = "线上支付-支付宝"
            break;
        }
      }
      if(i == "source"){
        switch (data[i]) {
          case "1":
            data[i] = "悦站app"
            break;
          case "2":
            data[i] = "悦站H5"
            break;
        }
      }
    }

    return data;
  }

  //点击发货,关闭详情,弹出发货框
  shipments(){
    this.props.closeDetail("shipmentsVisible")
  }
  //点击修改物流,关闭详情,弹出修改物流框
  logistics(){
    this.props.closeDetail("logisticsVisible")
  }
  //点击关闭订单,关闭详情,弹出关闭订单框
  closeOrder(){
    this.props.closeDetail("closeOrderVisible")
  }

  //待付款
  showHtml1(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>
          </p>
        </Col>
        <Col span={4}>
          <Button onClick={this.closeOrder.bind(this)}>关闭订单</Button>
        </Col>
    </Card>
    )
  }
  //待配送
  showHtml2(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>买家已付款，请尽快发货</p>
        </Col>
        {/* "退款中"可点弹出提示信息,非退款中可以点击发货,发货又分为两种状态,假如配送方式为"用户自取",则不需要展示发货按钮*/}
        <Col span={4}>
          {
            content.deliverGoodsStatus == '1' ? 
            <Button style={{visibility: content.way == '用户自取' ? 'hidden' : 'visible' }} type="primary" onClick={this.shipments.bind(this)}>发货</Button> : 
            <Button type="primary" style={{background:'#e8e8e8',borderColor:'#e8e8e8'}} onClick={ info }>发货</Button> 
          }
          
        </Col>
    </Card>
    )
  }
  //配送中
  showHtml3(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>等待买家确认收货</p>
        </Col>
        <Col span={4}>
          {
            content.way == '3' ? null : 
            <Button onClick={this.logistics.bind(this)}>修改物流</Button>
          }
          
        </Col>
    </Card>
    )
  }
  //交易完成-已评价
  showHtml4(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <div>
            <Col span={12}>商品满意</Col><Col span={12}><Rate style={{color:'red'}} disabled defaultValue={ +content.satisfaction } /></Col>
          </div>
          <div>
            <Col span={12}>配送及时</Col><Col span={12}><Rate style={{color:'red'}} disabled defaultValue={ +content.timelyDelivery } /></Col>
          </div>
          <div>
            <Col span={12}>服务态度</Col><Col span={12}><Rate style={{color:'red'}} disabled defaultValue={ +content.attitude } /></Col>
          </div>
          <div>评论时间 : { Moment(content.evaluationTime).format("YYYY-MM-DD HH:mm:ss") }</div>
        </Col>
        <Col span={4}>
          <Button onClick={this.goComment.bind(this, content)}>查看评论</Button>
        </Col>
    </Card>
    )
  }
  //交易完成-待评价
  showHtml6(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={17}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>等待买家进行评价</p>
        </Col>
    </Card>
    )
  }
  //已关闭
  showHtml5(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={17}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>关闭原因 : { content.closeReason }</p>
          <p>备注信息 : { content.closeMemo }</p>
        </Col>
    </Card>
    )
  }

  //查看评论
  goComment(param) {
    this.context.router.history.push(`/${this.props.match.params.id}/app/goodsComment/${param.orderNo}`)
  }
  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};

    let orderStatusShow = null;
    if(content.status == '待付款'){
      orderStatusShow = this.showHtml1(content)
    }else if(content.status == '待配送'){
      orderStatusShow = this.showHtml2(content)
    }else if(content.status == '配送中'){
      orderStatusShow = this.showHtml3(content)
    }else if(content.status == '交易完成-已评价'){
      orderStatusShow = this.showHtml4(content)
    }else if(content.status == '已关闭'){
      orderStatusShow = this.showHtml5(content)
    }else if(content.status == '交易完成-待评价'){
      orderStatusShow = this.showHtml6(content)
    }

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
                <Steps current={ +content.orderStatusIndex }>
                  {
                    content.orderStatusRecords ? content.orderStatusRecords.map((item,index) => {
                      return (
                        <Step key={index} title={item.statusName} description={ item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '' } />
                      )
                    }) : null
                  }

                </Steps>

                { orderStatusShow }

                <Card className="info">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="配送信息" key="1">
                      <p>配送方式 : { content.way }</p>
                      <p>配送时间 : { content.freightTimeInfo }</p>
                      <p>配送地址 : { content.receiptName }，{ content.receiptPhone }，{ content.address }</p>
                      <p>买家留言 : { content.memo }</p>
                    </TabPane>
                    <TabPane tab="订单信息" key="2">
                      <Col span={12}>
                        <p>订单编号 : { content.orderNo }</p>
                        <p>订单来源 : { content.source }</p>
                        <p>订单金额 : ¥ { content.originalPrice }</p>
                        <p>支付单号 : { content.payOrderNo }</p>
                      </Col>
                      <Col span={12}>
                        <p>买家昵称 : { content.receiptNickname }</p>
                        <p>买家账号 : { content.receiptAccount }</p>
                        <p>支付方式 : { content.paymentMethod }</p>
                        <p>实付金额 : ¥ { content.amount } + { content.ticket } 粮票</p>
                      </Col>
                    </TabPane>
                    <TabPane tab="商品信息" key="3">
                        <Row style={{borderBottom:'1px solid #e8e8e8',padding:'0 0 10px 15px'}}>
                          <Col span={12}>商品</Col>
                          <Col span={4}>单价 ( 元 )</Col>
                          <Col span={4}>粮票</Col>
                          <Col span={4}>实收 ( 元 )</Col>
                        </Row>
                        {
                          content.orderSkus ? content.orderSkus.map((item,index) => {
                            return (
                              <Row key={item.id} style={{borderBottom:'1px solid #e8e8e8',padding:'15px 0 10px 15px',display:'flex',alignItems:'center'}}>
                                <Col span={12}>
                                    <Card bordered={false}>
                                        <Meta
                                            avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
                                            title={item.goodName}
                                            description={
                                                <Col>
                                                    <Col span={16}><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
                                                </Col>
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={4}>{ mul(item.amount,item.num) }</Col>
                                <Col span={4}>{ item.ticket }</Col>
                                <Col span={4}>{ accSub(mul(item.amount,item.num),item.ticket) }</Col>
                              </Row>
                            )
                          }) : []
                        }
                        <Row style={{borderBottom:'1px solid #e8e8e8',padding:'15px 0 10px 15px'}}>
                          <Col span={20}>运费 : </Col>
                          <Col span={4}>{ content.freight == 0 ? '免邮' : content.freight }</Col>
                        </Row>
                        <Row style={{borderBottom:'1px solid #e8e8e8',padding:'15px 0 10px 15px'}}>
                          <Col span={20}>总计 : </Col>
                          <Col span={4}>{ content.amount }</Col>
                        </Row>
                    </TabPane>
                  </Tabs>
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
    data: state.orderList.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'orderList/detail', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
