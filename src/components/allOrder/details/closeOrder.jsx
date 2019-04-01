import React, { Component } from 'react';
import {Button,Row,Form,Input,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from './detail.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
    };
  }

  cancel(){
    this.props.closeOrder()
  }


  handleOk = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      if(!values.closeMemo){
        message.warning("备注信息不能为空");
        return false;
      }
      this.props.closeOrderId({
        params: {
          userId: userData.id,
          closeMemo: values.closeMemo,
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
    })


  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              <Button type="primary" onClick={ () => this.setState({visibleShow: true}) }>确定</Button>
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>备注信息</td>
                    <td>
                      {getFieldDecorator('closeMemo')(
                        <Input placeholder="请输入备注信息" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
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
function mapStateToProps(state, ownProps) {
  return {
    data: state.orderList.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    closeOrderId(payload,params) {
      dispatch({type: 'orderList/closeOrder', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
