import React, { Component } from 'react';
import {Button,Row,Form,Tabs,Input} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      // id: this.props.argument.id, 
    });
  }

  label(){
    //点击跳转编辑页面
    this.props.closeLabel(false);
  }


  render() {
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.label.bind(this)}>保存</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>标记类型</td>
                    <td colSpan={3}>
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="已现金缴费" key="1"></TabPane>
                        <TabPane tab="已退款" key="2"></TabPane>
                        <TabPane tab="其他备注" key="3"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>标记原因</td>
                    <td colSpan={3}>
                        <TextArea placeholder="请输入标记原因" autosize={{ minRows: 2, maxRows: 6 }} />
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
    
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
