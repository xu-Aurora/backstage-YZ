import React, { Component } from 'react';
import {Button,Row,Form,Input,Radio,message} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true
    };
  }

  finish(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.completeExplain({
              params: {
                ...values,
                userId: userData.id, 
                id: self.props.argument.id, 
                instCode: userData.instCode
              },
              func: function () {
                  message.success('操作成功', 1.5, ()=>{
                    self.props.search('finishVisible');
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
        <div className={Style.title}>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={ this.finish.bind(this) }>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>处理结果</td>
                    <td colSpan={3}>
                      <Radio defaultChecked={true}>已完成</Radio>
                    </td>
                  </tr>
                  <tr>
                    <td>备注信息</td>
                    <td colSpan={3}>
                        {getFieldDecorator('completeExplain')(
                          <Input maxLength={50} placeholder="请输入备注信息" />
                        )}
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
    completeExplain(payload,params) {   //结单
      dispatch({type: 'affairManage/completeExplain', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'affairManage/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
