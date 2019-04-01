import React, { Component } from 'react';
import {Button,Row,Form,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true
    };
  }

  handelClck = () => {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if(!values.name){
        message.destroy()
        message.warning('分组名称不能为空')
        return false;
      }
      if(this.state.requestStatus){
        self.setState({requestStatus: false},()=>{
          this.props.addGroup({
            params: {
              userId: userData.id,
              name: values.name,
            },
            func: function(){
              message.success('操作成功!', 1.5, function() {
                self.props.search('addGroupVisible');
              });
            }
          })
        })
        
      }

    })
  }

  cancel(){
    this.props.editGroup()
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={ this.handelClck }>确定</Button> :
                <Button type="primary">确定</Button>
              }
              
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>分组名称</td>
                    <td colSpan={3}>
                        {getFieldDecorator('name')(
                          <Input maxLength={5} placeholder="请输入分组名称" />
                        )}
                    </td>
                  </tr>

                </tbody>
              </table>
            </Row>
          </Form>
        </div>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {

  }
}

function dispatchToProps(dispatch) {
  return {
    addGroup(payload = {}) {
      dispatch({type: 'fodderManage/addGroup', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
