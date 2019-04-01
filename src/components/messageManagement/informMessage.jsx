import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,Modal,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva';
import styles from './list.less';

import Details from './informDetail.jsx';

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
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone'
  },{
    title: '短信内容',
    dataIndex: 'contents',
    key: 'contents'
  }, {
    title: '推送状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '0'){
        status = '发送中'
      }
      if(text == '1'){
        status = '推送成功'
      }
      if(text == '2'){
        status = '推送失败'
      }
      return status;
    }
  },  {
    title: '推送类型',
    dataIndex: 'sendType',
    key: 'sendType',
    render: (text) => {
      let status = '未知类型';
      if(text == '1'){
        status = '主动发送'
      }
      if(text == '0'){
        status = '系统发送'
      }     
      return status;
    }
  }, {
    title: '推送时间',
    dataIndex: 'sendTime',
    key: 'sendTime'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      showScreen: false,
      detailVisible: false,
      inputVal: '',
      createTimeEnd: '',
      createTimeStart: '',
      sendType: '',
      serviceType: '',
      status: '',
      optionVal: 'phone'
    };
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true,});
  }
  handleSearch = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      this.props.queryList({
        instCode: userData.instCode,
        userId: userData.id, 
        page: 1,
        size: pageSize1,
        serviceType: '2',
        [`${this.state.optionVal}`]: this.state.inputVal,
        sendType: this.state.sendType,
        status: this.state.status,
        createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
        createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
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
          phone: item.phone,
          status: item.status,
          contents: item.contents,
          sendType: item.sendType,
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
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            [`${this.state.optionVal}`]: this.state.inputVal,
            sendType: this.state.sendType,
            serviceType: this.state.serviceType,
            createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
            createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            [`${this.state.optionVal}`]: this.state.inputVal,
            sendType: this.state.sendType,
            serviceType: this.state.serviceType,
            createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
            createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
          });
        }
      }
    };
  }

  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId: userData.id,
      page: 1,
      size: 10,
      instCode:userData.instCode,
    });
  }

  onShowScreen = () => {
    this.setState({
      showScreen: !this.state.showScreen,
    })
  }

  handleSelectChange(type,value){
    this.setState({
      [type]: value
    })
  }
  selectChange(ev){
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }

  //时间
  timeRange = (type, date) => {
    let time
    if(date){
        time = date._d.getTime();
    }

    if (type === 'x1') {
        this.setState({createTimeStart: time})
    }
    if (type === 'x2') {
        this.setState({createTimeEnd: time})
    }
  }

  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      createTimeEnd: '',
      createTimeStart: '',
      sendType: '',
      serviceType: ''
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
    this.props.queryList({userId: userData.id, page: 1, size: 10})
  }

    //确定导出数据
    confirm = (content) => {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const startTime = this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'';
      const endTime = this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'';
      let LINK;
      this.props.form.validateFields((err, values) => {
        if (values.type == 'phone') {
          LINK = `/backstage/sms/send/log/export?phone=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&sendType=${this.state.sendType}&status=${this.state.status}&serviceType=2&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
        }else if (values.type == 'contents') {
          LINK = `/backstage/sms/send/log/export?contents=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&sendType=${this.state.sendType}&status=${this.state.status}&serviceType=2&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
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
            <FormItem label="推送状态" {...formItemLayout1}>
              <Select
                value={this.state.status} 
                onChange={this.handleSelectChange.bind(this,'status')}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="0">发送中</Option>
                <Option value="1">推送成功</Option>
                <Option value="2">推送失败</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem label="推送类型" {...formItemLayout1}>
              <Select 
                value={this.state.sendType} 
                onChange={this.handleSelectChange.bind(this,'sendType')}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="1">主动发送</Option>
                <Option value="0">系统发送</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={13}>
            <FormItem label="推送时间" {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x1')}
                    style={{width: '40%'}}/>
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x2')}
                    style={{width: '40%'}}/>
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
        <div className={styles.search}>
              <Row >
                  <Col xl={19} xxl={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {initialValue: 'phone'})(
                            <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                              <Option value="phone">手机号码</Option>
                              <Option value="contents">消息内容</Option>
                            </Select>
                          )}
                          <Input style={{ width: 240}} 
                            maxLength={50}
                            value={this.state.inputVal}
                            onChange={(e) => this.setState({inputVal:e.target.value})}
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
        </div>
        <div style={{height: 6}}></div>
        <div style={{height: 14,backgroundColor: '#ccc'}}></div>
        <div style={{width: '100%',backgroundColor: "#FFF",padding:24}}>
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

        <Modal
            title="导出数据"
            visible={this.state.modalShow}
            onOk={this.confirm.bind(this,content)}
            onCancel={ () => this.setState({modalShow:false}) }
            >
            <p style={{fontSize:16}}>确定导出全部数据?</p>
        </Modal>

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
          <Details search={this.search.bind(this)}/>
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.messageManage.dataSms,
    loading:state.loading.models.messageManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'messageManage/serchSms', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'messageManage/save', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
