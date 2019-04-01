import React, {Component} from 'react';
import {Tabs,Input,Icon,Button,Form,Row,Col,Table,Select,Drawer,DatePicker,Modal} from 'antd';
import Moment from 'moment';
import {connect} from 'dva';
import styles from './index.less';

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

let pageSize1 = 10;


const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  }, {
    title: '用户编号',
    dataIndex: 'cifUserId',
    key: 'cifUserId'
  }, {
    title: '用户账号',
    dataIndex: 'phoneNo',
    key: 'phoneNo'
  },  {
    title: '会员等级',
    dataIndex: 'level',
    key: 'level',
    render: (text) => {
      let level = '未知等级';
      if(text == 0){
        level = 'V0'
      }
      if(text == 1){
        level = 'V1'
      }
      if(text == 2){
        level = 'V2'
      }
      if(text == 3){
        level = 'V3'
      }
      if(text == 4){
        level = 'V4'
      }
      if(text == 5){
        level = 'V5'
      }
      if(text == 6){
        level = 'V6'
      }
      if(text == 7){
        level = 'V7'
      }
      if(text == 8){
        level = 'V8'
      }
      return level;
    }
  }, {
    title: '粮票使用额',
    dataIndex: 'limit',
    key: 'limit'
  }, {
    title: '成为会员时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      addVisible: false,
      detailVisible: false,
      level: '',
      optionVal: 'cifUserId',
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
      if (values.type == 'cifUserId') {
        this.props.queryList({
          userId: userData.id, 
          cifUserId: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          page: '1',
          size: pageSize1,
          instCode: userData.instCode,
          level: this.state.level
        });
      } else if (values.type == 'phoneNo') {
        this.props.queryList({
          userId: userData.id, 
          phoneNo: this.state.inputVal,
          startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
          endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          page: '1',
          size: pageSize1,
          instCode: userData.instCode,
          level: this.state.level
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
        //粮票使用额  保留两位小数
        const limits = (item.totalUsed + item.totalFreeUsed).toFixed(2);
        data.push({
          keys: key,
          id: item.id,
          cifUserId: item.userId,
          phoneNo: item.phoneNo,
          level: item.level,
          limit: limits,
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
            [`${this.state.optionVal}`]: this.state.inputVal,
            level: this.state.level,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            level: this.state.level,
            [`${this.state.optionVal}`]: this.state.inputVal,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
          });
        }
      }
    };
  }

  selectChange(ev){
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }
  handleSelectChange(type,value){
    this.setState({
      [type]: value
    })
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
      endTime: '',
      startTime: '',
      level: ''
    });
  };

  //点击弹出页面
  sendShow (e) {
    this.setState({
        [e]: true,

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
    const val = this.state.inputVal ? this.state.inputVal : ''
    this.props.form.validateFields((err, values) => {
      if (values.type == 'cifUserId') {
        LINK = `/backstage/member/excel?cifUserId=${val}&startTime=${startTime}&endTime=${endTime}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
      }else if (values.type == 'phoneNo') {
        LINK = `/backstage/member/excel?phoneNo=${val}&startTime=${startTime}&endTime=${endTime}&userId=${userData.id}&size=${content.pagination.total < 1000 ? content.pagination.total : ''}&page=1`;
      }
    })
    window.location.href = LINK;
    this.setState({modalShow:false});
  }

  render() {
    const {data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 4 },xxl: { span: 3 }},
      wrapperCol: {xl: { span: 15 },xxl: { span: 13 }}
    };
    const content = data ? this.formart(data) : [];
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row className="flex" style={{marginTop: '15px'}}>
          <Col>
            <Col>
              <FormItem label="会员等级">
                <Select 
                  value={this.state.level}
                  onChange={this.handleSelectChange.bind(this,'level')}
                  style={{ width: '100%'}} >
                  <Option value="">全部</Option>
                  <Option value="0">V0</Option>
                  <Option value="1">V1</Option>
                  <Option value="2">V2</Option>
                  <Option value="3">V3</Option>
                  <Option value="4">V4</Option>
                  <Option value="5">V5</Option>
                  <Option value="6">V6</Option>
                  <Option value="7">V7</Option>
                  <Option value="8">V8</Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem label="成为会员时间">
                  <DatePicker
                      format="YYYY-MM-DD"
                      onChange={this.timeRange.bind(this, 'x1')}
                      style={{width: '45%'}}/>
                  <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                  <DatePicker
                      format="YYYY-MM-DD"
                      onChange={this.timeRange.bind(this, 'x2')}
                      style={{width: '45%'}}/>
              </FormItem>
            </Col>
          </Col>

          <Col>
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
            <TabPane tab="会员列表" key="1">
              <Row className="flex">
                  <Col>
                      <InputGroup compact>
                        {getFieldDecorator('type', {initialValue: 'cifUserId'})(
                          <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                            <Option value="cifUserId">用户编号</Option>
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

                  <Col style={{display:showScreen?'none':''}}>
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
    data: state.memberManage.list,
    loading:state.loading.models.memberManage
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'memberManage/search', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'memberManage/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
