import React, { Component } from 'react';
import {Button,Row,Input,Form,Card,Radio,message,Modal } from 'antd';
import {connect} from 'dva';
import Style from './detail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
      value: 1
    };
  }

  handleOk = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
        if(self.state.value == 2){
          if(!values.refundConfirmMemo){
            message.warning('选择无需退货时备注信息必填');
            return false;
          }
        }

        let orderNos;
        if(typeof self.props.argument.orderNo == 'object') {
          orderNos = self.props.argument.orderNo.join(',')
        }else{
          orderNos = self.props.argument.orderNo
        }

        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.refundConfirm({
                params: {
                  orderNos: orderNos,
                  userId: userData.id, 
                  refundConfirmUserName: userData.name,
                  type: String(self.state.value), 
                  refundConfirmMemo: values.refundConfirmMemo,
                  instCode: userData.instCode
                },
                func: function () {
                    message.success('操作成功', 1.5, ()=>{
                      self.props.search('refundAffirm');
                    });
                }
              })
          })
        }

    })
  }


  cancel(){
    this.props.closeRefundAffirm()
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {xs: { span: 24 },sm: { span: 3 }},
      wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 20 }}
    };
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            {
              this.state.requestStatus ? <Button type="primary" onClick={ () => this.setState({visibleShow: true}) }>确定</Button> :
              <Button type="primary">保存</Button>
            }
            
            <Button onClick={this.cancel.bind(this)}>取消</Button>
            <Row>
                <Card style={{marginTop:25}}>
                    <FormItem {...formItemLayout} style={{marginBottom:15}}>
                        <p style={{marginLeft:15}}>请在确定收到退货后再进行退款确认，一经确认将直接将退款金额按原路退回！</p>
                    </FormItem>
                    <FormItem {...formItemLayout} label="退款确定">
                      <RadioGroup onChange={ (e) => this.setState({value:e.target.value}) } value={this.state.value}>
                        <Radio value={1}>我已确认收到退货</Radio>
                        <Radio value={2}>无需退货直接退款</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注信息">
                        {getFieldDecorator('refundConfirmMemo')(
                            <Input placeholder="选择无需退货时备注信息必填" maxLength={50} />
                        )}
                    </FormItem>
                </Card>

            </Row>
        </div>

        <Modal
            title="确认退款"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={ () => this.setState({visibleShow: false})}
            >
            <p style={{fontSize:16}}>是否确认退款，确认后款项将原路退回！</p>
        </Modal>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.orderList.saveSeslect,
  }
}

function dispatchToProps(dispatch) {
  return {
    refundConfirm(payload = {}) {   //订单退款确认
      dispatch({type: 'orderList/refundConfirm', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
