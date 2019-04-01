import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Form,Card,Select,message,Input } from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;
const { TextArea } = Input;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      closeReason: '',
    };
  }


  handleSel(val){
    this.setState({
      closeReason: val
    })
  }


  confirm(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if(this.state.closeReason == ''){
        message.warning('取消原因不能为空');
        return 
      }
  
      if(this.state.requestStatus){
        this.setState({requestStatus: false},() => {
          this.props.cancelOrder({
            params: {
              ...values,
              userId: userData.id,
              closeReason: this.state.closeReason,
              serviceOrderNo: this.props.argument.serviceOrderNo
            },
            func:  () => {
              message.success('操作成功', 1.5, () => {
                this.props.search('cancelOrderVisible');
              });
            }
          })
        })
      }
    })



  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            {
              this.state.requestStatus ? <Button type="primary" onClick={ this.confirm.bind(this) }>确定</Button> :
              <Button type="primary">确定</Button>
            }
            
            <Button onClick={ () => this.props.close() }>取消</Button>
            <Row>

              <Card className="cards" style={{marginTop:20}}>
                <div style={{marginBottom:20}}><span style={{color:'red'}}>*</span>&nbsp;取消原因 : &nbsp;
                  <Select placeholder="请选择" onChange={ this.handleSel.bind(this) } style={{width:250}}>
                    <Option value="1">人员无法安排/技能不足</Option>
                    <Option value="2">缺货/补货</Option>
                    <Option value="3">改期/之后再预约</Option>
                    <Option value="4">客户不想要了</Option>
                  </Select>
                </div>
                <div>
                  备注原因&nbsp;:&nbsp; &nbsp; &nbsp; 
                  {getFieldDecorator('closeMemo', {})(
                    <TextArea placeholder="请输入备注" rows={3} style={{width: '70%'}} />
                  )}
                </div>

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
    argument: state.appointmentManage.saveSeslect,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'appointmentManage/serchDetail', payload})
    },
    cancelOrder(payload = {}) {
      dispatch({type: 'appointmentManage/cancelOrder', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
