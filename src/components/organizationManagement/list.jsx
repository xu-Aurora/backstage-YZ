import React, {Component} from 'react';
import { Tabs, Input,Icon, Button, Form, Modal, Row, Col, Drawer, Table, Select, message } from 'antd';
import Moment from 'moment';
import { connect } from 'dva'
import styles from './style.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

let pageSize1 = 10;

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  },
  {
    title: '机构编号',
    dataIndex: 'code',
    key: 'code',
    width: 120
  },
  {
    title: '机构名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '机构类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    render: (text) => {
      let status = '未知类型';
      if(text == "0"){
        status = '平台机构'
      }
      if(text == "1"){
        status = '社区物业管理'
      }
      if(text == "2"){
        status = '市场物业管理'
      }
      if(text == "3"){
        status = '体验中心'
      }
      return status;
    }
  },
  {
    title: '机构状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (text) => {
      let status = '未知状态';
      if(text == "0"){
        status = '启用'
      }
      if(text == "1"){
        status = '禁用'
      }
      return status;
    }
  },
  {
    title: '上机机构',
    dataIndex: 'parentName',
    key: 'parentName',
    width: 200
  },
  {
    title: '联系人名称',
    dataIndex: 'linkMan',
    key: 'linkMan',
    width: 120
  },
  {
    title: '联系人电话',
    dataIndex: 'linkPhone',
    key: 'linkPhone',
    width: 120
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      showScreen: false,
      isSelect: false,
      pageSize: 10,
      saveSelect: false,
      visibleShow: false,
      id:'',
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      inputVal: '',
      optionVal: 'code',
      status: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getInstitutions({userId: userData.id, page: '1', size: '10', code: this.props.treeInfo ? this.props.treeInfo.code: '' });
  }
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveInstitutions(record.alldata);
    this.setState({
        detailVisible: true
    })
  }
  formart =(content) => {
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
          code: item.code,
          name: item.name,
          type: item.type,
          status: item.status,
          parentName: item.parentName,
          linkMan: item.linkMan,
          linkPhone: item.linkPhone,
          createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
          createUserId: item.createUserId,
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
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          pageSize1 = pageSize;
          this.props.getInstitutions({
            userId: userData.id, 
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            status: this.state.status,
            code: this.props.treeInfo ? this.props.treeInfo.code: ''
          });
        },
        onChange:(current, pageSize) => {
          this.props.getInstitutions({
            userId: userData.id, 
            page: current, 
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            status: this.state.status,
            code: this.props.treeInfo ? this.props.treeInfo.code: ''
          });
        }
      }
    };
  }
  //点击删除
  goDelete () {
    let self = this
    if (self.state.isSelect) {
        this.setState({
            visibleShow: true
        });

    } else {
         message.error('未选择表中数据!', 1.5)
    }
  }
  handleOk = (e) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.setState({
        visibleShow: false,
    })
    self.props.detele({
        params: {
            id: self.state.id,
            userId: userData.id,
        },
        func: function () {
            message.success('删除成功!', 1.5, function () {
                self.props.queryList({page: 1, size: 10, userId: userData.id});
            })
        }
    });
  }
  handleCancel = (e) => {
      this.setState({
          visibleShow: false,
      });
  }

  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen
    });
  };
  //点击弹出页面
  sendShow (e) {
    this.setState({
        [e]: true
    })
  }
  //点击关闭页面
  handleCancel1(e)  {
    this.setState({
        [e]: false
    })
  }

  //List组件与Detail组件传值
  DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:data})
      }, 500);
    })
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.getInstitutions({userId: userData.id, page: '1', size: '10', code: this.props.treeInfo ? this.props.treeInfo.code: '' });
  }

  selectChange (ev) {
    this.setState({
        inputVal: '',
        optionVal: ev
    })
  }
  inputChange (ev) {
    this.setState({
      inputVal: ev.target.value
    })
  }
  handleSelectChange (type, value) {
    this.setState({
      [type]: value
    })
  } 
  handleSearch () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
        if (values.type === 'code') {
            this.props.getInstitutions({
                userId: userData.id,
                code: this.state.inputVal,
                page: '1',
                size: pageSize1,
                status: this.state.status
            })
        } else if (values.type === 'name') {
            this.props.getInstitutions({
                userId: userData.id,
                name: this.state.inputVal,
                page: '1',
                size: pageSize1,
                status: this.state.status
            })
        }
    })
  }
  render() {
    const { institutionsData } = this.props;
    const content = institutionsData ? this.formart(institutionsData) : [];
    const { getFieldDecorator } = this.props.form;
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col span={21}>
            <FormItem
              label={(<span style={{fontSize: 14}}>机构状态</span>)}
              labelCol={{span: 2}}
              wrapperCol={{span: 5}}>
                  <Select 
                    style={{ width: '100%'}} 
                    onChange={this.handleSelectChange.bind(this, 'status')}
                    value={this.state.status}
                  >
                    <Option value="">全部</Option>
                    <Option value="0">启用</Option>
                    <Option value="1">禁用</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col span={3}>
              <Col span={14}>
                  <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
              </Col>         
              <Col>
                <a style={{color: '#1890ff',lineHeight:2.3,fontSize: 14  }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </Col>
          </Col>
        </Row>
      )
    }
    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '20px 0 10px 24px', backgroundColor: "#FFF"}}>
              <Row >
                  <Col span={21} key="agment">
                    <Col span={16}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {
                          initialValue: 'code'
                        })(
                          <Select style={{ width: '20%' }} onChange={this.selectChange.bind(this)}>
                            <Option value="code">机构编号</Option>
                            <Option value="name">机构名称</Option>
                          </Select>
                        )}
                        <Input style={{ width: '37%' }}
                          maxLength={50}
                          value={this.state.inputVal} 
                          onChange={this.inputChange.bind(this)} 
                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                          placeholder="输入搜索内容" />
                      </InputGroup>
                    </Col>
                  </Col>
                  <Col span={3} style={{display:showScreen?'none':''}}>
                    <Col span={14}>
                        <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                    </Col>  
                    <Col span={10}>
                      <a style={{color: '#1890ff',lineHeight:2.3,fontSize: 14 }} onClick={this.toggleForm}>
                        展开 <Icon type="down" />
                      </a>
                    </Col>
                  </Col>
              </Row>
              { Element }
        </div>
        <div style={{width: '100%', padding: '10px 24px 24px 24px', backgroundColor: "#FFF"}}>
                <Table
                  className={styles.tableList}
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
                  // scroll={{ y: true}}
                  size="middle"
                />
        </div>

        <Drawer
          title="新增广告"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel1.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel1.bind(this, 'detailVisible')}
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
          destroyOnClose
          placement="right"
          onClose={this.handleCancel1.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          destroyOnClose
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} />
        </Drawer>

        <Modal
            title="删除"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <p>确定删除所选项?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    institutionsData: state.organizationManagement.institutionsData,
    treeInfo: state.organizationManagement.treeInfo,

    data: state.roloManage.data,
    loading: !!state.loading.models.roloManage,
    linkID: state.login.userMsg.id
  }
}

function dispatchToProps(dispatch) {
  return {
    getInstitutions(payload = {}) {
      dispatch({
        type: 'organizationManagement/getInstitutions',
        payload
      })
    },
    saveInstitutions(payload = {}) {
      dispatch({
        type: 'organizationManagement/saveInstitutions',
        payload
      })
    },


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
