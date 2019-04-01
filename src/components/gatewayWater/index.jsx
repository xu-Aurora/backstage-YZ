import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Table,DatePicker,Select,Icon,Drawer} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';
import Moment from 'moment';
import Detail from './detail.jsx';

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
        title: '序号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
    }, {
        title: '交易金额',
        dataIndex: 'amount',
        key: 'amount'
    }, {
        title: 'api编码',
        dataIndex: 'apiCode',
        key: 'apiCode'
    }, {
        title: '清算类型',
        key: 'apiType',
        dataIndex: 'apiType',
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
            }
            return status;
        }
    }, {
        title: '订单号',
        dataIndex: 'bizOrderNo',
        key: 'bizOrderNo'
    }, {
        title: '业务状态',
        key: 'bizStatus',
        dataIndex: 'bizStatus',
        render: (text) => {
            let status = '未知状态';
            const val = parseInt(text, 10);
            if (val == 0) {
                status = '未知'
            }
            if (val == 1) {
                status = '成功'
            }
            if (val == 2) {
                status = '失败'
            }
            if (val == 3) {
                status = '关闭'
            }
            if (val == 4) {
                status = '处理中'
            }
            return status;
        }
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '创建人',
        dataIndex: 'createUserId',
        key: 'createUserId'
    }, {
        title: '网关流水号',
        dataIndex: 'gatewayNo',
        key: 'gatewayNo'
    }, {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo'
    }, {
        title: '支付方业务代码',
        dataIndex: 'payCode',
        key: 'payCode'
    }, {
        title: '手续费',
        dataIndex: 'percent',
        key: 'percent'
    },{
        title: '状态',
        key: 'settlementStatus',
        dataIndex: 'settlementStatus',
        render: (text) => {
            let status = '未知状态';
            if (text == 'A') {
                status = '待处理'
            }
            if (text == 'I') {
                status = '处理中'
            }
            if (text == 'P') {
                status = '已下单'
            }
            if (text == 'C') {
                status = '撤销'
            }
            if (text == 'S') {
                status = '成功'
            }
            if (text == 'F') {
                status = '失败'
            }
            return status;
        }
    },
    // {
    //     title: '更新时间',
    //     dataIndex: 'updateTime',
    //     key: 'updateTime'
    // },
    // {
    //     title: '更新人',
    //     dataIndex: 'updateUserId',
    //     key: 'updateUserId'
    // }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: {},
            rowSelection: [],
            parentData: '',
            pagination: {},
            pageSize: 10,
            saveSelect: false,
            isSelect: false,
            startTime: '',
            endTime: '',
            companyCode: '',
            apiCode: '',
            bizStatus: '',
            isRead: '',
            setSelectVal: '',
            userData: {},
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'apiName'
        };
    }
   
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
    //    userData.instCode = Service.platformType === 'bus_backstage' ? userData.institutions.code : userData.institutions.code ? userData.institutions.code.slice(0, 4) : '';
       this.props.queryList({page: 1, size: 10, userId: userData.id});
       this.setState({userData})
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
                    amount: item.amount,
                    apiCode: item.apiCode,
                    apiType: item.apiType,
                    bizOrderNo: item.bizOrderNo,
                    bizStatus: item.bizStatus,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserId: item.createUserId,
                    id: item.id,
                    gatewayNo: item.gatewayNo,
                    memo: item.memo,
                    payCode: item.payCode,
                    percent: item.percent,
                    settlementStatus: item.settlementStatus,
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
                        userId: this.state.userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        bizStatus: this.state.bizStatus
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: this.state.userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        bizStatus: this.state.bizStatus
                    });
                }
            }
        };
    }
    handleSearch (val) {
        this.props.queryList({
            userId: this.state.userData.id,
            apiCode: this.state.inputVal,
            page: '1',
            size: pageSize1,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
            bizStatus: this.state.bizStatus
        });
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
    onSelect(record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({detailVisible: true});
    }
    timeRange (type, date, times) {
        if (type === 'x1') {
            this.setState({startTime: times})
        }
        if (type === 'x2') {
            this.setState({endTime: times})
        }
    }

    handleSelectChange = (type, value) => {
        if (type === 'isRead') {
            this.setState({isRead: value})
        }
        if (type === 'bizStatus') {
            this.setState({bizStatus: value})
        }
    }
    setSelectVal = (val) => {
        this.setState({setSelectVal: val});
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

    goPage = () => {
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
                        <FormItem label={(<span style={{fontSize: 14}}>创建时间</span>)}
                            labelCol={{ span: 2}}
                            wrapperCol={{span: 20}}>
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
                            label={(<span style={{fontSize: 14}}>业务状态</span>)}
                            labelCol={{span: 7}}
                            wrapperCol={{span: 13}}>
                            <Select
                                value={this.state.bizStatus}                                
                                onChange={this.handleSelectChange.bind(this, 'bizStatus')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">成功</Option>
                                <Option value="2">失败</Option>
                                <Option value="3">关闭</Option>
                                <Option value="4">处理中</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={6}>
                      <Col span={14}>
                          <Button type="primary"  onClick={this.handleSearch.bind(this)}>确定</Button>
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
            <div style={{ width: '100%',height: '100%'}} className={styles.commonBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="网关系统" key="1">
                          <Row>
                              <Col span={21} style={{marginRight:'3%'}} key="agment">
                                <Col span={6}>
                                  <InputGroup compact>
                                    {getFieldDecorator('type', {initialValue: 'apiCode'})(
                                      <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
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
                                    <Button type="primary"  onClick={this.handleSearch.bind(this)}>确定</Button>
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
                    title="详情"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'detailVisible')}
                    maskClosable={false}
                    destroyOnClose
                    visible={this.state.detailVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Detail search={this.search.bind(this)} />
                </Drawer>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.gatewayWater.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.gatewayWater
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'gatewayWater/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'gatewayWater/save', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
