import React, { Component } from 'react';
import {Button,Row,Form,Input,Radio,Modal,message} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
    };
  }


  handleOk = () => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if(!values.closeExplain){
        message.warning("关闭订单原因不能为空");
        return false;
      }
      if(this.state.requestStatus){
        self.setState({requestStatus: false},() => {
          self.props.closeById({
            params: {
              ...values,
              userId: userData.id, 
              id: self.props.argument.id, 
              instCode: userData.instCode
            },
            func: function () {
                message.success('操作成功', 1.5, ()=>{
                  self.props.search('closeVisible');
                });
            }
          })
        })
      }

    })
    this.setState({
      visibleShow: false,
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={ () => this.setState({visibleShow: true}) }>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>处理结果</td>
                    <td colSpan={3}>
                      <Radio defaultChecked={true}>关闭订单</Radio>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>备注</td>
                    <td colSpan={3}>
                        {getFieldDecorator('closeExplain')(
                          <Input maxLength={50} placeholder="请输入关闭订单原因" />
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
    argument: state.affairManage.saveSeslect,
  }
}

function dispatchToProps(dispatch) {
  return {
    closeById(payload,params) {
      dispatch({type: 'affairManage/closeById', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
