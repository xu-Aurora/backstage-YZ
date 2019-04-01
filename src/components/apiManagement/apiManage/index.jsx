import React from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,message,DatePicker,Table,Modal,Drawer} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import styles from '../index.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

let pageSize1 = 10;

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
        title: '序号',
        dataIndex: 'key',
        key: 'key'
    },
    {
        title: 'API描述',
        dataIndex: 'apiMemo',
        key: 'apiMemo'
    }, {
        title: 'API名称',
        dataIndex: 'apiName',
        key: 'apiName'
    }, {
        title: 'API中文名称',
        dataIndex: 'apiRemark',
        key: 'apiRemark'
    }, {
        title: '服务名',
        dataIndex: 'serviceName',
        key: 'serviceName'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '分组ID',
        dataIndex: 'groupId',
        key: 'groupId'
    }, {
        title: '商户所有权认证',
        dataIndex: 'merchantAuthorizeType',
        key: 'merchantAuthorizeType',
        render: (text) => text == '1' ? '需要' : '无需'
    }, {
        title: '模块ID',
        dataIndex: 'moduleId',
        key: 'moduleId'
    }, {
        title: '模块名称',
        dataIndex: 'moduleName',
        key: 'moduleName'
    }, {
        title: '参数校验',
        dataIndex: 'parameterAuthorizeType',
        key: 'parameterAuthorizeType',
        render: (text) => text == '1' ? '需要' : '无需'
    }, {
        title: '所属项目',
        dataIndex: 'projectName',
        key: 'projectName'
    }, {
        title: '结果进行转译',
        dataIndex: 'returnCodeTranslate',
        key: 'returnCodeTranslate',
        render: (text) => text == '1' ? '不转译' : '转译'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == '1' ? '禁用' : '正常'
    }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            // pageSize: 10,
            startTime: '',
            endTime: '',
            apiName: '',
            serviceName: '',
            isSelect: false,
            visibleShow: false,
            id: '',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'apiName'
        };
    }
    handleReturn = () => {
        history.back(-1);
    }
    onSelect (record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        })
    }
    timeRange (type, date, times) {
        if (type === 'x1') {
            this.setState({startTime: times})
        }
        if (type === 'x2') {
            this.setState({endTime: times})
        }
    }

    handleSearch() {
        const userData = JSON.parse(localStorage.getItem('userDetail')).id || this.props.linkID;
        this.props.form.validateFields((err, values) => {
            if (values.type === 'apiName') {
                this.props.p_list({
                    userId: userData, 
                    apiName: this.state.inputVal, 
                    page: '1', 
                    size: pageSize1,
                    startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                    endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : ''
                });
            }
            if (values.type === 'serviceName') {
                this.props.p_list({
                    userId: userData, 
                    serviceName: this.state.inputVal, 
                    page: '1', 
                    size: pageSize1,
                    startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                    endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : ''
                });
            }
        })
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
    formart = (content) => {
        let start;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        let self = this
        if (content.list) {
            content.list.forEach((item, keys) => {
                let key = keys + 1;
                if (content.pageNum > 1) {
                  key = (content.pageNum - 1) * content.pageSize + key;
                }
                data.push({
                    key: key,
                    id: item.id,
                    apiMemo: item.apiMemo,
                    apiName: item.apiName,
                    apiRemark: item.apiRemark,
                    authorizeType: item.authorizeType,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    groupId: item.groupId,
                    merchantAuthorizeType: item.merchantAuthorizeType,
                    moduleId: item.moduleId,
                    moduleName: item.moduleName,
                    parameterAuthorizeType: item.parameterAuthorizeType,
                    projectName: item.projectName,
                    returnCodeTranslate: item.returnCodeTranslate,
                    status: item.status,
                    serviceName: item.serviceName,
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
                // pageSize: content.size > this.state.pageSize ? content.size : this.state.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                    pageSize1 = pageSize;
                    this.props.p_list({
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : ''
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.p_list({
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : ''
                    });
                }
            }
        };
    }
    handleOk = (e) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        self.setState({
            visibleShow: false,
        })
        self.props.instDelete({
            params: {
                id: self.state.id,
                userId: userData.id,
            },
            func: function () {
                message.success('删除成功!', 1.5, function () {
                    self.props.p_list({page: 1, size: 10, userId: userData.id});
                })
            }
        });
    }


  handleSelectChange = (type, value) => {
      this.setState({[type]: value})
  }
  goPage = () => {
      this.setState({
      detailVisible: true
      })
  }

  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
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
        [item]: false
    })
    this.props.p_list({userId: userData.id, page: 1, size: 10})
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
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        const {showScreen} = this.state;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col span={12}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>创建时间</span>)}
                            labelCol={{span: 3}}
                            wrapperCol={{span: 21}}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x1')}
                                value={this.state.startTime ? Moment(this.state.startTime) : null}                                
                                style={{width: '33%'}}/>
                            <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x2')}
                                value={this.state.endTime ? Moment(this.state.endTime) : null}                                
                                style={{width: '33%'}}/>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={10}>
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
                    <Row>
                      <Col span={1} style={{marginRight:'2%'}}>
                        <Button type="primary" 
                          onClick={this.sendShow.bind(this, 'addVisible')} 
                          style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增</Button>
                      </Col>
                      <Col span={20} style={{marginRight:'1%'}} key="agment">
                          <Col span={6}>
                            <InputGroup compact>
                              {getFieldDecorator('type', {initialValue: 'apiName'})(
                                <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                  <Option value="apiName">API名称</Option>
                                  <Option value="serviceName">服务名</Option>
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
                    </Row >
                    {selectElemnt}
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
                    title="新增"
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
        pendingData: state.apiManagement.pendingData,
        linkID: state.login.userMsg.id,
        loading:state.loading.models.apiManagement
    }
}
function dispatchToProps(dispatch) {
    return {
        p_list(payload, params) {
            dispatch({type: 'apiManagement/p_list', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'apiManagement/p_save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'apiManagement/p_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
