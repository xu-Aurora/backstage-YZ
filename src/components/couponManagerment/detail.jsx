import React, { Component } from 'react';
import {Button,Row,Form,Timeline,Modal,message} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';


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
      id: this.props.argument.id,
      instCode: userData.instCode
    });
  }


  //确定订单退款
  handleOk = (e) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.props.refund({
        params: {
          orderNo: this.props.argument.orderNo,
          userId: userData.id,
          userName: userData.name
        },
        func: function () {
          message.success('操作成功', 1.5, ()=>{
            self.props.queryList({
              userId: userData.id,
              page: 1,
              size: 10,
              instCode: userData.instCode
            });
            self.props.search('detailVisible');
          });
        }
      })
      this.setState({
        visibleShow: false,
      });

  }


  loop = (data) => {
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "5":
            data[i] = "交易完成"
            break;
          case "4":
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

  btnText(data){
    let btn;
    if(data.status == '交易完成') {
      btn = <Button type="danger"  onClick={ () => this.setState({visibleShow: true}) } >订单退款</Button>
    }else{
      btn = ''
    }
    return btn;
  }


  render() {
    const {data} = this.props;
    const content = this.loop(data) || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.btnText(content)
              }

              <h4 style={{fontWeight: 600,marginTop:10}}>订单信息</h4>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>订单编号</td>
                    <td>
                      <span>{ content.orderNo }</span>
                    </td>
                    <td>订单状态</td>
                    <td>
                      <span>{ content.status }</span>
                    </td>
                  </tr>
                  <tr>
                    <td>订单金额</td>
                    <td>{ content.amount }</td>
                    <td>支付金额</td>
                    <td>{ content.paidAmount }</td>
                  </tr>
                  <tr>
                    <td>订单时间</td>
                    <td>{ Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }</td>
                    <td>支付时间</td>
                    <td>{ Moment(content.transTime).format("YYYY-MM-DD HH:mm:ss") }</td>
                  </tr>
                  <tr>
                    <td>用户账号</td>
                    <td>{ content.phoneNo }</td>
                    <td>用户姓名</td>
                    <td>{ content.userName }</td>
                  </tr>
                  <tr>
                    <td>订单记录</td>
                    <td colSpan='3'>
                      <Timeline>
                        {
                          content.memberOrderLogs ? content.memberOrderLogs.map((item,index) => {
                            return (
                              <Timeline.Item key={item.id}>
                                { item.memo }
                              </Timeline.Item>
                            )
                          }) : <Timeline.Item>{ '无订单记录' }</Timeline.Item>
                        }
                      </Timeline>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
            <Row className='info'>
              <h4 style={{fontWeight: 600,marginBottom:10,marginTop:5}}>商品信息</h4>
              <table cellSpacing="0" className={Style.mytable1}>
                <tbody>
                  <tr>
                    <td>商品编号</td><td>商品名称</td><td>商品价格</td><td>商品数量</td>
                  </tr>
                  <tr>
                    <td>{ content.memberGoodsSn }</td>
                    <td>{ content.memberGoodsName }</td>
                    <td>{ content.price }</td>
                    <td>{ content.quantity }</td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </Form>
        </div>

        {/* 订单退款 提示框 */}
        <Modal
            title="订单退款"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={ () => this.setState({visibleShow: false}) }
            >
            <p style={{fontSize:16}}>确定订单退款?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.couponManage.saveSeslect,
    data: state.couponManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'couponManage/detail', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'couponManage/search', payload})
    },
    refund(payload = {}) {
      dispatch({type: 'couponManage/refund', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
