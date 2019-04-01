import React, {Component} from 'react';
import {Tabs,Input,Icon,Button,Form,Modal,Row,Col,Table,Select,message,Drawer} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../common.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;

let pageSize1 = 10;

function siblingElems(elem) {

  var _elem = elem;
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType == 1) {
      elem.removeAttribute('style');
    }
  }
  var elem = _elem;
  while ((elem = elem.nextSibling)) {
    if (elem.nodeType == 1) {
      elem.removeAttribute('style');
    }
  }

};


const columns = [
  {
    title: '序号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '用户编号',
    dataIndex: 'id',
    key: 'id'
  },{
    title: '用户名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '所属机构',
    dataIndex: 'instName',
    key: 'instName'
  }, {
    title: '联系电话',
    dataIndex: 'phoneNo',
    key: 'phoneNo'
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  }, {
    title: '用户状态',
    dataIndex: 'status',
    key: 'status'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      inputVal: '',
      optionVal: 'id'
    };
  }
  componentWillMount() { 
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
        userId: userData.id,
        page: 1,
        size: 10,
        instCode: userData.instCode
    });
  }

  onSelect(record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true});
  }
  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    let self = this
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
        }
        data.push({
          keys: key,
          id: item.id,
          name: item.name,
          status: item.status == '0' ? '正常' : '注销',
          phoneNo: item.phoneNo,
          instName: item.instName,
          updateUserId: item.updateUserId || item.createUserId,
          updateTime: Moment(item.updateTime || item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          alldata: item
        })
      });
    }
    const totals = content.total;
    return {
      data,
      pagination: {
        total: content.total,
        showTotal: totals => `总共 ${totals} 个项目`,
        current: content.pageNum,
        // pageSize: content.size > this.state.pageSize ? content.size : this.state.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          pageSize1 = pageSize;
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            instCode: userData.instCode
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            instCode: userData.instCode
          });
        }
      }
    };
  }
  goPage = (url, event) => {
    event.preventDefault();
    this.setState({
      detailVisible: true
    })
  }
  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId: this.props.linkID || userData.id,
      page: 1,
      size: 10,
      instCode: userData.instCode
    });
  }
  //点击弹出页面
  sendShow (e) {
    this.setState({
        [e]: true
    })
  }
  //点击关闭页面
  handleCancel2(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    }) 
    this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode})
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
        if(!regNum.test(this.state.inputVal)){
          message.warning('角色编号只能输入数字');
          return false;
        }
        this.props.queryList({userId: userData.id, id: this.state.inputVal, page: '1', size: pageSize1, instCode: userData.instCode});
      } else if (values.type === 'name'){
        this.props.queryList({userId: userData.id, name: this.state.inputVal, page: '1', size: pageSize1, instCode: userData.instCode});
      }
    })
  }
  render() {
    const {data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const content = data ? this.formart(data) : [];
    return (
      <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
      <div style={{width: '100%', padding: '10px 24px', backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
          <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
            <TabPane tab="管理员管理" key="1">
              <Row >
                <Form className="ant-advanced-search-form" layout="horizontal">
                  <Col span={1} style={{marginRight:'3%'}}>
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight:20}}>新增用户</Button>
                  </Col>
                  <Col span={6} key="agment">
                    <Col span={22}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {
                          initialValue: 'id'
                        })(
                          <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                            <Option value="id">用户编号</Option>
                            <Option value="name">用户姓名</Option>
                          </Select>
                        )}
                        <Input style={{ width: '70%' }}
                          maxLength={50}
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
        <div style={{width: '100%', padding: 24,backgroundColor: "#FFF",marginTop: 20}}>
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
              size="middle"/>
          </Row>
        </div>

        <Drawer
          title="新增用户"
          width="45%"
          placement="right"
          onClose={this.handleCancel2.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          destroyOnClose
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="用户详情"
          width="45%"
          placement="right"
          onClose={this.handleCancel2.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          destroyOnClose
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑"
          width="45%"
          placement="right"
          onClose={this.handleCancel2.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          destroyOnClose
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
    data: state.adminManage.list,
    loading:state.loading.models.adminManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'adminManage/search', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'adminManage/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
