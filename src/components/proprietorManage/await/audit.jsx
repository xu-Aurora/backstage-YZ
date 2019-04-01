import React, { Component } from 'react';
import {Button,Row,Form,Tabs,Input,message} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
      tabKey: "2",
      tabKey1: "1",
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id, 
    });
  }

  audit(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      if(this.state.tabKey == '3'){
        message.destroy();
        if(!values.content){
          message.warning('审核备注不能为空');
          return false;
        }
      }
      if(this.state.requestStatus){
        self.setState({requestStatus: false},() => {
          this.props.approve({
            params: {
              userId: userData.id,
              status: this.state.tabKey,
              approveMemo: this.state.tabKey,
              contactOwner: this.state.tabKey1,
              id: this.props.argument.id,
              instCode: userData.instCode
            },
            func: function () {
              message.success('操作成功', 1.5, ()=>{
                self.props.search("auditVisible");
              });
            }
          })
        })
      }


    })
  }

  tabKey(type,key){
    if(type == 'audit'){
      this.setState({
        tabKey: key,
      })
      //切换审核状态,把审核备注设置为空
      this.props.form.setFieldsValue({
        content:''
      })
    }
    if(type == 'connect'){
      this.setState({
        tabKey1: key
      })
    }

  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.audit.bind(this)}>确定</Button> :
              <Button type="primary">确定</Button>
            }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>审核</td>
                    <td colSpan={3}>
                      <Tabs activeKey={ this.state.tabKey } onTabClick={this.tabKey.bind(this,'audit')} >
                        <TabPane tab="通过" key="2"></TabPane>
                        <TabPane tab="拒绝" key="3"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>审核备注</td>
                    <td colSpan={3}>
                      {getFieldDecorator('content')(
                        <Input maxLength={50} placeholder="审核拒绝时该项必填"  />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>是否与业主联系</td>
                    <td colSpan={3}>
                      <Tabs activeKey={ this.state.tabKey1 } onTabClick={this.tabKey.bind(this,'connect')} >
                        <TabPane tab="已联系" key="1"></TabPane>
                        <TabPane tab="未联系" key="2"></TabPane>
                      </Tabs>
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
    argument: state.proprietorManage.saveSeslect,
    data: state.proprietorManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'proprietorManage/detail', payload})
    },
    approve(payload,params) {//审核
      dispatch({type: 'proprietorManage/approve', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'proprietorManage/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
