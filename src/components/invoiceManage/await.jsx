import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,Drawer,DatePicker,message} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from './index.less';

import Details from './await/detail.jsx';
import Uploading from './await/uploading.jsx';

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
    title: '发票类型',
    dataIndex: 'type',
    key: 'type',
    render: (value) => {
      if(value == '1'){
        return "增值税普通发票";
      }
      if(value == '2'){
        return "增值税专用发票";
      }
    }
  },{
    title: '开票类容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    render: (text,record) => {
      return <div className={styles.contents}>{ record.content }</div>
    }
  },{
    title: '开票金额',
    dataIndex: 'amountInvoice',
    key: 'amountInvoice'
  }, {
    title: '开票对象',
    dataIndex: 'userType',
    key: 'userType',
    render: (value) => {
      if(value == '1'){
        return "个人";
      }
      if(value == '2'){
        return "单位";
      }
    }
  }, {
    title: '开票抬头',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '纳税人识别号',
    dataIndex: 'tax',
    key: 'tax',
    width: 150
  }, {
    title: '开票用户账号',
    dataIndex: 'invoiceUserAccount',
    key: 'invoiceUserAccount'
  },{
    title: '开票业务单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 200
  },{
    title: '开票申请时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },{
    title: '开票模式',
    dataIndex: 'invoiceMode',
    key: 'invoiceMode'
  },{
    title: '开票机构',
    dataIndex: 'invoiceInstitution',
    key: 'invoiceInstitution',
  },{
    title: '开票状态',
    dataIndex: 'status',
    key: 'status',
    render: (value) => {
      if(value == '1'){
        return "待开具";
      }
      if(value == '2'){
        return "已开具";
      }
      if(value == '3'){
        return "已核销";
      }
    }
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      visibleShow: false,
      detailVisible: false,
      auditVisible: false,
      optionVal: 'content',
      userType: '',
      type: '',
      invoiceInstitution: '',
    };
  }

  handleSelectChange(type, value) {
    this.setState({[type]: value});
  }
  selectChange (ev) {
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true});
  }

  regx(){
    //正则匹配只能输入数字
    let regNum = /^[0-9]*$/;
    if(this.state.optionVal == 'invoiceUserAccount'){
      if(!regNum.test(this.state.inputVal)){
        message.warning("开票用户账号只能输入数字");
        return false;
      }
    }
    if(this.state.optionVal == 'orderNo'){
      if(!regNum.test(this.state.inputVal)){
        message.warning("开票业务单号只能输入数字");
        return false;
      }
    }
    return true;
  }
  handleSearch = (val) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      let reg = this.regx();
      if(reg){
        this.props.queryList({
          page: '1',
          size: pageSize1,
          userId: userData.id,
          instCode: userData.instCode,
          handleStatus: '1', 
          [`${self.state.optionVal}`]: self.state.inputVal,
          type: self.state.type,
          userType: self.state.userType,
          invoiceInstitution: self.state.invoiceInstitution,
          createTimeStart: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD") : '',
          createTimeEnd: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD") : ''
        });
      }
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
          content: item.content,
          status: item.status,
          invoiceUserAccount: item.invoiceUserAccount,
          amountInvoice: item.amountInvoice,
          invoiceInstitution: item.invoiceInstitution,
          invoiceMode: item.invoiceMode,
          orderNo: item.orderNo,
          tax: item.tax,
          title: item.title,
          userType: item.userType,
          amountInvoice: item.amountInvoice,
          type: item.type,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
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
            handleStatus: '1',
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            userType: self.state.userType,
            invoiceInstitution: self.state.invoiceInstitution,
            createTimeEnd: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            createTimeEnd: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD"):''
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            handleStatus: '1',
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            userType: self.state.userType,
            invoiceInstitution: self.state.invoiceInstitution,
            createTimeEnd: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            createTimeEnd: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD"):''
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
      instCode: userData.instCode,
      handleStatus: '1'
    });
  }

  onShowScreen = () => {
    this.setState({
      showScreen: !this.state.showScreen,
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
      startTime: '',
      endTime: '',
      invoiceInstitution: '',
      userType: '',
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
        [item]: false,
    })
    this.props.queryList({
      userId: userData.id, 
      page: 1, 
      size: 10,
      handleStatus: '1',
      instCode: userData.instCode
    })
  }

  //await和detail组件传值
  closeDetail(data){
    this.setState({detailVisible: data},() => {
      setTimeout(() => {
        this.setState({auditVisible:true})
      }, 500);
    });
  }

  //await和audit组件传值
  closeAudit(data){
    this.setState({auditVisible: data});
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
            <FormItem label="发票类型" {...formItemLayout1}>
              <Select style={{ width: '100%'}}
                onChange={this.handleSelectChange.bind(this, 'type')}
                value={this.state.type} >
                  <Option value="">全部</Option>
                  <Option value="1">增值税普通发票</Option>
                  <Option value="2">增值税专用发票</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem label="开票对象" {...formItemLayout1}>
              <Select 
                style={{ width: '100%'}}
                onChange={this.handleSelectChange.bind(this, 'userType')}
                value={this.state.userType} >
                  <Option value="">全部</Option>
                  <Option value="1">个人</Option>
                  <Option value="2">企业</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={10} xxl={13}>
            <FormItem label="申请时间" {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x1')}
                    style={{width: '35%'}}/>
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x2')}
                    style={{width: '35%'}}/>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4} style={{marginTop: '15px'}}>
            <FormItem label="开票机构" {...formItemLayout1}>
              <Select style={{ width: '100%'}}
                onChange={this.handleSelectChange.bind(this, 'invoiceInstitution')}
                value={this.state.invoiceInstitution} >
                  <Option value="">全部</Option>
                  <Option value="佳源物业">佳源物业</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={3} offset={17} style={{marginTop: '15px',textAlign:"center"}}>
              <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
              <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
          </Col>
        </Row>
      )
    }
    return (
      <div className={styles.commonBox}>
        <div className={styles.search}>
              <Row>
                <Form className="ant-advanced-search-form" layout="horizontal">
                  <Col span={21} key="agment">
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {initialValue: 'content'})(
                            <Select style={{ width: 132}} onChange={this.selectChange.bind(this)}>
                              <Option value="content">开票内容</Option>
                              <Option value="invoiceUserAccount">开票用户账号</Option>
                              <Option value="orderNo">开票业务单号</Option>
                            </Select>
                          )}
                          <Input style={{ width: 240}} 
                            maxLength={30}
                            value={this.state.inputVal}
                            onChange={(e) => this.setState({inputVal:e.target.value})}
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                            placeholder="输入搜索内容" />
                        </InputGroup>
                    </Col>
                  </Col>

                  <Col span={3} style={{display:showScreen?'none':'',textAlign:"center"}}>
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
          <Details match={this.props.match} search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
        </Drawer>

        <Drawer
          title="上传发票"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'auditVisible')}
          maskClosable={false}
          visible={this.state.auditVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Uploading search={this.search.bind(this)} />
        </Drawer> 

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.invoiceManage.list,
    loading:state.loading.models.invoiceManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'invoiceManage/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'invoiceManage/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
