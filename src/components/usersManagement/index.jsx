import React, {Component} from 'react';
import {Tabs,Input,Icon,Button,Form,Modal,Row,Col,Table,Select,Drawer,DatePicker} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../common.less';

import Details from './detail.jsx';

const TabPane = Tabs.TabPane;
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
    title: '用户编号',
    dataIndex: 'userId',
    key: 'userId'
  },{
    title: '用户姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '用户账号',
    dataIndex: 'phoneNo',
    key: 'phoneNo'
  },  {
    title: '用户昵称',
    dataIndex: 'nickname',
    key: 'nickname'
  }, {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '用户状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '0'){
        status = '启用'
      }
      if(text == '1'){
        status = '禁用'
      }      
      if(text == '2'){
        status = '停用'
      }
      if(text == '3'){
        status = '锁定'
      }
      return status;
    }
  }
];

let pageSize1 = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      detailVisible: false,
      inputVal: '',
      optionVal: 'cifUserId',
      status:'',
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

  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({
      detailVisible: true,
    });
  }
  handleSearch = (val) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if (values.type == 'userId') {
        this.props.queryList({
          userId: userData.id, 
          cifUserId: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          status: this.state.status,
          page: '1',
          size: pageSize1,
          instCode: userData.instCode
        });
      } else if (values.type == 'phoneNo') {
        this.props.queryList({
          userId: userData.id, 
          phoneNo: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          status: this.state.status,
          page: '1',
          size: pageSize1,
          instCode: userData.instCode
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
          userId: item.userId,
          name: item.name,
          phoneNo: item.phoneNo,
          status: item.status,
          phoneNo: item.phoneNo,
          nickname: item.nickname,
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
            status: this.state.status,
            instCode: userData.instCode,
            [`${this.state.optionVal}`]: this.state.inputVal,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            status: this.state.status,
            instCode: userData.instCode,
            [`${this.state.optionVal}`]: this.state.inputVal,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
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
      instCode: userData.instCode
    });
  }

  selectChange (ev) {
    this.setState({
        inputVal: '',
        optionVal: ev
    })
  }
  handleSelectChange = (value) => {
    this.setState({status: value})
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
      status:'',
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

  cloaeDedail(data){
    this.setState({
      detailVisible:data
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
    const startTime = this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'';
    const endTime = this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'';
    let LINK;
    this.props.form.validateFields((err, values) => {
      if (values.type == 'userId') {
        LINK = `/backstage/cifUser/excel?cifUserId=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&status=${this.state.status}&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
      }else if (values.type == 'phoneNo') {
        LINK = `/backstage/cifUser/excel?phoneNo=${this.state.inputVal}&startTime=${startTime}&endTime=${endTime}&status=${this.state.status}&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
      }
    })
    window.location.href = LINK;
    this.setState({modalShow:false});
  }

  render() {
    const {data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 3 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 21 },xxl: { span: 22 }}
    };
    const content = data ? this.formart(data) : [];
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={6} xxl={4}>
            <FormItem
              label="用户状态"
              labelCol={{span: 6}}
              wrapperCol={{span: 13}}>
              <Select 
                value={this.state.status}
                onChange={this.handleSelectChange.bind(this)}
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="0">正常</Option>
                <Option value="1">禁用</Option>
                <Option value="2">停用</Option>
                <Option value="3">锁定</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={12} xxl={14}>
            <FormItem label="注册时间"
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
          <Col xxl={3} offset={3}>
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
            <TabPane tab="用户列表" key="1">
              <Row >
                  <Col xl={19} xxl={21}>
                    <Col span={16}>
                        <InputGroup compact>
                          {getFieldDecorator('type', {initialValue: 'userId'})(
                            <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                              <Option value="userId">用户编号</Option>
                              <Option value="phoneNo">用户账号</Option>
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
          destroyOnClose
          placement="right"
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Details search={this.search.bind(this)} cloaeDedail={this.cloaeDedail.bind(this)} />
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.userManage.list,
    loading: state.loading.models.userManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'userManage/search', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'userManage/save', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));

