import React, {Component} from 'react';
import {Input,Button,Form,Row,Col,Icon,Table,Select,Drawer} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../index.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;

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
        title: '序号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
    }, {
        title: '创建人',
        dataIndex: 'createUserId',
        key: 'createUserId'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content'
    }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: '类型',
        dataIndex: 'types',
        key: 'types',
        render: (text) => {
            let data = '';
            if (text == '0') {
                data = 'app消息';
            }
            if (text == '1') {
                data = '站内信';
            }
            if (text == '2') {
                data = '短信';
            }
            if (text == '3') {
                data = '邮件';
            }
            if (text == '4') {
                data = '公众号';
            }
            if (text == '5') {
                data = '商户';
            }
            return data;
        }
    }, {
        title: '消息分类',
        dataIndex: 'newsType',
        key: 'newsType',
        render: (text) => {
            let data = '';
            if (text == '0') {
                data = '系统通知';
            }
            if (text == '1') {
                data = '信贷通知';
            }
            if (text == '2') {
                data = '还款通知';
            }
            if (text == '3') {
                data = '活动通知';
            }
            if (text == '4') {
                data = '卡券通知';
            }
            if (text == '5') {
                data = '短信';
            }
            return data;
        }
    }, {
        title: '是否已读',
        dataIndex: 'isRead',
        key: 'isRead',
        render: (text) => {
            let data = '';
            if (text == 0) {
                data = '未读';
            }
            if (text == 1) {
                data = '已读';
            }
            return data;
        }
    }, {
        title: '终端',
        dataIndex: 'terminal',
        key: 'terminal',
        render: (text) => {
            let data = '';
            if (text == '0') {
                data = '光伏贷';
            }
            if (text == '1') {
                data = '壹税通';
            }
            return data;
        }
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pageSize: 10,
            showScreen: false,
            id: '',
            isRead: '',
            status: '',
            terminal: '',
            newsType:'',
            toPhone:'',
            toUserId:'',
            content:'',
            title:'',
            toEmail:'',
            types:'',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'title'
        };
    }
    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.getList({
            userId: userData.id,
            page: 1,
            size: 10
        });
    }
    onSelect (record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        })
    }
    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys+1,
                    id: item.id,
                    createUserId: item.createUserId,
                    createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
                    content: item.content,
                    title: item.title,
                    terminal: item.terminal,
                    types: item.types,
                    newsType: item.newsType,
                    isRead: item.isRead,
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
                    this.props.getList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        isRead: this.state.isRead,
                        newsType: this.state.newsType,
                        terminal: this.state.terminal,
                        types: this.state.types
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.getList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        isRead: this.state.isRead,
                        newsType: this.state.newsType,
                        terminal: this.state.terminal,
                        types: this.state.types
                    });
                }
            }
        };
    }
    handleSearch() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.getList({
            userId: userData.id,
            page: '1',
            size: pageSize1,
            title: this.state.inputVal,
            isRead: this.state.isRead,
            newsType: this.state.newsType,
            terminal: this.state.terminal,
            types: this.state.types
        });
    }
  handleSelectChange(type, value) {
    this.setState({[type]: value});
  }
  inputChange (ev) {
    this.setState({
      inputVal: ev.target.value
    })
  }
  selectChange (ev) {
    this.setState({
      inputVal: '',
      optionVal: ev
    })
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
  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.getList({userId: userData.id, page: 1, size: 10})
  }
  //index组件与Detail组件传值
  DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:data})
      }, 500);
    })
  }

  render() {
      const {data} = this.props;
      const {showScreen} = this.state;
      const {getFieldDecorator} = this.props.form;
      const content = data ? this.formart(data) : [];
      let Element = '';
      if (showScreen) {
        Element = (
          <Row style={{marginTop: '15px'}}>
            <Col span={4}>
              <FormItem
                label={(<span style={{fontSize: 14}}>是否已读</span>)}
                labelCol={{span: 7}}
                wrapperCol={{span: 13}}>
                  <Select 
                      defaultValue=""
                      onChange={this.handleSelectChange.bind(this, 'isRead')}
                      value={this.state.isRead}
                      style={{ width: '100%'}} >
                    <Option value="">全部</Option>
                    <Option value="0">未读</Option>
                    <Option value="1">已读</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                label={(<span style={{fontSize: 14}}>推送状态</span>)}
                labelCol={{span: 7}}
                wrapperCol={{span: 13}}>
                    <Select 
                        defaultValue=""
                        onChange={this.handleSelectChange.bind(this, 'terminal')}
                        value={this.state.terminal}
                        style={{ width: '100%'}} >
                      <Option value="">全部</Option>
                      <Option value="0">光伏贷</Option>
                      <Option value="1">壹税通</Option>
                    </Select>
              </FormItem>
            </Col>
            <Col span={4}>
                <FormItem
                    label={(<span style={{fontSize: 14}}>消息分类</span>)}
                    labelCol={{span: 7}}
                    wrapperCol={{span: 13}}>
                    <Select 
                        onChange={this.handleSelectChange.bind(this, 'newsType')}
                        value={this.state.newsType}
                        style={{width: '100%'}}>
                        <Option value="">全部</Option>
                        <Option value="0">系统通知</Option>
                        <Option value="1">信贷通知</Option>
                        <Option value="2">还款通知</Option>
                        <Option value="3">活动通知</Option>
                        <Option value="4">卡券通知</Option>
                        <Option value="5">短信</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span={4}>
                <FormItem
                    label={(<span style={{fontSize: 14}}>类型</span>)}
                    labelCol={{span: 5}}
                    wrapperCol={{span: 13}}>
                    <Select 
                      onChange={this.handleSelectChange.bind(this, 'types')} 
                      value={this.state.types}
                      style={{width: '100%'}}>
                        <Option value="">全部</Option>
                        <Option value="0">app消息</Option>
                        <Option value="1">站内信</Option>
                        <Option value="2">短信</Option>
                        <Option value="3">邮件</Option>
                        <Option value="4">公众号</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span={2} offset={6}>
                <Col span={14}>
                    <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                </Col>
                <Col>
                  <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                    收起 <Icon type="up" />
                  </a>
                </Col>
            </Col>
          </Row>
        )
      }
      return (
        <div className={styles.commonBox}>
            <div className={styles.search}>
                    <Row >
                        <Col span={1} style={{marginRight:'3%'}}>
                        <Button type="primary" 
                            onClick={this.sendShow.bind(this, 'addVisible')} 
                            style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增模板</Button>
                        </Col>
                        <Col span={20} style={{marginRight:'1%'}} key="agment">
                            <Col span={6}>
                            <InputGroup compact>
                                {getFieldDecorator('type', {initialValue: 'title'})(
                                <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                    <Option value="title">标题</Option>
                                </Select>
                                )}
                                <Input style={{ width: '70%' }}
                                    maxLength={50}
                                    value={this.state.inputVal} 
                                    onChange={this.inputChange.bind(this)} 
                                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                    placeholder="输入搜索内容" />
                            </InputGroup>
                            </Col>
                        </Col>
                        <Col span={2} style={{display:showScreen?'none':''}}>
                        <Col span={14}>
                            <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                        </Col>  
                        <Col>
                            <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                            展开 <Icon type="down" />
                            </a>
                        </Col>
                        </Col>
                    </Row>
                    { Element }
            </div>
            <div style={{height: 14,backgroundColor: '#ccc'}}></div>

            <div style={{width: '100%',backgroundColor: "#FFF",padding:24}}>
                <Row>
                    <Table
                        loading={this.props.loading}
                        columns={columns}
                        dataSource={content.data}
                        rowKey={record => record.id}
                        onRow={(record) => ({
                            onClick: this.onSelect.bind(this, record)
                        })
                        }
                        pagination={content.pagination}
                        bordered
                        size="middle"/>
                </Row>
            </div>

            <Drawer
              title="新增模板"
              width="45%"
              placement="right"
              onClose={this.handleCancel.bind(this, 'addVisible')}
              maskClosable={false}
              visible={this.state.addVisible}
              destroyOnClose
              style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
              >
              <Add search={this.search.bind(this)} />
            </Drawer>

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
              <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
            </Drawer>

            <Drawer
              title="编辑"
              width="45%"
              placement="right"
              onClose={this.handleCancel.bind(this, 'editVisible')}
              maskClosable={false}
              destroyOnClose
              visible={this.state.editVisible}
              style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
              >
              <Edit search={this.search.bind(this)} />
            </Drawer>
        </div>
      )
  }
}

function mapStateToProps(state, ownProps) {
    return {
        // argument: state.message.newsData,
        data: state.message.listData,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.message
    }
}
function dispatchToProps(dispatch) {
    return {
        getList(payload, params) {
            dispatch({type: 'message/getList', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'message/newSave', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
