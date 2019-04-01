import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Icon,Row,Col,Table,Select,message,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from './index.less';

import Details from './await/detail.jsx';
import Amend from './await/amend.jsx';
import Label from './await/label.jsx';

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
    title: '账单编号',
    dataIndex: 'orderNo',
    key: 'orderNo'
  },{
    title: '账单类型',
    dataIndex: 'type',
    key: 'type'
  },{
    title: '小区',
    dataIndex: 'comName',
    key: 'comName'
  }, {
    title: '户号',
    dataIndex: 'roomName',
    key: 'roomName'
  }, {
    title: '账单金额',
    dataIndex: 'amount',
    key: 'amount'
  }, {
    title: '缴费状态',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: '户主姓名',
    dataIndex: 'roomId',
    key: 'roomId'
  }, {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '缴费时间',
    dataIndex: 'payTime',
    key: 'payTime'
  }, {
    title: '缴费渠道',
    dataIndex: 'payType',
    key: 'payType'
  }, {
    title: '缴费人',
    dataIndex: 'payId',
    key: 'payId'
  }, {
    title: '收款起始日',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal'
  }, {
    title: '负责人电话',
    dataIndex: 'principalPhone',
    key: 'principalPhone'
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      detailVisible: true,
      amendVisible: false,
      labelVisible: false,
    };
  }

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({isSelect: true,id1: record.id});
  }
  handleSearch = (val) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));


  }
  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * 10 + key;
        }
        data.push({
          keys: key,
          id: item.id,
          name: item.name,
          status: item.status == '0' ? '正常' : '注销',
          phoneNo: item.phoneNo,
          companyId: item.companyId,
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
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          pageSize1 = pageSize;
          this.props.queryList({
            instCode: userData.instCode,
            status: '1',
            userId: userData.id,
            page: current,
            size: pageSize,
            id: this.state.id,
            name: this.state.name
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            instCode: userData.instCode,
            status: '1',
            userId: userData.id,
            page: current,
            size: pageSize,
            id: this.state.id,
            name: this.state.name
          });
        }
      }
    };
  }

  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId: userData.id,
      status: '1',
      page: 1,
      size: 10,
      instCode: userData.instCode,
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
  handleCancel(e)  {
    this.setState({
        [e]: false
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
  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode,})
  }

  //await和detail组件传值
  closeDetail(whether,data){
    this.setState({detailVisible: whether},() => {
      setTimeout(() => {
        if(data == "amendVisible"){
          this.setState({amendVisible:true})
        }
        if(data == "labelVisible"){
          this.setState({labelVisible:true})
        }
        
      }, 500);
    });
  }
  //await和amend组件传值
  closeAmend(whether){
    this.setState({amendVisible: whether},() => {
      setTimeout(() => {
        this.setState({detailVisible:true})
      }, 500);
    });
  }

  //await和amend组件传值
  closeLabel(whether){
    this.setState({labelVisible: whether},() => {
      setTimeout(() => {
        this.setState({detailVisible:true})
      }, 500);
    });
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
              label="用户状态"
              {...formItemLayout1}>
                <Select 
                  onChange={this.handleSelectChange.bind(this, 'status')}
                  value={this.state.type}
                  style={{ width: '100%'}} >
                  <Option value="">全部</Option>
                  <Option value="1">启用 </Option>
                  <Option value="2">禁用</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={4}>
            <FormItem label="推送状态" {...formItemLayout1}>
              <Select 
                onChange={this.handleSelectChange.bind(this, 'type')}
                value={this.state.type}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="1">推送成功</Option>
                <Option value="2">推送失败</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={11} xxl={13}>
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
                  <Col span={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {initialValue: 'id'})(
                            <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                              <Option value="id">手机号码</Option>
                              <Option value="name">消息内容</Option>
                              <Option value="name1">发送人</Option>
                            </Select>
                          )}
                          <Input style={{ width: 240}}  
                            maxLength={50}
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
          <Details search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
        </Drawer>

        <Drawer
          title="修改账单金额"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'amendVisible')}
          maskClosable={false}
          visible={this.state.amendVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Amend search={this.search.bind(this)} closeAmend={this.closeAmend.bind(this)}/>
        </Drawer> 

        <Drawer
          title="标记"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'labelVisible')}
          maskClosable={false}
          visible={this.state.labelVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Label search={this.search.bind(this)} closeLabel={this.closeLabel.bind(this)}/>
        </Drawer> 

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.paymentManage.list,
    loading:state.loading.models.paymentManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'paymentManage/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'paymentManage/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
