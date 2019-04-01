import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,message,Select,Drawer} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';
import Moment from 'moment';
import Service from '../../service';

import Detail from './detail.jsx';

let pageSize1 = 10;

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
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
        title: '流水号',
        dataIndex: 'flowNo',
        key: 'flowNo'
    }, {
        title: '日志编号',
        dataIndex: 'logid',
        key: 'logid'
    }, {
        title: '交易响应代码',
        dataIndex: 'rtncode',
        key: 'rtncode'
    }, {
        title: '交易响应信息',
        dataIndex: 'rtnmsg',
        key: 'rtnmsg'
    }, {
        title: '接口发送开始时间',
        dataIndex: 'sendstarttime',
        key: 'sendstarttime'
    }, {
        title: '接口发送结束时间',
        dataIndex: 'sendendtime',
        key: 'sendendtime'
    }, {
        title: '交易通道api',
        dataIndex: 'transchannel',
        key: 'transchannel'
    }, {
        title: '交易名称',
        dataIndex: 'transcode',
        key: 'transcode'
    }, {
        title: '接口关键字',
        dataIndex: 'transkeyword',
        key: 'transkeyword'
    }
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
            transchannel: '',
            transkeyword: '',
            flowNo: '',
            transCode: '',
            status: '',
            isRead: '',
            setSelectVal: '',
            userData: {},
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'flowNo'
        };
    }
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
       this.props.queryList({page: 1, size: 10, userId: userData.id});
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
                    flowNo: item.flowNo,
                    logid: item.logid,
                    rtncode: item.rtncode,
                    rtnmsg: item.rtnmsg,
                    sendendtime: item.sendendtime ? Moment(item.sendendtime).format("YYYY-MM-DD HH:mm:ss") : '',
                    sendstarttime: item.sendstarttime ? Moment(item.sendstarttime).format("YYYY-MM-DD HH:mm:ss") : '',                    
                    transchannel: item.transchannel,
                    transcode: item.transcode,
                    transkeyword: item.transkeyword,
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
                defaultCurrent: content.page,
                // pageSize: content.size > this.state.pageSize ? content.size : this.state.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                    pageSize1 = pageSize;
                   this.props.queryList({
                       userId: userData.id, 
                       page: current, 
                       size: pageSize,
                       [`${self.state.optionVal}`]: self.state.inputVal
                    });
                },
                onChange: (current, pageSize) => {
                   this.props.queryList({
                       userId: userData.id, 
                       page: current, 
                       size: pageSize,
                       [`${self.state.optionVal}`]: self.state.inputVal
                    });
                
                }
            }
        };
    }
    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if (values.type === 'flowNo') {
                this.props.queryList({userId: userData.id, flowNo: this.state.inputVal, page: '1', size: pageSize1});
            }
            if (values.type === 'transCode') {
                this.props.queryList({userId: userData.id, transCode: this.state.inputVal, page: '1', size: pageSize1});
            }
            if (values.type === 'transchannel') {
                this.props.queryList({userId: userData.id, transchannel: this.state.inputVal, page: '1', size: pageSize1});
            } 
            if (values.type === 'transkeyword') {
                this.props.queryList({userId: userData.id, transkeyword: this.state.inputVal, page: '1', size: pageSize1});
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

    setSelectVal = (val) => {
        this.setState({setSelectVal: val});
    }
    goDetail(url) {
        if (this.state.isSelect) {
           this.context.router.history.push(`/${this.props.match.params.id}/app/callLog/template`)
        } else {
            message.error('未选择表中数据!', 1.5)
        }
    }

      goPage = () => {
        this.setState({
          detailVisible: true
        })
      }
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

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        const rowSelection = {
            onChange: this.onSelectChange
        }

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
                <div style={{ width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="调用日志管理" key="1">
                            <Form className="ant-advanced-search-form"  layout="horizontal">
                                <Row>
                                    <Col span={6} style={{marginRight:'1%'}} key="agment">
                                        <Col span={23}>
                                            <InputGroup compact>
                                            {getFieldDecorator('type', {initialValue: 'flowNo'})(
                                                <Select style={{ width: '35%' }}  onChange={this.selectChange.bind(this)}>
                                                    <Option value="flowNo">流水号</Option>
                                                    <Option value="transCode">交易名称</Option>
                                                    <Option value="transchannel">交易通道api</Option>
                                                    <Option value="transkeyword">接口关键字</Option>
                                                </Select>
                                            )}
                                            <Input style={{ width: '65%' }}
                                                maxLength={50}
                                                value={this.state.inputVal} 
                                                onChange={this.inputChange.bind(this)}  
                                                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                                placeholder="输入搜索内容" />
                                            </InputGroup>
                                        </Col>
                                    </Col>

                                    <Col span={2}>
                                    <Col span={14}>
                                        <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                                    </Col>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: 24,backgroundColor: "#FFF",marginTop: 20}}>
                    <Row>
                        <Table
                            loading={this.props.loading}
                            columns={columns}
                            dataSource={content.data}
                            rowKey={record => record.keys}
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
App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.callLog.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.callLog
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'callLog/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'callLog/save', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));