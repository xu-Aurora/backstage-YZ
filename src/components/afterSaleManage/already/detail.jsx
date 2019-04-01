import React, { Component } from 'react';
import {Button,Row,Col,Form,Card, Steps,Tabs,Avatar } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';

const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Meta } = Card;
const userData = JSON.parse(localStorage.getItem('userDetail'));


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      refundOrderNo: this.props.argument.orderNo,
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

      if(i == "refundState"){
        switch (data[i]) {
          case "4":
            data[i] = "已退款"
            break;
          case "5":
            data[i] = "已拒绝"
            break;
          case "6":
            data[i] = "已取消"
            break;
        }
      }
      if(i == "refundReason"){
        switch (data[i]) {
          case '1':
            data[i] = '退运费'
              break;
          case '2':
            data[i] = '收到商品破损'
              break;
          case '3':
            data[i] = '商品发错、漏发'
              break;
          case '4':
            data[i] = '商品需要维修'
              break;
          case '5':
            data[i] = '收到商品与描述不符'
              break;
          case '6':
            data[i] = '商品质量问题'
              break;
          case '7':
            data[i] = '商品需要维修'
              break;
          case '8':
            data[i] = '未按约定时间发货'
              break;
          case '9':
            data[i] = '其他'
              break;
          default:
              break;
        }
      }

    }
    return data;
  }

  refund(data){
    this.props.closeDetail(data)
  }


  //已拒绝
  showHtml1(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>退款状态 : { content.refundState }</p>
          <p>
            { content.refundReviewUserName } 审核拒绝 , { content.refundReviewMemo ? '备注' : '' } : { content.refundReviewMemo }
          </p>
        </Col>

      </Card>
    )
  }
  //已退款
  showHtml2(content){
    return (
      <Card style={{margin:'20px 0 10px 0'}}>
        <Col span={20}>
          <p style={{fontWeight:700,marginBottom:10}}>退款状态 : { content.refundState }</p>
          <p style={{marginBottom:10}}>{ content.refundReviewUserName } 审核通过 , { content.refundReviewMemo ? '备注' : '' } : { content.refundReviewMemo }</p>
          <p>
            { content.refundConfirmUserName } 确认退款 ( 无需退货直接退款 ) , { content.refundConfirmMemo ? '备注' : '' } : { content.refundConfirmMemo }
          </p>
        </Col>

      </Card>
    )

  }

  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};
    const formItemLayout = {
      labelCol: {xs: { span: 24 },sm: { span: 7 }},
      wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 12 }}
    };

    let orderStatusShow = null;
    if(content.refundState == '已拒绝'){
      orderStatusShow = this.showHtml1(content)
    }else if(content.refundState == '已退款'){
      orderStatusShow = this.showHtml2(content)
    }
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
                <Steps current={ +content.orderStatusIndex } status={ content.orderProgress } >
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
                    <TabPane tab="退款订单" key="1">
                      <Col span={11}>
                          <FormItem {...formItemLayout} label="退款单号">
                            <span>{ content.orderNo }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="业务单号">
                            <span>{ content.origOrderNo }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="客户姓名">
                            <span>{ content.receiptName }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="退款金额">
                            <span>{ content.amount }</span>
                          </FormItem>
                      </Col>
                      <Col span={11}>
                          <FormItem {...formItemLayout} label="申请时间">
                            <span>{ Moment(content.applyTime).format("YYYY-MM-DD HH:mm:ss") }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="订单状态">
                            <span>{ content.refundState }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="客户号码">
                            <span>{ content.receiptPhone }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="实付金额">
                            <span>{ content.originalPrice }</span>
                          </FormItem>
                      </Col>
                      <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="退款原因">
                          <span>{ content.refundReason }</span>
                      </FormItem>
                      <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="退款备注">
                          <span>{ content.refundMemo }</span>
                      </FormItem>
                      <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="退款商品">
                          {
                            content.orderSkus ? content.orderSkus.map((item) => {
                              return (
                                <Card bordered={false} key={item.id}>
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
                              )
                            }) : null
                          }

                      </FormItem>
                    </TabPane>
                  </Tabs>
                </Card>
            </Row>
        </div>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.orderList.saveSeslect,
    data: state.orderList.refundDetailData,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'orderList/refundDetails', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
