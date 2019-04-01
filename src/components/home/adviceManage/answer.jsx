import React, { Component } from 'react';
import {Button,Row,Form,Tabs,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './detail.less';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
      tabKey: "1"
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id, 
    });
  }

  answer(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      message.destroy();
      if(!values.answer){
        message.warning('答复内容不能为空');
        return false;
      }
      if(this.state.requestStatus){
        self.setState({requestStatus: false},() => {
          self.props.answer({
            params:{
              userId: userData.id,
              status: '1',
              id: self.props.data.id,
              answer: values.answer,
              contactOwner: self.state.tabKey
            },
            func: function(){
              message.success('答复成功', 1.5, ()=>{
                self.props.search('answerVisible');
              });
            }
          })
        })
      }

    })
  }

  tabKey(key){
    this.setState({
      tabKey: key
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.answer.bind(this)}>确定</Button> :
                <Button type="primary">确定</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>是否联系客户</td>
                    <td colSpan={3}>
                      <Tabs activeKey={ this.state.tabKey } onTabClick={this.tabKey.bind(this)} >
                        <TabPane tab="已联系" key="1"></TabPane>
                        <TabPane tab="未联系" key="2"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>答复内容</td>
                    <td colSpan={3}>
                      {getFieldDecorator('answer', {})(
                        <TextArea maxLength={50} placeholder="请输入答复内容" autosize={{ minRows: 2, maxRows: 6 }} />
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
    argument: state.adviceManage.saveSeslect,
    data: state.adviceManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'adviceManage/detail', payload})
    },
    answer(payload,params) {
      dispatch({type: 'adviceManage/answer', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'adviceManage/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
