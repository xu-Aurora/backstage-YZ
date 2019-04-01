import React, { Component } from 'react';
import {Table,Row,Form} from 'antd';
import Moment from 'moment';
import {connect} from 'dva';
import Style from './detail.less';


const columns = [
  {
    title: '序号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '时间',
    dataIndex: 'transTime',
    key: 'transTime'
  },{
    title: '类型',
    dataIndex: 'borrowing',
    key: 'borrowing',
    render: (text) => {
      let type = '未知类型';
      if(text == 'D') {
        type = '消费'
      }
      if(text == 'C') {
        type = '获取'
      }
      return type;
    }
  }, {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount',
  },{
    title: '粮票余额',
    dataIndex: 'balance',
    key: 'balance'
  },{
    title: '备注',
    dataIndex: 'memo',
    key: 'memo'
  }
];

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
      id: this.props.argument.id
    });
  }


  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    if (content.accountDetails) {
      content.accountDetails.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
        }
        data.push({
          keys: key,
          id: item.id,
          borrowing: item.borrowing,
          amount: item.amount,
          balance: item.balance,
          transTime: Moment(item.transTime).format("YYYY-MM-DD HH:mm:ss"),
          memo: item.memo
        })
      });
    }
    const totals = content.total;
    return {
      data
      // pagination: {
      //   total: content.total,
      //   showTotal: totals => `总共 ${totals} 个项目`,
      //   current: content.pageNum,
      //   showSizeChanger: true,
      //   showQuickJumper: true,
      //   onShowSizeChange: (current, pageSize) => {
      //     this.props.queryDetail({
      //       userId: userData.id,
      //       page: current,
      //       size: pageSize,
      //       id: this.props.argument.id,
      //       instCode: userData.instCode,
      //     });
      //   },
      //   onChange: (current, pageSize) => {
      //     this.props.queryDetail({
      //       userId: userData.id,
      //       page: current,
      //       size: pageSize,
      //       id: this.props.argument.id,
      //       instCode: userData.instCode,
      //     });
      //   }
      // }
    };
  }

  loop = (data) => {
    for(let i in data){
      if(i == 'level'){
        switch (data[i]) {
          case "0":
            data[i] = 'V0'
            break;
          case "1":
            data[i] = 'V1'
            break;
          case "2":
            data[i] = 'V2'
            break;
          case "3":
            data[i] = 'V3'
            break;
          case "4":
            data[i] = 'V4'
            break;
          case "5":
            data[i] = 'V5'
            break;
          case "6":
            data[i] = 'V6'
            break;
          case "7":
            data[i] = 'V7'
            break;
          case "8":
            data[i] = 'V8'
            break;
        }
      }
    }
    return data;
  }

  render() {
    const {data} = this.props;
    const content = this.loop(data) || {};
    const content1 = data ? this.formart(data) : [];
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>用户编号</td>
                    <td>
                      { content.userId }
                    </td>
                    <td>用户名称</td>
                    <td>{ content.name }</td>
                  </tr>
                  <tr>
                    <td>用户账号</td>
                    <td>{content.phoneNo}</td>
                    <td>会员等级</td>
                    <td>{ content.level }</td>
                  </tr>
                  <tr>
                    <td>注册时间</td>
                    <td>{ Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }</td>
                    <td>成为会员时间</td>
                    <td>{ Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }</td>
                  </tr>
                  {/* <tr>
                    <td>粮票使用额</td>
                    <td>214</td>
                    <td></td>
                    <td></td>
                  </tr> */}
                </tbody>
              </table>
            </Row>
            <Row className='info'>
              <h4 style={{fontWeight: 600,marginBottom:15}}>粮票记录</h4>
              <Table
                columns={columns}
                dataSource={content1.data}
                // pagination={content1.pagination}
                rowKey={record => record.id}
                bordered
                size="middle"/>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.memberManage.saveSeslect,
    data: state.memberManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'memberManage/detail', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
