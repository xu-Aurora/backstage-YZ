import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Col,Form,Modal,Card,Tabs,Timeline,message } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './index.less';

const TabPane = Tabs.TabPane;


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
      orderNo: this.props.argument.serviceOrderNo,
    });
    this.props.orderRecord({
      userId: userData.id, 
      serviceOrderNo: this.props.argument.serviceOrderNo,
    });
  }


  //待处理
  showHtml1(content){
    return (
      <Card style={{marginBottom:10}}>
          <Col span={12}>
            <p style={{fontWeight:700,marginBottom:10}}>当前状态 : { content.serviceStatusName }</p>
            <p>客户预约服务,请尽快处理;</p>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={ () => this.props.closeDetail('allotOrderVisible') } style={{marginRight:10}}>分配订单</Button>
            <Button type="primary" style={{marginRight:10}} onClick={ () => this.props.closeDetail('amendTimeVisible') }>修改时间</Button>
            <Button type="danger" onClick={ () => this.props.closeDetail('cancelOrderVisible') }>取消订单</Button>
          </Col>
      </Card>
    )
  }
  //处理中
  showHtml2(content){
    return (
      <Card style={{marginBottom:10}}>
        <Col span={12}>
          <p style={{fontWeight:700,marginBottom:10}}>当前状态 : { content.serviceStatusName }</p>
        </Col>
        <Col span={12}>
            <Button type="primary" style={{marginRight:10}} onClick={ () => this.props.closeDetail('allotOrderVisible') }>分配订单</Button>
            <Button type="primary" style={{marginRight:10}} onClick={ () => this.props.closeDetail('amendTimeVisible') }>修改时间</Button>
            <Button type="danger" onClick={ () => this.props.closeDetail('cancelOrderVisible') }>取消订单</Button>
          </Col>
    </Card>
    )
  }



  textStatus(content) {
    let text;
    if(content.serviceStatus == '1'){
      text = (
        <div>
          {
            content.maintainAppendRefund ? 
            <div className={Style.severNo}>退款项目 :&nbsp;
              <div>
                {
                  content.maintainAppendRefund ? content.maintainAppendRefund.map((item,index) => {
                    return (
                      <p key={index}>{item.content}</p>
                    )
                  }) : ''
                }
              </div>
            </div>  : ''
          }
        
          <p>买家留言 : { content.message }</p>
        </div>
      )
    }
    if(content.serviceStatus == '3'){
      text = (
        <div>
          {
            content.maintainAppends ? 
              <div className={Style.severNo2}>追加项目 :&nbsp;
                <div>
                  {
                    content.maintainAppends ? content.maintainAppends.map((item) => 
                      (
                        <div key={item.id}>
                          <p>{item.content}</p>
                          <div>关联订单 : { item.outOrderNo } </div>
                        </div>
                      )
                    ) : ''
                  }
                </div>

              </div> : ''
          }

          <div style={{width:'100%',borderBottom:'1px dashed #E0E1E0',margin:'15px 0'}}></div>
          <div className={Style.severNo1}>服务人员 :&nbsp; 
            {
              content.salesmens ? 
              content.salesmens.map((item) => (
                <div key={item.id}>
                  <div><img src="" alt=""/></div>
                  <div>
                    <p>{ item.instName }（id：{ item.id }）</p>
                    <p>{ item.comNames }</p>
                  </div>
                </div>
              )) : ''
            }

          </div>
        </div>
      )
    }
    return text;
  }


  render() {
    const { data,orderRecordData } = this.props;
    const content = data ? data : {};

    let orderStatusShow = null;
    if(content.serviceStatus == '1'){
      orderStatusShow = this.showHtml1(content)
    }else if(content.serviceStatus == '3'){
      orderStatusShow = this.showHtml2(content)
    }

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
                
                <Tabs defaultActiveKey="1">
                  <TabPane tab="订单信息" key="1">
                    { orderStatusShow }

                    <Card className="cards">
                      <div className={Style.nav}>
                        预约信息
                      </div>
                      
                      <div className={Style.severNo}>
                        <p>服务编号 : { content.serviceOrderNo }</p>
                        <p>用户手机 : { content.receiptPhone }</p>
                      </div>
                      <p>预约时间 : { content.freightTimeInfo }</p>
                      <p>客户信息 : { content.receiptName }  {content.receiptPhone}  { content.address }</p>
                    </Card>
                    <Card className="cards">
                      <div className={Style.nav}>
                        服务信息
                      </div>
                      
                      <p>服务名称 : { content.name }</p>

                      <div className={Style.severNo}>
                        <div>服务项目 :&nbsp;
                          <div>
                            {
                              content.serviceOrderSkuInfoResponses ? content.serviceOrderSkuInfoResponses.map((item,index) => {
                                return (
                                  <p key={index}>{item.skuname}*{item.skunum}</p>
                                )
                              }) : ''
                            }
                          </div>
                        </div>

                        {
                          content.skurelationOrder ? <div>关联订单 : { content.skurelationOrder } </div> : ''
                        }
                        
                      </div>

                      { this.textStatus(content) }


                    </Card>
                  </TabPane>
                  <TabPane tab="订单记录" key="2">
                    <Card>
                      <Timeline>
                        {
                          orderRecordData ? orderRecordData.map((item) => 
                            <Timeline.Item key={item.id}>
                              <Col>
                                <span style={{fontWeight:600,color:'2B2B2B',marginRight:30}}>{ item.operationTitle }</span>
                                <span>{ Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") }</span>
                              </Col>
                              <Col>
                                { item.content }
                              </Col>
                            </Timeline.Item>
                          ) : ''
                        }


                      </Timeline>
                    </Card>
                  </TabPane>
                </Tabs>

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
    argument: state.appointmentManage.saveSeslect,
    data: state.appointmentManage.detail,
    orderRecordData: state.appointmentManage.orderRecordData,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'appointmentManage/serchDetail', payload})
    },
    orderRecord(payload = {}) { //订单记录
      dispatch({type: 'appointmentManage/orderRecord', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
