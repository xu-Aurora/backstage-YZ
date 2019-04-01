import React, { Component } from 'react';
import {Table,Button,Row,Tabs,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import Moment from 'moment';

const TabPane = Tabs.TabPane;

const columns = [
  {
    title: '序号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '认证房屋',
    dataIndex: 'roomName',
    key: 'roomName'
  },{
    title: '认证身份',
    dataIndex: 'type',
    key: 'type',
    render: (text) => {
      let type = '未知身份';
      if(text == 1){
        type = '户主'
      }      
      if(text == 3){
        type = '朋友'
      }
      if(text == 2){
        type = '亲戚'
      }
      if(text == 4){
        type = '租客'
      }
      return type;
    }
  }, {
    title: '认证状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '1'){
        status = '申请中'
      }
      if(text == '2'){
        status = '审批通过'
      }
      if(text == '3'){
        status = '审批拒绝'
      }
      if(text == '4'){
        status = '关系解除（删除）'
      }
      return status;
    }
  },{
    title: '认证时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      tabKey: this.props.argument.status.toString()
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id 
    });
    this.props.authentication({ 
      userId: userData.id, 
      applyUserId: this.props.argument.userId
    });
  }


  //点击启用/禁用弹出模态框
  isForbidden () {
    this.setState({visibleShow: true});
  }
  //确定启用/禁用
  handleOk = (e) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.updateUser({
      params:{
        id: this.props.data.id,
        status: this.state.tabKey,
        userId: userData.id,
        cifUserId: this.props.data.userId
      },
      func: function () {
        message.success('操作成功', 1.5, ()=>{
          self.props.queryList({//列表页面重新请求
            userId: userData.id,
            page: 1,
            size: 10,
            instCode: userData.instCode
          });
          self.setState({ //关闭提示框
            visibleShow: false,
          });
          self.props.cloaeDedail(false)
        });
      }
    })


  }
  //取消启用/禁用
  handleCancel = (e) => {
    this.setState({
        visibleShow: false,
    });
  }
  tabKey(key){
    this.setState({
      tabKey: key
    })
  }

  formart = (content) => {
    const data = [];
    if (content) {
      let roomName1;
      content.forEach((item, keys) => {
        roomName1 = `${item.areaDetail}${item.addressName}`
        data.push({
          keys: keys+1,
          roomName: roomName1,
          type: item.type,
          status: item.status,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
        })
      });
    }
    return data
  }
  loop = (data) => {
    for(let i in data){
      if(i == 'status'){
        data[i] = data[i].toString();
      }
    }
    return data;
  }

  btnStatus = () => {
    const tabkeys = this.state.tabKey;
    let btn;
    switch (tabkeys) {
      case '0':
        btn = '启用'
        break;
      case '1':
        btn = '禁用'
        break;
      case '2':
        btn = '停用'
        break;
      case '3':
        btn = '锁定'
        break;
    
      default:
        break;
    }
    return btn;
  }
  hintStatus = () => {
    const tabkeys = this.state.tabKey;
    let btn;
    switch (tabkeys) {
      case '0':
        btn = '正常'
        break;
      case '1':
        btn = '禁用'
        break;
      case '2':
        btn = '停用'
        break;
      case '3':
        btn = '锁定'
        break;
    
      default:
        break;
    }
    return btn;
  }

  render() {
    const {data,infoData} = this.props;
    const content = data ? this.loop(data) : '';//详情数据
    const contents = this.formart(infoData) || {};//认证信息
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary"  onClick={this.isForbidden.bind(this)}>
                { this.btnStatus() }
              </Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>用户编号</td>
                    <td>
                      { content.userId }
                    </td>
                    <td>用户状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs activeKey={ this.state.tabKey } onTabClick={this.tabKey.bind(this)}>
                        <TabPane tab="启用" key="0"></TabPane>
                        <TabPane tab="禁用" key="1"></TabPane>
                        <TabPane tab="停用" key="2"></TabPane>
                        <TabPane tab="锁定" key="3"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>用户名称</td>
                    <td>{ content.name }</td>
                    <td>用户账号</td>
                    <td>{ content.phoneNo }</td>
                  </tr>
                  <tr>
                    <td>用户昵称</td>
                    <td>{ content.nickname }</td>
                    <td>注册时间</td>
                    <td>{Moment(content.createTime).format("YYYY-YY-DD HH:mm:ss")}</td>
                  </tr>
                </tbody>
              </table>
            </Row>
            <Row className='info'>
              <h4 style={{fontWeight: 600,marginBottom:8}}>认证信息</h4>
              <Table
                loading={this.props.loading}
                columns={columns}
                dataSource={contents}
                rowKey={record => record.keys}
                bordered
                size="middle"/>
            </Row>
          </Form>
        </div>

        {/* 提示框 */}
        <Modal
            title="禁用用户"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定{this.hintStatus()}用户?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.userManage.saveSeslect,
    data: state.userManage.detail,
    infoData: state.userManage.authentication,//认证信息
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'userManage/detail', payload})
    },
    authentication(payload = {}) {
      dispatch({type: 'userManage/authentication', payload})
    },
    updateUser(payload = {}) {
      dispatch({type: 'userManage/updateUser', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'userManage/search', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
