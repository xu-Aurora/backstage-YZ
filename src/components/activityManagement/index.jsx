import React, {Component} from 'react';
import {Tabs,Input,Icon,Button,Form,Row,Col,Table,Select,Drawer,DatePicker,Modal} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../common.less';

import Add from './add.jsx';
import Detail from './details';
import Edit from './edit.jsx';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

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
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '活动编号',
    dataIndex: 'code',
    key: 'code',
    width: 200
  },{
    title: '活动名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '活动开始时间',
    dataIndex: 'effectiveTime',
    key: 'effectiveTime'
  },  {
    title: '活动结束时间',
    dataIndex: 'closeTime',
    key: 'closeTime'
  },{
    title: '活动类型',
    dataIndex: 'type',
    key: 'type',
    render: function (item) {
      if(item == '1') {
        return 'H5'
      }
      if(item == '2') {
        return '报名'
      }
    }
  }, {
    title: '活动状态',
    dataIndex: 'statusName',
    key: 'statusName'
  }, {
    title: '参与条件',
    dataIndex: 'condition',
    key: 'condition'
  },{
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },{
    title: '适用区域',
    dataIndex: 'areas',
    key: 'areas'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      pageSize: 10,
      showScreen: false,
      id: '',
      name: '',
      ScreenVal: '',
      isSelect: false,
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      type: '',
      statusName: '',
      startTime: '',
      endTime: '',
      inputVal: '',
      optionVal: 'code',
      modalShow: false
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
  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    let self = this;
    if (content.list) {
      content.list.forEach((item, keys) => {
        //使用区域
        let areas;
        if(item.comNames) {
          areas = item.comNames
        }else{
          areas = '全部区域'
        }
        //参与条件
        let user;//角色类型
        if(item.userType == '1'){
          user = '全部'
        }else if(item.userType == '2'){
          user = '认证用户'
        }else if(item.userType == '3'){
          user = '户主'
        }else{
          user = '游客'
        }
        let member;//会员级别
        if(item.memberType == '1'){
          member = 'V1以上会员'
        }else if(item.memberType == '2'){
          member = 'V2以上会员'
        }else if(item.memberType == '3'){
          member = 'V3以上会员'
        }else if(item.memberType == '4'){
          member = 'V4以上会员'
        }else if(item.memberType == '5'){
          member = 'V5以上会员'
        }else{
          member = 'V6以上会员'
        }

        data.push({
          keys: keys+1,
          areas: areas,
          id: item.id,
          code: item.code,
          name: item.name,
          effectiveTime: item.effectiveTime ? Moment(item.effectiveTime).format("YYYY-MM-DD HH:mm:ss") :'',
          closeTime: item.closeTime ? Moment(item.closeTime).format("YYYY-MM-DD HH:mm:ss") :'',
          type: item.type,
          statusName: item.statusName,
          condition: `${user},${member}`,
          createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") :'',
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
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            type: this.state.type,
            queryStatus: this.state.statusName,
            instCode: userData.instCode
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            type: this.state.type,
            queryStatus: this.state.statusName,
            instCode: userData.instCode
          });
        }
      }
    };
  }

  //活动时间
  timeRange (type, date) {
    let time;
    if(date){
        time = date._d.getTime();
    }
    if (type === 'x1') {
        this.setState({startTime: time})
    }
    if (type === 'x2') {
        this.setState({endTime: time})
    }
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
  handleSelectChange = (type, value) => {
    if (type === 'type') {
        this.setState({type: value})
    }
    if (type === 'statusName') {
        this.setState({statusName: value})
    }
  }
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({
        detailVisible: true
    })
  }
  handleSearch () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if (values.type == 'code') {
        this.props.queryList({
          userId: userData.id, 
          code: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          type: this.state.type,
          queryStatus: this.state.statusName,
          page: '1',
          size: pageSize1,
          instCode: userData.instCode
        });
      } else if (values.type == 'name') {
        this.props.queryList({
          userId: userData.id, 
          name: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          type: this.state.type,
          queryStatus: this.state.statusName,
          page: '1',
          size: pageSize1,
          instCode: userData.instCode
        });
      }
    })

  }
  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      type: '',
      statusName: '',
      startTime: '',
      endTime: ''
    });
  };

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

  //确定导出数据
  confirm = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const startTime = this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'';
    const endTime = this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'';
    let LINK;
    this.props.form.validateFields((err, values) => {
      if (values.type == 'code') {
        LINK = `/backstage/activity/ExcelActivity?code=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&type=${this.state.type}&queryStatus=${this.state.statusName}&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
      }else if (values.type == 'name') {
        LINK = `/backstage/activity/ExcelActivity?name=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&type=${this.state.type}&queryStatus=${this.state.statusName}&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
      }
    })
    window.location.href = LINK;
    this.setState({modalShow:false});
  }

  render() {
    const {data} = this.props;
    const {showScreen} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 4 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 20 },xxl: { span: 22 }}
    };
    const formItemLayout1 = {
      labelCol: {xl: { span: 7 },xxl: { span: 7 }},
      wrapperCol: {xl: { span: 14 },xxl: { span: 13 }}
    };
    const content = data ? this.formart(data) : [];
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={5} xxl={4}>
            <FormItem
              label="活动类型"
              {...formItemLayout1}>
                  <Select
                    style={{ width: '100%'}} 
                    value={this.state.type}
                    onChange={this.handleSelectChange.bind(this, 'type')}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">H5</Option>
                    <Option value="2">报名</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem
              label="活动状态"
              {...formItemLayout1}>
                  <Select 
                  style={{ width: '100%'}} 
                  value={this.state.statusName}
                  onChange={this.handleSelectChange.bind(this, 'statusName')}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">未开始</Option>
                    <Option value="2">进行中</Option>
                    <Option value="3">已结束</Option>
                    <Option value="4">已关闭</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col xl={9} xxl={13}>
            <FormItem label="活动时间" {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x1')}
                    style={{width:'40%'}}
                  />
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x2')}
                    style={{width:'40%'}}
                  />
            </FormItem>
          </Col>
          <Col xl={5} xxl={3}>
                <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                <Button type="primary" style={{marginRight:10}} onClick={() => this.setState({modalShow:true})}>导出</Button>
                <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
          </Col>
        </Row>
      )
    }
    return (
      <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
        <div style={{width: '100%', padding: '10px 24px', backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="活动列表" key="1">
              <Row >
                  <Col span={2}>
                      <Button type="primary" 
                        onClick={this.sendShow.bind(this, 'addVisible')} 
                        style={{marginRight: 20,backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>创建活动</Button>
                  </Col>
                  <Col xl={17} xxl={19}>
                    <Col span={16}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {initialValue: 'code'})(
                          <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                            <Option value="code">活动编号</Option>
                            <Option value="name">活动名称</Option>
                          </Select>
                        )}
                        <Input style={{ width: 240}}
                          maxLength={50}
                          value={this.state.inputVal} 
                          onChange={this.inputChange.bind(this)}  
                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                          placeholder="输入搜索内容" />
                      </InputGroup>
                    </Col>
                  </Col>
                  
                  <Col xl={5} xxl={3} style={{display:showScreen?'none':''}}>
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                        <Button type="primary" style={{marginRight:10}} onClick={() => this.setState({modalShow:true})}>导出</Button>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          展开 <Icon type="down" />
                        </a>
                  </Col>
              </Row>
              { Element }
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

        <Modal
            title="导出数据"
            visible={this.state.modalShow}
            onOk={this.confirm.bind(this,content)}
            onCancel={ () => this.setState({modalShow:false}) }
            >
            <p style={{fontSize:16}}>确定导出全部数据?</p>
        </Modal>

        <Drawer
          title="新增活动"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'editVisible')}
          destroyOnClose
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
    data: state.activityManagement.list,
    loading: !!state.loading.models.activityManagement,
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'activityManagement/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'activityManagement/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
