import React, { Component } from 'react';
import {Button,Row,Input,Form,Card,Radio,message } from 'antd';
import {connect} from 'dva';
import Style from './detail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      value: 3
    };
  }

  handelClck = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
        if(this.state.requestStatus){
          if(self.state.value == 5){
            if(!values.refundReviewMemo){
              message.warning('拒绝退款时备注信息必填');
              return false;
            }
          }

          let orderNos;
          if(typeof self.props.argument.orderNo == 'object') {
            orderNos = self.props.argument.orderNo.join(',')
          }else{
            orderNos = self.props.argument.orderNo
          }

          this.setState({requestStatus: false},() => {
            self.props.refundAudit({
              params: {
                orderNos: orderNos,
                refundReviewUserName: userData.name,
                userId: userData.id, 
                type: String(self.state.value), 
                refundReviewMemo: values.refundReviewMemo,
                instCode: userData.instCode
              },
              func: function () {
                message.success('操作成功', 1.5, ()=>{
                  self.props.search('refundVisible');
                });
                
              }
            })
          })

        }

    })
  }


  cancel(){
    this.props.closeRefundCheck()
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
              this.state.requestStatus ? <Button type="primary" onClick={ this.handelClck.bind(this) }>确定</Button> :
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
                        <Radio value={3}>同意退款</Radio>
                        <Radio value={5}>拒绝退款</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注信息">
                        {getFieldDecorator('refundReviewMemo')(
                            <Input placeholder="拒绝退款时备注信息必填" maxLength={50} />
                        )}
                    </FormItem>
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
  }
}

function dispatchToProps(dispatch) {
  return {
    refundAudit(payload = {}) {   //订单退款审核
      dispatch({type: 'orderList/refundAudit', payload})
    },
    queryList(payload = {}) {
      dispatch({type: 'orderList/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
