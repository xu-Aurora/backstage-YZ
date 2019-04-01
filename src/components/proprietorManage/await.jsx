import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from './index.less';

import Details from './await/detail.jsx';
import Audit from './await/audit.jsx';

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
    title: '申请人姓名',
    dataIndex: 'applyUserName',
    key: 'applyUserName'
  },{
    title: '手机号码',
    dataIndex: 'applyUserPhone',
    key: 'applyUserPhone'
  },{
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail'
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName'
  }, {
    title: '申请类型',
    dataIndex: 'type',
    key: 'type',
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
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == 1){
        status = '待审核'
      }
      if(text == 2){
        status = '已审核'
      }
      if(text == 3){
        status = '审批拒绝'
      }
      return status;
    }
  }, {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime'
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
      optionVal: 'applyUserName',
      type:'',
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
  handleSearch = (val) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      this.props.queryList({
        page: 1,
        size: pageSize1,
        userId: userData.id,
        instCode: userData.instCode,
        status: '1', 
        [`${self.state.optionVal}`]: self.state.inputVal,
        type: self.state.type,
        startTime: self.state.startTime? Moment(self.state.startTime).format("YYYY-MM-DD"):'',
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
          applyUserName: item.applyUserName,
          status: item.status,
          phoneNo: item.phoneNo,
          applyUserPhone: item.applyUserPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
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
            status: '1',
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            startTime: self.state.startTime? Moment(self.state.startTime).format("YYYY-MM-DD"):'',
            endTime: self.state.endTime?Moment(self.state.endTime).format("YYYY-MM-DD"):''
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            status: '1',
            [`${self.state.optionVal}`]: self.state.inputVal,
            type: self.state.type,
            startTime: self.state.startTime? Moment(self.state.startTime).format("YYYY-MM-DD"):'',
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
      instCode: userData.instCode,
      status: '1'
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
        [item]: false,
        // detailVisible: item
    })
    this.props.queryList({
      userId: userData.id, 
      page: 1, 
      size: 10,
      status: '1',
      instCode: userData.instCode
    })
  }

  //await和detail组件传值
  closeDetail(data){
    this.setState({detailVisible: false},() => {
      setTimeout(() => {
        this.setState({auditVisible: data})
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
      labelCol: {xl: { span: 3 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 21 },xxl: { span: 22 }}
    };
    const content = data ? this.formart(data) : [];
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={6} xxl={4}>
            <FormItem
              label="申请类型"
              labelCol={{span: 6}}
              wrapperCol={{span: 13}}>
              <Select style={{width: '100%'}}
                onChange={this.handleSelectChange.bind(this, 'type')}
                >
                  <Option value="">全部</Option>
                  <Option value="1">户主</Option>
                  <Option value="2">亲属</Option>
                  <Option value="3">朋友</Option>
                  <Option value="4">租客</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={12} xxl={14}>
            <FormItem label="申请时间"
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
          <Col span={3} style={{textAlign:'center'}} offset={3}>
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
                  <Col span={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('applyUserName', {initialValue: 'applyUserName'})(
                            <Select style={{ width: 132}} onChange={this.selectChange.bind(this)}>
                              <Option value="applyUserName">申请人姓名</Option>
                              <Option value="applyUserPhone">手机号码</Option>
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
          title="审核"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'auditVisible')}
          maskClosable={false}
          visible={this.state.auditVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Audit search={this.search.bind(this)} closeAudit={this.closeAudit.bind(this)}/>
        </Drawer> 

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.proprietorManage.list,
    loading:state.loading.models.proprietorManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'proprietorManage/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'proprietorManage/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
