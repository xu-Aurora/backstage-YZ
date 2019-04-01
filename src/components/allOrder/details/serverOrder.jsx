import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Col,Form,Card,Tabs,Avatar,Modal } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';
import { mul,accSub } from '../../../util/count';   //解决精度丢失函数

const TabPane = Tabs.TabPane;
const { Meta } = Card;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
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
          case "5":
            data[i] = "已关闭"
            break;
          case "6":
            data[i] = "交易完成"
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

  handleOk = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;

      this.props.closeOrderId({
        params: {
          userId: userData.id,
          orderNo: self.props.data.orderNo,
          instCode: userData.instCode
        },
        func: function () {
          message.success('操作成功', 1.5, ()=>{
            self.setState({visibleShow: false })
            self.props.search('closeOrderVisible');
          });
          
        }
      })


  }


  //待付款
  showHtml1(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>
            {
              content.status == '待付款' ? content.surplusTime : '订单已关闭'
            }
          </p>
        </Col>
        <Col span={4}>
          <Button onClick={ () => this.setState({visibleShow: true}) }>关闭订单</Button>
        </Col>
    </Card>
    )
  }
  //交易完成
  showHtml2(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>订单状态 : { content.status }</p>
          <p>该订单已完成</p>
        </Col>
        <Col span={4}>
          {
            content.serviceStatus == '2' ? '' : 
            <Button onClick={ () => this.props.closeDetail('serverRefundVisible') }>退款</Button> 
          }
          
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
        </Col>
    </Card>
    )
  }

  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};

    let orderStatusShow = null;
    if(content.status == '待付款'){
      orderStatusShow = this.showHtml1(content)
    }else if(content.status == '交易完成'){
      orderStatusShow = this.showHtml2(content)
    }else if(content.status == '已关闭'){
      orderStatusShow = this.showHtml5(content)
    }

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>

                { orderStatusShow }

                <Card className="info">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="预约信息" key="1">
                      <p>预约时间 : { content.freightTimeInfo }</p>
                      <p>服务信息 : { content.receiptName }，{ content.receiptPhone }，{ content.address }</p>
                      <div className={Style.severNo}>
                        <div>服务项目 :&nbsp;
                          <div>
                            {
                              content.serviceItem ? content.serviceItem.split(',').map((item,index) => {
                                return (
                                  <p key={index}>{item}</p>
                                )
                              }) : ''
                            }
                          </div>
                        </div>
                      </div>
                      <p>买家留言 : { content.memo }</p>
                      <p>服务单号 : { content.serviceOrderNo }</p>
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
                                <Col span={4}>{ mul(item.ticket,item.num) }</Col>
                                <Col span={4}>{ accSub(mul(item.amount,item.num),mul(item.ticket,item.num)) }</Col>
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

        <Modal
            title="关闭订单"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={ () => this.setState({visibleShow: false})}
            >
            <p style={{fontSize:16}}>确定关闭订单?</p>
        </Modal>

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
