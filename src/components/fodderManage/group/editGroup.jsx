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
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if(this.state.requestStatus){
        if(!values.name){
          message.destroy()
          message.warning('分组名称不能为空')
        }
        self.setState({requestStatus: false},() =>{
          self.props.updateGroup({
            params: {
              userId: userData.id,
              name: values.name,
              id: self.props.groupDataId
            },
            func: function(){
              message.success('操作成功!', 1.5, function() {
                self.props.search('editGroupVisible')
                
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
    const {data} = this.props;
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
    updateGroup(payload = {}) {
      dispatch({type: 'fodderManage/updateGroup', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
