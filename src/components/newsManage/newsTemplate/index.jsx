import React, {Component} from 'react';
import {Drawer,Button,Form,Row,Col,Table,Select,message} from 'antd';
import Moment from 'moment';
import {connect} from 'dva'
import styles from '../index.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

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
        title: '模版名称',
        dataIndex: 'templetName',
        key: 'templetName'
    }, {
        title: '模版内容',
        dataIndex: 'templetContent',
        key: 'templetContent'
    }, {
        title: '消息类型',
        dataIndex: 'types',
        key: 'types',
        render: (text) => {
            let data = '';
            if (text === '0') {
                data = '系统通知';
            }
            if (text === '1') {
                data = '信贷通知';
            }
            if (text === '2') {
                data = '还款通知';
            }
            if (text === '3') {
                data = '活动通知';
            }
            if (text === '4') {
                data = '卡券通知';
            }
            if (text === '5') {
                data = '短信';
            }
            if (text === '6') {
                data = '重置密码';
            }
            return data;
        }
    }, {
        title: '模版类型',
        dataIndex: 'templetType',
        key: 'templetType',
        render: (text) => {
            let data = '';
            if (text == '0') {
                data = 'app消息';
            }
            if (text == '1') {
                data = '站内信息';
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
        title: '是否启用',
        dataIndex: 'isInuse',
        key: 'isInuse',
        render: (text) => {
            let data = '';
            if (text === 0) {
                data = '禁用';
            }
            if (text === 1) {
                data = '启用';
            }
            return data;
        }
    }, {
        title: '终端',
        dataIndex: 'templetTerminal',
        key: 'templetTerminal',
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
            visible: false,
            visible1: false,
            data: [],
            pageSize: 10,
            showScreen: false,
            id: '',
            isEdit: false,
            ScreenVal: '',
            isSelect: false,
            templetName:'',
            types:'',
            types1:'',
            templetName1:'',
            templetType:'',
            isInuse:'',
            isInuse1:'',
            templetType1:'',
            templetTerminal:'',
            templetTerminal1:'',
            templetContent:'',
            templetContent1:'',
            templetDescribe:'',
            templetDescribe1:'',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
        };
    }
    
    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
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
        });
    }
    handleSearch (type, val) {
        this.setState({
            [type]: val
        })
    }
    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys+1,
                    id: item.id,
                    createUserId: item.createUserId,
                    createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
                    templetContent: item.templetContent,
                    isInuse: item.isInuse,
                    templetTerminal: item.templetTerminal,
                    types: item.types,
                    templetName: item.templetName,
                    templetType: item.templetType,
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
                        isRead: this.state.isRead,
                        newsType: this.state.newsType,
                        types: this.state.types
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        isRead: this.state.isRead,
                        newsType: this.state.newsType,
                        types: this.state.types
                    });
                }
            }
        };
    }

  handleSelectChange = (type, value) => {
    this.setState({[type]: value})
  }
  goPage = (url, event) => {
      this.setState({
      detailVisible: true
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
    this.props.queryList({userId: userData.id, page: 1, size: 10})
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
  sure () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
        userId: userData.id,
        isInuse: this.state.isInuse,
        templetType: this.state.templetType,
        types:  this.state.types,
        page: 1,
        size: pageSize1
    });
  }
    render() {
        const {data} = this.props;
        const content = data ? this.formart(data) : [];
        return (
            <div className={styles.commonBox}>
                <div className={styles.search}>
                    <Row >
                        <Form className="ant-advanced-search-form" layout="horizontal">
                            <Col span={2}>
                                <Button type="primary"
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增模板</Button>
                            </Col>
                            <Col span={20} style={{marginRight:'1%'}} key="agment">
                                <Col span={6}>
                                    <FormItem
                                        label={(<span style={{fontSize: 14}}>是否启用</span>)}
                                        labelCol={{span: 5}}
                                        wrapperCol={{span: 12}}>
                                        <Select onChange={this.handleSearch.bind(this, 'isInuse')} defaultValue={' '}>
                                            <Option value=" ">全部</Option>
                                            <Option value="0">禁用</Option>
                                            <Option value="1">启用</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        label={(<span style={{fontSize: 14}}>消息类型</span>)}
                                        labelCol={{span: 5}}
                                        wrapperCol={{span: 12}}>
                                        <Select onChange={this.handleSearch.bind(this, 'types')} defaultValue={' '}>
                                            <Option value=" ">全部</Option>
                                            <Option value="0">系统通知</Option>
                                            <Option value="1">信贷通知</Option>
                                            <Option value="2">还款通知</Option>
                                            <Option value="3">活动通知</Option>
                                            <Option value="4">卡券通知</Option>
                                            <Option value="5">短信</Option>
                                            <Option value="6">重置密码</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        label={(
                                        <span style={{fontSize: 14}}>模版类型</span>)}
                                        labelCol={{span: 5}}
                                        wrapperCol={{span: 12}}>
                                        <Select onChange={this.handleSearch.bind(this, 'templetType')} defaultValue={' '}>
                                            <Option value=" ">全部</Option>
                                            <Option value="0">app消息</Option>
                                            <Option value="1">站内信</Option>
                                            <Option value="2">短信</Option>
                                            <Option value="3">邮件</Option>
                                            <Option value="4">公众号</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Col>

                            <Col span={1}>
                              <Col span={14}>
                                  <Button type="primary" onClick={this.sure.bind(this)}>确定</Button>
                              </Col>
                            </Col>
                        </Form>
                    </Row>

                </div>
                <div style={{height: 14,backgroundColor: '#ccc'}}></div>
                <div style={{width: '100%',backgroundColor: "#FFF",padding:24}}>
                    <Row>
                        <Table
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
              destroyOnClose
              visible={this.state.addVisible}
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
      data: state.message.data, 
      linkID: state.login.userMsg.id}
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'message/queryList', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'message/save', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
