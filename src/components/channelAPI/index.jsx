import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,DatePicker,Drawer,Select} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';
import Moment from 'moment';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

let pageSize1 = 10;

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;

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
        title: 'api编码',
        dataIndex: 'apiCode',
        key: 'apiCode'
    }, {
        title: 'api名称',
        dataIndex: 'apiName',
        key: 'apiName'
    }, {
        title: 'api版本',
        dataIndex: 'apiVersion',
        key: 'apiVersion'
    }, {
        title: '卡类型',
        dataIndex: 'cardTypeList',
        key: 'cardTypeList',
        render: (text) => {
            let status = '未知类型';
            if (text == '0' ) {
                status = '借记卡'
            }
            if (text == '1') {
                status = '贷记卡'
            }
            return status;
        }
    }, {
        title: '通道编码',
        dataIndex: 'channelCode',
        key: 'channelCode'
    }, {
        title: '调用类型',
        dataIndex: 'channelType',
        key: 'channelType',
        render: (text) => text == '1' ? '异步调用' : '同步调用'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '创建人',
        dataIndex: 'createUserId',
        key: 'createUserId'
    }, {
        title: '机构编码',
        dataIndex: 'instCode',
        key: 'instCode'
    }, {
        title: '是否为批量接口',
        dataIndex: 'isBatch',
        key: 'isBatch',
        render: (text) => text == '1' ? '是' : '否'
    }, {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo'
    }, {
        title: '前置服务地址',
        dataIndex: 'preUrl',
        key: 'preUrl'
    }, {
        title: '清算类型',
        key: 'settleType',
        dataIndex: 'settleType',
        render: (text) => {
            let status = '未知状态';

            let value = text.slice(0,2)
            let item = text.substring(2,4)

            if (value == '00') {  //普通通道
                if (item = '00') {
                    status = '普通通道-下单'
                }
            } else if (value == '01') { //支付通道
                if (item == '01') {
                    status = '支付通道-提现'
                }
                if (item == '02') {
                    status = '支付通道-充值'
                }
                if (item == '03') {
                    status = '支付通道-冲退'
                }
                if (item == '04') {
                    status = '支付通道-退票'
                }
                if (item == '05') {
                    status = '支付通道-支付'
                }
                if (item == '06') {
                    status = '支付通道-对账'
                }
            } else if (value == '02') { //收单通道
                if (item == '01') {
                    status = '收单通道-下单'
                }
                if (item == '02') {
                    status = '收单通道-查询'
                }
                if (item == '03') {
                    status = '收单通道-关闭'
                }
                if (item == '04') {
                    status = '收单通道-撤销'
                }
                if (item == '05') {
                    status = '收单通道-退款'
                }
                if (item == '06') {
                    status = '收单通道-对账'
                }
            } else if (value == '03') { //解绑卡通道
                if (item == '01') {
                    status = '解绑卡通道-新增'
                }
                if (item == '02') {
                    status = '解绑卡通道-解绑'
                }
                if (item == '03') {
                    status = '解绑卡通道-获取短信'
                }
            }
            return status;
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == '1' ? '禁用' : '启用'
    }, {
        title: '通道类型',
        key: 'type',
        dataIndex: 'type',
        render: (text) => {
            let status = '未知状态';
            if (text == '00' ) {
                status = '普通通道'
            }
            if (text == '01') {
                status = '支付通道'
            }
            if (text == '02') {
                status = '收单通道'
            }
             if (text == '03') {
                status = '解绑卡通道'
            }
            return status;
        }
    }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    }, {
        title: '更新人',
        dataIndex: 'updateUserId',
        key: 'updateUserId'
    }

];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            data: {},
            rowSelection: [],
            parentData: '',
            pagination: {},
            pageSize: 10,
            saveSelect: false,
            isSelect: false,
            createTime: '',
            endTime: '',
            companyCode: '',
            apiCode: '',
            taxpayerNo: '',
            status: '',
            isRead: '',
            setSelectVal: '',
            userData: {},
            visibleShow: false,
            selectedRows: '',
            startTime:'',
            endTime:'',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'apiCode'
        };
    }
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
       this.props.queryList({page: 1, size: 10, queryStatus: 4, instCode: userData.instCode, userId: userData.id});
    }
    formart = (content) => {
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
                    keys: key,
                    apiCode: item.apiCode,
                    apiName: item.apiName,
                    apiVersion: item.apiVersion,
                    cardTypeList: item.cardTypeList,
                    channelCode: item.channelCode,
                    channelType: item.channelType,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserId: item. createUserId,
                    instCode: item.instCode,
                    isBatch: item.isBatch,
                    memo: item.memo,
                    preUrl: item.preUrl,
                    settleType: item.settleType,
                    status: item.status,
                    type: item.type,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    id: item.id,
                    updateUserId: item.updateUserId,
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
                   this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        status: this.state.status
                       });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        status: this.state.status
                       });
                }
            }
        };
    }
    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if (values.type == 'apiCode') {
                this.props.queryList({
                    userId: userData.id,
                    apiCode: this.state.inputVal,
                    page: '1',
                    size: pageSize1,
                    status: this.state.status,
                    startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                    endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : ''
                });
            }
        })
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

    handleSelectChange = (type, value) => {
        if (type === 'isRead') {
            this.setState({isRead: value})
        }
        if (type === 'status') {
            this.setState({status: value})
        }
    }
    setSelectVal = (val) => {
        this.setState({setSelectVal: val});
    }
    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
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
          status: '',
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

    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col span={12}>
                        <FormItem
                            label={(<span style={{fontSize: 14 }}>创建时间</span>)}
                            labelCol={{span: 2}}
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
                    <Col span={4}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>状态</span>)}
                            labelCol={{span: 4}}
                            wrapperCol={{span: 13}}>
                            <Select
                                value={this.state.status}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">启用</Option>
                                <Option value="1">禁用</Option>
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
        const rowSelection = {
            onChange: this.onSelectChange
        }
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="通道API管理" key="1">
                            <Row>
                                <Col span={1} style={{marginRight:'2%'}}>
                                    <Button type="primary" 
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增</Button>
                                </Col>
                                <Col span={20} style={{marginRight:'1%'}} key="agment">
                                    <Col span={6}>
                                    <InputGroup compact>
                                        {getFieldDecorator('type', {initialValue: 'apiCode'})(
                                        <Select style={{ width: '30%' }}  onChange={this.selectChange.bind(this)}>
                                            <Option value="apiCode">api编码</Option>
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
                            {selectElemnt}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: 24,backgroundColor: "#FFF",marginTop: 20}}>
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
        data: state.channelAPI.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.channelAPI
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'channelAPI/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'channelAPI/save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'channelAPI/instDelete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
