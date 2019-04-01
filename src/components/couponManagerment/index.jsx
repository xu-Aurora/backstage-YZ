import React, {Component} from 'react';
import {Tabs,Input,Icon,Button,Form,Row,Col,Table,Select,Modal,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva';
import styles from './index.less';

import Details from './detail.jsx';

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
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 200
  }, {
    title: '商品名称',
    dataIndex: 'memberGoodsName',
    key: 'memberGoodsName'
  },  {
    title: '用户账号',
    dataIndex: 'phoneNo',
    key: 'phoneNo'
  },{
    title: '用户姓名',
    dataIndex: 'userName',
    key: 'userName'
  }, {
    title: '订单金额',
    dataIndex: 'amount',
    key: 'amount'
  }, {
    title: '支付金额',
    dataIndex: 'paidAmount',
    key: 'paidAmount',
  }, {
    title: '支付时间',
    dataIndex: 'transTime',
    key: 'transTime'
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '4'){
        status = '交易关闭'
      }
      if(text == '5'){
        status = '交易完成'
      }
      if(text == '6'){
        status = '已退款'
      }
      return status;
    }
  }, {
    title: '下单渠道',
    dataIndex: 'terminal',
    key: 'terminal',
    render: (text) => {
      let type = '获取失败';
      if(text == '1'){
        type = 'APP'
      }
      if(text == '2'){
        type = '微信公众号'
      }
      if(text == '3'){
        type = '支付宝生活号'
      }
      return type;
    }
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      addVisible: false,
      detailVisible: false,
      status: '',
      terminal: '',
      optionVal: 'orderNo',
      modalShow:false
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

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true});
  }
  handleSearch = (val) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if (values.type === 'orderNo') {
        this.props.queryList({
          userId: userData.id, 
          instCode: userData.instCode,
          status: this.state.status,
          terminal: this.state.terminal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          orderNo: this.state.inputVal,
          page: '1', 
          size: pageSize1
        });
      } 
      if (values.type === 'phoneNo') {
        this.props.queryList({
          userId: userData.id, 
          instCode: userData.instCode,
          status: this.state.status,
          terminal: this.state.terminal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          phoneNo: this.state.inputVal,
          page: '1', 
          size: pageSize1
        });
      }
      if (values.type === 'userName') {
        this.props.queryList({
          userId: userData.id, 
          instCode: userData.instCode,
          status: this.state.status,
          terminal: this.state.terminal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          userName: this.state.inputVal,
          page: '1', 
          size: pageSize1
        });
      }
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
          orderNo: item.orderNo,
          status: item.status,
          phoneNo: item.phoneNo,
          memberGoodsName: item.memberGoodsName,
          userName: item.userName,
          amount: item.amount.toFixed(1),
          paidAmount: item.paidAmount.toFixed(1),
          terminal: item.terminal,
          updateUserId: item.updateUserId,
          transTime: Moment(item.transTime).format("YYYY-MM-DD HH:mm:ss"),
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
            name: this.state.name,
            instCode: userData.instCode,
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            name: this.state.name,
            instCode: userData.instCode,
          });
        }
      }
    };
  }
  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId: this.props.linkID || userData.id,
      page: 1,
      size: 10,
      instCode: userData.instCode,
    });
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

  //注册时间
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
      status: '',
      type: '',
      orderNo: '',
      userName: '',
      phoneNo: '',
      endTime: '',
      startTime: ''
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


  //确定导出数据
  confirm = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const startTime = this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'';
    const endTime = this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'';
    let LINK;
    this.props.form.validateFields((err, values) => {
      let c;
      if (values.type == 'orderNo') {
        if(this.state.inputVal){
          c = this.state.inputVal
        }else{
          c = ''
        }
        LINK = `/backstage/memberOrder/export?orderNo=${c}&startTime=${startTime}&endTime=${endTime}&status=${this.state.status}&terminal=${this.state.terminal}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
      }else if (values.type == 'userName') {
        LINK = `/backstage/memberOrder/export?userName=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&status=${this.state.status}&terminal=${this.state.terminal}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
      }else if (values.type == 'phoneNo'){
        LINK = `/backstage/memberOrder/export?phoneNo=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&status=${this.state.status}&terminal=${this.state.terminal}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
      }else{}
    })
    window.location.href = LINK;
    this.setState({modalShow:false});
  }

  render() {
    const {data} = this.props;
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
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={5} xxl={4}>
            <FormItem label="订单状态" {...formItemLayout1}>
              <Select
                value={this.state.status} 
                onChange={this.handleSelectChange.bind(this,'status')}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="4">交易关闭</Option>
                <Option value="5">交易完成 </Option>
                <Option value="6">已退款</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem label="下单渠道" {...formItemLayout1}>
              <Select 
                value={this.state.terminal} 
                onChange={this.handleSelectChange.bind(this,'terminal')}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="1">APP</Option>
                <Option value="2">微信公众号</Option>
                <Option value="3">支付宝生活号</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={9} xxl={13}>
            <FormItem label="支付时间" {...formItemLayout}>
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
        <div style={{width: '100%', padding: '10px 24px', backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
          <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
            <TabPane tab="会员订单" key="1">
              <Row >
                <Form className="ant-advanced-search-form" layout="horizontal">
                  <Col xl={19} xxl={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {initialValue: 'orderNo'})(
                            <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                              <Option value="orderNo">订单编号</Option>
                              <Option value="phoneNo">用户账号</Option>
                              <Option value="userName">用户姓名</Option>
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
                </Form>
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
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
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
    data: state.couponManage.list,
    loading:state.loading.models.couponManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'couponManage/search', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'couponManage/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
