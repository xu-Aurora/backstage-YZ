import React, {Component} from 'react';
import { Tabs, Input,Icon, Button, Form, Row, Col, Drawer, Table, Select, message } from 'antd';
import Moment from 'moment';
import { connect } from 'dva'
import styles from '../common.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const InputGroup = Input.Group;

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  },
  {
    title: '角色编号',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if (text == 0) {
        status = '启用'
      }
      if (text == 1) {
        status = '禁用'
      }
      return status;
    }
  },
  {
    title: '更新人',
    dataIndex: 'updateUserId',
    key: 'updateUserId'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  }
];

function siblingElems(elem){
  var _elem=elem;
  while((elem=elem.previousSibling)){
          if(elem.nodeType==1){
                elem.removeAttribute('style');
          }
  }
  var elem=_elem;
  while((elem=elem.nextSibling)){
          if(elem.nodeType==1){
                elem.removeAttribute('style');
          }
  }

};

let pageSize1 = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      pageSize: 10,
      saveSelect: false,
      id:'',
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      inputVal: '',
      optionVal: 'id'
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({userId: userData.id, page: '1', size: '10' });
  }
  handelSelect = (record, selected, selectedRows) => {
    this.props.saveSelect(record.alldata);
    this.setState({ saveSelect: record.alldata,id:record.id });
  }
  onSelect(record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({
      detailVisible: true
    })
  }
  formart =(content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
     const data = [];
     if (content.list) {
      content.list.forEach((item, index) => {
        data.push({
          keys: index+1,
          id: item.id,
          name:  item.name,
          status: item.status,
          updateUserId: item.updateUserId || item.createUserId,
          updateTime: Moment(item.updateTime || item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          alldata: item
        })
       });
     }
    return {
      data,
      pagination: {
        total: content.total,
        current: content.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          pageSize1 = pageSize;
          this.props.queryList({
            userId: userData.id, 
            page: current, 
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal
          });
        },
        onChange:(current, pageSize) => {
          this.props.queryList({
            userId: userData.id, 
            page: current, 
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal
          });
        }
      }
    };
  }
  resetDefault(){
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.props.queryList({
          page: 1,
          size: 10,
          userId: this.props.linkID ? this.props.linkID : userData.id
      });
  }
  goPage = (url, event) => {
    event.preventDefault();
    this.setState({
      detailVisible: true
    })
  }

  //点击弹出页面
  sendShow (e) {
    this.setState({
        [e]: true
    })
  }
  //点击关闭页面
  handleCancel(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.queryList({userId: userData.id, page: 1, size: 10})
  }

  //index组件与Detail组件传值
  DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:data})
      }, 500);
    })
  }
  
  inputChange (ev) {
    this.setState({
      inputVal: ev.target.value
    })
  }
  selectChange (ev) {
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }
  handleSearch (val) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    //正则匹配只能输入数字
    const regNum = /^[0-9]*$/;
    this.props.form.validateFields((err, values) => {
      if (values.type === 'id') {
        message.destroy();
        if(!regNum.test(this.state.inputVal)){
          message.warning('角色编号只能输入数字');
          return false;
        }
        this.props.queryList({
          userId: userData.id, 
          id: this.state.inputVal, 
          page: '1', 
          size: pageSize1 
        });
      } else if (values.type === 'name'){
        this.props.queryList({
          userId: userData.id, 
          name: this.state.inputVal, 
          page: '1', 
          size: pageSize1 
        });
      }
    })
  }
  render() {
    const { data } = this.props;
    const content = data ? this.formart(data) : [];
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '10px 24px', backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
          <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)} >
            <TabPane tab="角色管理" key="1">
              <Row >
                <Form layout="horizontal" >
                  <Col span={1} style={{marginRight:'3%'}}>
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增角色</Button>
                  </Col>
                  <Col span={6} key="agment">
                      <Col span={22}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {
                            initialValue: 'id'
                          })(
                            <Select style={{ width: '30%' }}  onChange={this.selectChange.bind(this)}>
                              <Option value="id">角色编号</Option>
                              <Option value="name">角色名称</Option>
                            </Select>
                          )}
                          <Input style={{ width: '70%' }}
                            maxLength={30}
                            value={this.state.inputVal} 
                            onChange={this.inputChange.bind(this)}
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                            placeholder="输入搜索内容" />
                        </InputGroup>
                      </Col>
                  </Col>
                  <Col>
                    <span>
                      <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                    </span>
                  </Col>
                </Form>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        <div style={{width: '100%', padding: 24, backgroundColor: "#FFF", marginTop: 20}}>
          <Row>
            <Table
              loading={this.props.loading}
              columns={columns}
              dataSource={content.data}
              rowKey={record => record.id}
              onRow={(record) => ({
                  onClick: this.onSelect.bind(this, record)
                })
              }
              pagination={content.pagination}
              bordered
              size="middle"
            />
          </Row>
        </div>

        <Drawer
          title="新增角色"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          destroyOnClose
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} />
        </Drawer>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.roloManage.data,
    loading: !!state.loading.models.roloManage,
    linkID: state.login.userMsg.id
  }
}

function dispatchToProps(dispatch) {
  return {
    queryList(payload = {}) {
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
    saveSelect(payload = {}) {
      dispatch({
        type: 'roloManage/save',
        payload
      })
    },
    detele(payload = {}) {
      dispatch({
        type: 'roloManage/details',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
