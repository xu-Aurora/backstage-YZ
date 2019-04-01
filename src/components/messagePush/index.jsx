import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Icon,Row,Col,Table,Select,message,Drawer,DatePicker,Modal} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../common.less';

import Details from './detail.jsx';
import Add from './add.jsx';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;


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

let pageSize1 = 10;

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '推送时间',
    dataIndex: 'sendTime',
    key: 'sendTime'
  },{
    title: '推送内容',
    dataIndex: 'content',
    key: 'content'
  }, {
    title: '消息类型',
    dataIndex: 'newsType',
    key: 'newsType',
    render: (text) => {
      let status = '未知类型';
      if(text == '1'){
        status = '消息'
      }
      if(text == '2'){
        status = '短信'
      }
      return status;
    }
  },  {
    title: '消息分类',
    dataIndex: 'messageClassify',
    key: 'messageClassify',
    render: (text) => {
      let status = '未知通知';
      if(text == '0'){
        status = '系统通知'
      }
      if(text == '1'){
        status = '物业通知'
      }
      if(text == '2'){
        status = '服务通知'
      }
      if(text == '3'){
        status = '活动通知'
      }
      if(text == '4'){
        status = '卡券通知'
      }
      if(text == '5'){
        status = '商城通知'
      }
      if(text == '6'){
        status = '会员通知'
      }
      return status;
    }
  },{
    title: '推送类型',
    dataIndex: 'sendType',
    key: 'sendType',
    render: (value) => {
      if(value == '1'){
        return "主动推送"
      }
      if(value == '0'){
        return "系统推送"
      }
    }
  }, {
    title: '推送总数',
    dataIndex: 'pushNumber',
    key: 'pushNumber'
  }, {
    title: '失败数',
    dataIndex: 'pushFailureNumber',
    key: 'pushFailureNumber'
  }, {
    title: '推送结果',
    dataIndex: 'pushStatus',
    key: 'pushStatus',
    render: (text) => {
      let status = '未知状态';
      if(text == '1'){
        status = '未推送'
      }
      if(text == '2'){
        status = '已推送'
      }
      if(text == '3'){
        status = '推送失败'
      }
      return status;
    }
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      addVisible: false,
      modalShow: false,
      detailVisible: false,
      sendType: '',
      sendTimeStart: '',
      sendTimeEnd: '',
      pushStatus: '',
      newsType: '',
      inputVal: '',
      optionVal: 'content'
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      instCode: userData.instCode,
      serviceType: '2',
      userId: userData.id,
      page: 1,
      size: 10
    });
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true});
  }
  handleSearch = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
        this.props.queryList({
          instCode: userData.instCode,
          userId: userData.id, 
          serviceType: '2',
          page: 1,
          size: pageSize1,
          [`${this.state.optionVal}`]: this.state.inputVal,
          sendTimeStart: this.state.sendTimeStart?Moment(this.state.sendTimeStart).format("YYYY-MM-DD"):'',
          sendTimeEnd: this.state.sendTimeEnd?Moment(this.state.sendTimeEnd).format("YYYY-MM-DD"):'',
          sendType: this.state.sendType,
          pushStatus: this.state.pushStatus,
          newsType: this.state.newsType,
        });
    })

  }
  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
        }
        data.push({
          keys: key,
          id: item.id,
          messageClassify: item.messageClassify,
          pushStatus: item.pushStatus,
          content: item.content,
          sendType: item.sendType,
          pushNumber: item.pushNumber,
          pushFailureNumber: item.pushFailureNumber,
          newsType: item.newsType,
          sendTime: Moment(item.sendTime).format("YYYY-MM-DD HH:mm:ss"),
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
            instCode: userData.instCode,
            userId: userData.id,
            serviceType: '2',
            page: current,
            size: pageSize,
            [`${this.state.optionVal}`]: this.state.inputVal,
            sendTime: this.state.sendTime?Moment(this.state.sendTime).format("YYYY-MM-DD"):'',
            sendType: this.state.sendType,
            pushStatus: this.state.pushStatus,
            newsType: this.state.newsType,
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            instCode: userData.instCode,
            userId: userData.id,
            serviceType: '2',
            page: current,
            size: pageSize,
            [`${this.state.optionVal}`]: this.state.inputVal,
            sendTime: this.state.sendTime?Moment(this.state.sendTime).format("YYYY-MM-DD"):'',
            sendType: this.state.sendType,
            pushStatus: this.state.pushStatus,
            newsType: this.state.newsType,
          });
        }
      }
    };
  }

  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      instCode: userData.instCode,
      userId: userData.id,
      serviceType: '2',
      page: 1,
      size: 10
    });
  }

  onShowScreen = () => {
    this.setState({
      showScreen: !this.state.showScreen,
    })
  }

  //活动时间
  timeRange = (type, date) => {
    let time
    if(date){
        time = date._d.getTime();
    }

    if (type === 'x1') {
        this.setState({sendTimeStart: time})
    }
    if (type === 'x2') {
        this.setState({sendTimeEnd: time})
    }
  }
  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      sendType: '',
      sendTimeStart: '',
      sendTimeEnd: '',
      pushStatus: '',
      newsType: ''
    });
  };
  inputChange (ev) {
    this.setState({
        inputVal: ev.target.value
    })
  }
  handleSelectChange = (type, value) => {
    if (type === 'newsType') {
        this.setState({newsType: value})
    }
    if (type === 'sendType') {
        this.setState({sendType: value})
    }
    if (type === 'pushStatus') {
      this.setState({pushStatus: value})
    }
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
    this.props.queryList({userId: userData.id,serviceType: '2', page: 1, size: 10})
  }

  //确定导出数据
  confirm = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const startTime = this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'';
    const endTime = this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'';
    let LINK;
    this.props.form.validateFields((err, values) => { 
      if (values.type == 'content') {
        LINK = `/backstage/send/task/export?content=${this.state.inputVal}&pushStatus=${this.state.pushStatus}&startTime=${startTime}&endTime=${endTime}&newsType=${this.state.newsType}&sendType=${this.state.sendType}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
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
            <FormItem label="消息类型" {...formItemLayout1}>
                <Select  style={{ width: '100%'}} 
                  value={this.state.newsType}
                  onChange={this.handleSelectChange.bind(this, 'newsType')}
                  >
                  <Option value="">全部</Option>
                  <Option value="1">消息</Option>
                  <Option value="2">短信</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem label="推送类型" {...formItemLayout1}>
                <Select style={{ width: '100%'}} 
                  value={this.state.sendType}
                  onChange={this.handleSelectChange.bind(this, 'sendType')}
                  >
                  <Option value="">全部</Option>
                  <Option value="0">系统推送</Option>
                  <Option value="1">主动推送</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={10} xxl={13}>
            <FormItem label="推送时间" {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x1')}
                    />
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x2')}
                    />
            </FormItem>
          </Col>
          <Col xl={5} xxl={4} style={{marginTop: '15px'}}>
            <FormItem label="推送结果" {...formItemLayout1}>
                <Select 
                  style={{ width: '100%'}} 
                  value={this.state.pushStatus}
                  onChange={this.handleSelectChange.bind(this, 'pushStatus')}
                  >
                  <Option value="">全部</Option>
                  <Option value="1">未推送</Option>
                  <Option value="2">已推送</Option>
                  <Option value="3">推送失败</Option>
                </Select>
            </FormItem>
          </Col>

          <Col xl={7} xxl={5} offset={12} style={{marginTop: '15px',textAlign:"center"}}>
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
          <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
            <TabPane tab="消息推送列表" key="1">
              <Row >
                  <Col span={2}>
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight: 20 }}>新增推送</Button>
                  </Col>
                  <Col xl={17} xxl={18}>
                    <Col span={16}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {initialValue: 'content'})(
                          <Select style={{ width: 114}}>
                            <Option value="content">推送内容</Option>
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
              {Element}
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
              onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
              pagination={content.pagination}
              bordered
              size="middle"/>
          </Row>
        </div>

        <Drawer
          title="新增推送"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addVisible')}
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
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Details search={this.search.bind(this)}/>
        </Drawer>

        <Modal
            title="导出数据"
            visible={this.state.modalShow}
            onOk={this.confirm.bind(this,content)}
            onCancel={ () => this.setState({modalShow:false}) }
            >
            <p style={{fontSize:16}}>确定导出全部数据?</p>
        </Modal>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.messagePush.data,
    loading:state.loading.models.messagePush
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'messagePush/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'messagePush/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
