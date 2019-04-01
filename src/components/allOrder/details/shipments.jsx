import React, { Component } from 'react';
import {Button,Row,Input,Form,Card,Tabs,Select,Checkbox,Col,message } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Option } = Select;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
      tabVal: ''
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

  regx(item) {
    //手机号码正则
    let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    //正则匹配只能输入数字
    let regNum = /^[0-9]*$/;
    //正则匹配只能输入数字和字母
    let reg = /^[a-z0-9]+$/i;
    if(this.props.data.way == '1'){
      if(!item.distributorName){
        message.warning("配送员名称不能为空")
        return false
      }
      if(!item.distributorPhone){
        message.warning("配送员电话不能为空")
        return false
      }
      if(!regPhone.test(item.distributorPhone)){
        message.warning('请输入正确的手机格式' );
        return false
      }
    }
    if(this.props.data.way == '2'){
      if(!item.logisticsName){
        message.warning("请选择快递公司")
        return false
      }
      if(!item.logisticsNo){
        message.warning("快递单号不能为空")
        return false
      }
      if(!item.logisticsNo){
        message.warning("快递单号不能为空")
        return false
      }
      if(!regNum.test(item.logisticsNo)){
        message.warning("快递单号只能输入数字")
        return false
      }
    }
    if(this.props.data.way == '3'){
      if(this.state.checkbox == false){
        message.warning("自取确认未选中")
        return false
      }
      if(!item.pickUpNo){
        message.warning("自取编号不能为空")
        return false
      }
      if(!reg.test(item.pickUpNo)){
        message.warning("自取编号只能输入数字和字母")
        return false
      }
      if(item.pickUpNo.length < 4 || item.pickUpNo.length > 8){
        message.warning("自取编号长度为4-8位")
        return false
      }
    }
    return true;
  }

  handelClck(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.delivery({
              params: {
                ...values,
                orderNo: this.props.argument.orderNo,
                userId: userData.id, 
                way: self.props.data.way
              },
              func: function () {
                  message.success('操作成功', 1.5, ()=>{
                    self.props.search('shipmentsVisible');
                  });
              }
            })
          })
        }

      }

    })

  }


  handleTal(val){
    this.setState({
      tabVal: val
    })
    this.props.form.setFieldsValue({
      logisticsName: '',
      distributorName: '',
      distributorPhone: '',
      logisticsNo: '',
      pickUpNo: ''
    })
  }
  cancel(){
    this.props.closeShipments()
  }



  render() {
    const {data} = this.props;
    const content = data ? data : {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {xs: { span: 24 },sm: { span: 3 }},
      wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 20 }}
    };
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            {
              this.state.requestStatus ? <Button type="primary" onClick={ this.handelClck.bind(this) }>确定</Button> :
              <Button type="primary">确定</Button>
            }
            
            <Button onClick={this.cancel.bind(this)}>取消</Button>
            <Row>
                <Card style={{margin:'20px 0 10px 0'}}>
                    <FormItem {...formItemLayout} label="订单编号">
                        <span>{ content.orderNo }</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="订单时间">
                        <span>{ Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="收货信息">
                        <span>{ content.receiptName }，{ content.receiptPhone }，{ content.address }</span>
                    </FormItem>
                </Card>
                <Card className="shipments">
                  <Tabs activeKey={ content.way }>
                      <TabPane tab="" key="1">
                        <FormItem {...formItemLayout} label="配送方式">
                          <span>物业配送</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="配送员名称" style={{marginBottom:15}}>
                            {getFieldDecorator('distributorName')(
                                <Input  style={{width:'35%'}} placeholder="输入配送员名称" maxLength={10} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="配送员电话">
                            {getFieldDecorator('distributorPhone')(
                                <Input  style={{width:'35%'}} placeholder="输入配送员电话" maxLength={11} />
                            )}
                        </FormItem>
                      </TabPane>
                      <TabPane tab="" key="2">
                          <FormItem {...formItemLayout} label="配送方式">
                            <span>快递</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="快递公司" style={{marginBottom:15}}>
                              {getFieldDecorator('logisticsName')(
                                  <Select placeholder="请选择快递公司" style={{width:'35%'}}>
                                      <Option value="申通快递">申通快递</Option>
                                      <Option value="中通快递">中通快递</Option>
                                      <Option value="圆通快递">圆通快递</Option>
                                      <Option value="天天快递">天天快递</Option>
                                      <Option value="顺丰快递">顺丰快递</Option>
                                  </Select>
                              )}
                          </FormItem>
                          <FormItem {...formItemLayout} label="快递单号">
                              {getFieldDecorator('logisticsNo')(
                                  <Input  style={{width:'35%'}} placeholder="输入快递单号" maxLength={50} />
                              )}
                          </FormItem>
                      </TabPane>
                      <TabPane tab="" key="3">
                          <FormItem {...formItemLayout} label="配送方式">
                            <span>买家自取</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="自取地信息" style={{marginBottom:15}}>
                              <span>{ content.address }</span>
                          </FormItem>
                          <FormItem {...formItemLayout} label="自取确认" style={{marginBottom:15}}>
                            <Checkbox 
                              checked={this.state.checkbox} 
                              onChange={ (e) => this.setState({checkbox: e.target.checked}) }>订单已到自取点
                            </Checkbox>
                          </FormItem>
                          <FormItem {...formItemLayout} label="自取编号">
                              {getFieldDecorator('pickUpNo')(
                                  <Input maxLength={8} style={{width:'35%'}} placeholder="输入自取编号" />
                              )}
                          </FormItem>
                      </TabPane>
                  </Tabs>
                </Card>

                {/* <Col style={{textAlign:'center',marginTop:50}}>
                  { this.btnTypes(content.way) }
                </Col> */}
            </Row>
        </div>

      </div>
    )
  }
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
    delivery(payload = {}) {
      dispatch({type: 'orderList/delivery', payload})
    }, 

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
