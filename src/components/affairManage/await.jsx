import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,message,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from './index.less';

import Details from './await/detail.jsx';
import Send from './await/send.jsx';  //派单
import Finish from './await/finish.jsx';  //结单
import Close from './await/close.jsx';  //关闭订单

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

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 200
  },{
    title: '客户姓名',
    dataIndex: 'userName',
    key: 'userName',
    width: 105
  },{
    title: '客户电话',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 105
  }, {
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail',
    width: 200
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName',
    width: 180
  }, {
    title: '客户类型',
    dataIndex: 'userType',
    key: 'userType',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == 1){
        status = '户主'
      }
      if(text == 2){
        status = '亲属'
      }
      if(text == 3){
        status = '朋友'
      }
      if(text == 4){
        status = '租客'
      }
      return status;
    }
  }, {
    title: '报事类型',
    dataIndex: 'type',
    key: 'type',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == 0){
        status = '报修'
      }
      return status;
    }
  }, {
    title: '子类型',
    dataIndex: 'subType',
    key: 'subType',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == '00'){
        status = '紧急报修'
      }
      if(text == '01'){
        status = '室内报修'
      }
      if(text == '02'){
        status = '公共报修'
      }
      if(text == '03'){
        status = '公共卫生'
      }
      if(text == '04'){
        status = '小区绿化'
      }
      if(text == '05'){
        status = '小区安全'
      }
      return status;
    }
  }, {
    title: '报事内容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    render: (text,record) => {
      return <div className={styles.contents}>{ record.content }</div>
    }
  }, {
    title: '报事时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 220
  }, {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    width: 108,
    render: (text) => {
      let status = '未知状态';
      if(text == 1){
        status = '待处理'
      }
      if(text == 2){
        status = '已处理'
      }
      if(text == 3){
        status = '处理中'
      }
      if(text == 4){
        status = '已关闭'
      }
      return status;
    }
  }, {
    title: '期望上门时间',
    dataIndex: 'reservationTime',
    key: 'reservationTime',
    width: 220
  }
];

let pageSize1 = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      sendVisible: false,
      detailVisible: false,
      finishVisible: false,
      closeVisible: false,
      inputVal: '',
      optionVal: 'orderNo',
      userType:'',
      type:'',
      status:'',
      subType:'',
      // status: ['1','3'].join(',')
    };
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record);
    this.setState({detailVisible: true,id: record.id});
  }
  handleSearch = (val) => {
    let self = this;
    let status = this.state.status ? this.state.status : ['1','3'].join(',');
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      this.props.queryList({
        instCode: userData.instCode,
        userId: userData.id, 
        page: '1',
        size: pageSize1,
        [`${self.state.optionVal}`]: self.state.inputVal,
        type: self.state.type,
        status,
        subType: self.state.subType,
        userType: self.state.userType,
        startTime: self.state.startTime?Moment(self.state.startTime).format("YYYY-MM-DD"):'',
        endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
      });
    })
  }

  formart = (content) => {
    let self = this;
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
          orderNo: item.orderNo,
          userName: item.userName,
          userPhone: item.userPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
          userType: item.userType,
          type: item.type,
          subType: item.subType,
          content: item.content,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          reservationTime: item.reservationTime,
          status: item.status
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
            id: this.state.id,
            instCode: userData.instCode,
            status: ['1','3'].join(','),
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            // status: self.state.status,
            subType: self.state.subType,
            userType: self.state.userType,
            startTime: self.state.startTime?Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            id: this.state.id,
            instCode: userData.instCode,
            status: ['1','3'].join(','),
            [`${self.state.optionVal}`]: self.state.inputVal,
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            // status: self.state.status,
            subType: self.state.subType,
            userType: self.state.userType,
            startTime: self.state.startTime?Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
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
      status: ['1','3'].join(','),
      instCode: userData.instCode
    });
  }

  onShowScreen = () => {
    this.setState({
      showScreen: !this.state.showScreen,
    })
  }

  handleSelectChange(type, value) {
    if(type == 'type') {
      this.setState({
        subType:''
      })
    }
    this.setState({[type]: value});
  }
  selectChange (ev) {
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
        this.setState({startTime: time})
    }
    if (type === 'x2') {
        this.setState({endTime: time})
    }
  }

  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      type: '',
      subType: '',
      userType: '',
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

  //await和detail组件传值
  closeDetail(data){
    this.setState({detailVisible: false},() => {
      setTimeout(() => {
        this.setState({[data]: true})
      }, 500);
    });
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.queryList({
      userId: userData.id, 
      page: 1, 
      size: 10,
      instCode: userData.instCode,
      status: ['1','3'].join(',')
    })
  }

  render() {
    const {data} = this.props;
    const {showScreen} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 3 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 21 },xxl: { span: 22 }}
    };
    const content = data ? this.formart(data) : [];
    let Element = '';
    if (showScreen) {
      Element = (
        <div>
          <Row style={{marginTop: '15px'}}>
            <Col xl={6} xxl={4}>
              <FormItem
                label="报事类型"
                labelCol={{span: 6}}
                wrapperCol={{span: 13}}>
                <Select 
                  style={{ width: '100%'}} 
                  value={this.state.type}
                  onChange={this.handleSelectChange.bind(this, 'type')}>
                  <Option value="">全部</Option>
                  <Option value="0">报修</Option>
                </Select>
              </FormItem>
            </Col>
            <Col xl={6} xxl={4}>
              <FormItem
                label="子类型"
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}>
                <Select 
                  disabled={ this.state.type == '' ? true : false }
                  style={{ width: '100%'}}
                  value={this.state.subType}
                  onChange={this.handleSelectChange.bind(this, 'subType')}>
                  <Option value="">全部</Option>
                  <Option value="00">紧急报修</Option>
                  <Option value="01">室内报修</Option>
                  <Option value="02">公共报修</Option>
                  <Option value="03">公共卫生</Option>
                  <Option value="04">小区绿化</Option>
                  <Option value="05">小区安全</Option>
                </Select>
              </FormItem>
            </Col>  
            <Col xl={6} xxl={4}>
              <FormItem
                label="客户类型"
                labelCol={{span: 6}}
                wrapperCol={{span: 13}}>
                <Select 
                  style={{ width: '100%'}} 
                  value={this.state.userType}
                  onChange={this.handleSelectChange.bind(this, 'userType')}>
                  <Option value="">全部</Option>
                  <Option value="1">户主</Option>
                  <Option value="2">亲属</Option>
                  <Option value="3">朋友</Option>
                  <Option value="4">租客</Option>
                </Select>
              </FormItem>
            </Col>  
            <Col xl={6} xxl={4}>
              <FormItem
                label="处理状态"
                labelCol={{span: 6}}
                wrapperCol={{span: 13}}>
                <Select 
                  style={{ width: '100%'}} 
                  value={this.state.status}
                  onChange={this.handleSelectChange.bind(this, 'status')}>
                  <Option value="">全部</Option>
                  <Option value="1">待处理</Option>
                  {/* <Option value="2">已处理</Option> */}
                  <Option value="3">处理中</Option>
                  {/* <Option value="4">已关闭</Option> */}
                </Select>
              </FormItem>
            </Col>   
            <Col xl={14} xxl={14} style={{marginTop: '15px'}}>
              <FormItem label="报事时间"
                  {...formItemLayout}>
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
            <Col style={{marginTop: '15px',textAlign:'center'}} span={3} offset={7}>
                <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
            </Col>      
          </Row>
        </div>
      )
    }
    return (
      <div className={styles.commonBox}>
        <div className={styles.search}>
              <Row>
                <Form className="ant-advanced-search-form" layout="horizontal">
                  <Col span={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('orderNo', {initialValue: 'orderNo'})(
                            <Select style={{ width: 132}} onChange={this.selectChange.bind(this)}>
                              <Option value="orderNo">订单编号</Option>
                              <Option value="userName">客户姓名</Option>
                              <Option value="userPhone">客户电话</Option>
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

                  <Col span={3} style={{display:showScreen?'none':'',textAlign:'center'}}>
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          展开 <Icon type="down" />
                        </a>
                  </Col>
                </Form>
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
              scroll={{x: '1500'}}
              size="middle"/>
          </Row>
        </div>


        <Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Details search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
        </Drawer>

        <Drawer
          title="派单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'sendVisible')}
          maskClosable={false}
          visible={this.state.sendVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Send search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="结单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'finishVisible')}
          maskClosable={false}
          visible={this.state.finishVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Finish search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="关闭订单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'closeVisible')}
          maskClosable={false}
          visible={this.state.closeVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Close search={this.search.bind(this)}/>
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.affairManage.list,
    loading: !!state.loading.models.affairManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'affairManage/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'affairManage/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
