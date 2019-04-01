import React, { Component } from 'react';
import {Table,Select,Button,Row,Tabs,Form} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
  }, {
    title: '面积',
    dataIndex: 'area',
    key: 'area'
  },{
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },{
    title: '费率',
    dataIndex: 'rate',
    key: 'rate'
  },{
    title: '金额',
    dataIndex: 'amount',
    key: 'amount'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  //点击关闭详情页面,弹出页面
  sendShow (e) {
    this.props.closeDetail(false,e);
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
  }


  render() {
    const {data} = this.props;
    const content = data || {};
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.sendShow.bind(this, 'amendVisible')}>修改金额</Button>
              <Button type="danger" style={{marginLeft: 10}} onClick={this.sendShow.bind(this, 'labelVisible')}>标记账单</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>账单编号</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>账单类型</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>小区</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>户号</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>账单金额</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>账单状态</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>户主姓名</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>户主电话</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>缴费时间</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>缴费方式</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>缴费人</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>账单起始日</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>负责人</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                    <td>负责人电话</td>
                    <td>
                      <span>HY302001929921</span>
                    </td>
                  </tr>
                  <tr>
                    <td>账单明细</td>
                    <td colSpan='3'>
                        <Table
                          columns={columns}
                          // dataSource={content.data}
                          rowKey={record => record.id}
                          bordered
                          size="middle"/>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>账单记录</td>
                    <td colSpan='3'>
                      <span>HY302001929921</span>
                    </td>
                  </tr> */}
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
    argument: state.userManage.userData,
    data: state.userManage.queryUserMsg,
    roloList: state.roloManage.data
  }
}

function dispatchToProps(dispatch) {
  return {
    queryUser(payload = {}) {
      dispatch({type: 'userManage/queryUser', payload})
    },
    queryRoloList(payload = {}) {
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
    userUpdate(payload = {}) {
      dispatch({
        type: 'userManage/userUpdate',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
