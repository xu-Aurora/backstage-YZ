import React, { Component } from 'react';
import {Button,Row,Form,DatePicker,Input,message} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      transactorTime: ''
    };
  }

  //时间
  timeRange = (date) => {
    let time
    if(date){
        time = date._d.getTime();
    }
    this.setState({transactorTime: time})
  }

  regx (item) {
    //手机号码正则
    let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    message.destroy();
    if(!item.transactorName){
      message.warning('处理人名称不能为空');
      return 
    }
    if(!item.transactorPhone){
      message.warning('处理人电话不能为空');
      return 
    }
    if(!regPhone.test(item.transactorPhone)){
      message.warning('处理人电话格式不正确');
      return 
    }
    return true;
  }

  send(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.assignById({
                params: {
                  ...values,
                  userId: userData.id, 
                  id: self.props.argument.id, 
                  transactorTime: this.state.transactorTime ? Moment(this.state.transactorTime).format("YYYY-MM-DD HH:mm:ss") : '', 
                  instCode: userData.instCode
                },
                func: function () {
                    message.success('操作成功', 1.5, ()=>{
                      self.props.search('sendVisible');
                    });
                }
              })
          })
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={ this.send.bind(this) }>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>处理人员名称</td>
                    <td colSpan={3}>
                        {getFieldDecorator('transactorName')(
                          <Input placeholder="请输入处理人员名称" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>处理人员电话</td>
                    <td colSpan={3}>
                        {getFieldDecorator('transactorPhone')(
                          <Input placeholder="请输入处理人员电话" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>处理要求</td>
                    <td colSpan={3}>
                        {getFieldDecorator('transactorExplain')(
                          <Input placeholder="对处理人员的相关说明" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>处理时间</td>
                    <td colSpan={3}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={this.timeRange.bind(this)}
                        style={{width: '50%'}}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
        </div>

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
    assignById(payload,params) {  //派单
      dispatch({type: 'affairManage/assignById', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'affairManage/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
