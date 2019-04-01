import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from './index.less';

import Details from './already/detail.jsx';

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
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 200
  },{
    title: '客户姓名',
    dataIndex: 'userName',
    key: 'userName'
  },{
    title: '客户电话',
    dataIndex: 'userPhone',
    key: 'userPhone'
  }, {
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail'
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName'
  }, {
    title: '客户类型',
    dataIndex: 'userType',
    key: 'userType',
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
    title: '订单类型',
    dataIndex: 'type',
    key: 'type',
    render: (item) => {
      if(item == '1'){
        return '投诉'
      }
      if(item == '2'){
        return '建议'
      }
      if(item == '3'){
        return '表扬'
      }
    }
  }, {
    title: '订单时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (item) => {
      if(item == '1'){
        return '待处理'
      }
      if(item == '2'){
        return '已处理'
      }
    }
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showScreen: false,
      detailVisible: false,
      inputVal: '',
      optionVal: 'orderNo',
      userType:'',
      type:'',
    };
  }
  componentWillMount() {
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({
      detailVisible: true
    });
  }
  handleSearch = (val) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      this.props.queryList({
        page: 1,
        size: pageSize1,
        userId: userData.id, 
        status: '2', 
        instCode: userData.instCode,
        [`${self.state.optionVal}`]: self.state.inputVal,
        type: self.state.type,
        userType: self.state.userType,
        startTime: self.state.startTime?Moment(self.state.startTime).format("YYYY-MM-DD"):'',
        endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
      });
    })

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

  formart = (content) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        data.push({
          keys: keys+1,
          id: item.id,
          orderNo: item.orderNo,
          userName: item.userName,
          userPhone: item.userPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
          userType: item.userType,
          type: item.type,
          createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"): '',
          status: item.status,
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
            status: '2',
            instCode: userData.instCode,
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
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
            status: '2',
            instCode: userData.instCode,
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            userType: self.state.userType,
            startTime: self.state.startTime?Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
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

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        // [item]: false
        detailVisible: item
    })
    this.props.queryList({userId: userData.id, page: 1, size: 10})
  }
  //await和detail组件传值
  closeDetail(data){
    this.setState({detailVisible: data});
  }

  render() {
    const {data} = this.props;
    const {showScreen} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 3 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 21 },xxl: { span: 22 }}
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
              label="订单类型"
              {...formItemLayout1}>
                <Select 
                  onChange={this.handleSelectChange.bind(this, 'type')}
                  value={this.state.type}
                  style={{ width: '100%'}} >
                  <Option value="">全部</Option>
                  <Option value="1">投诉</Option>
                  <Option value="2">建议</Option>
                  <Option value="3">表扬</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem
              label="客户类型"
              {...formItemLayout1}>
              <Select 
                onChange={this.handleSelectChange.bind(this, 'userType')}
                value={this.state.userType}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="1">户主</Option>
                <Option value="2">亲属</Option>
                <Option value="3">朋友</Option>
                <Option value="4">租客</Option>
              </Select>
            </FormItem>
          </Col>  
          <Col xl={11} xxl={13}>
            <FormItem label="订单时间"
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
          <Col span={3} style={{textAlign:'center'}}>
              <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
              <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>收起<Icon type="up" /></a>
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
                          {getFieldDecorator('type', {initialValue: 'orderNo'})(
                            <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
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
                    <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>展开<Icon type="down" /></a>
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
          <Details search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)}/>
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.adviceManage.list,
    linkID: state.login.userMsg.id,
    loading:state.loading.models.adviceManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'adviceManage/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'adviceManage/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
