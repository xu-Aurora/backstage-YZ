import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Drawer,Row,Col,Icon,Table,DatePicker,Select} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';
import Moment from 'moment';
import Service from '../../service';

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
        title: '通道编码',
        dataIndex: 'channelCode',
        key: 'channelCode'
    }, {
        title: '通道名称',
        dataIndex: 'channelName',
        key: 'channelName'
    }, {
        title: '版本',
        dataIndex: 'channelVersion',
        key: 'channelVersion'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == '1' ? '禁用' : '启用'
    }, {
        title: '创建人',
        dataIndex: 'createUserId',
        key: 'createUserId'
    }, {
        title: '机构编码',
        dataIndex: 'instCode',
        key: 'instCode'
    }, {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo'
    },{
        title: '通道类型',
        key: 'type',
        dataIndex: 'type',
        render: (text) => {
            let status = '未知状态';
            if (text == '00') {
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
            orderNo: '',
            taxpayerNo: '',
            status: '',
            type: '',
            setSelectVal: '',
            userData: {},
            visibleShow: false,
            selectedRows: '',
            channelCode: '',
            startTime:'',
            endTime:'',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'channelCode'
        };
    }
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
    //    userData.instCode = Service.platformType === 'bus_backstage' ? userData.institutions.code : userData.institutions.code ? userData.institutions.code.slice(0, 4) : '';
       this.props.queryList({
           page: 1,
           size: 10,
           userId: userData.id,
           type: this.state.type
        });
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
                    channelCode: item.channelCode,
                    channelName: item.channelName,
                    channelVersion: item.channelVersion,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserId: item.createUserId,
                    instCode: item.instCode,
                    id: item.id,
                    memo: item.memo,
                    status: item.status,
                    type: item.type,
                    status: item.status,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss") : '',
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
                        userId: this.state.userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        type:  this.state.type
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
                        type: this.state.type
                       });

                }
            }
        };
    }
    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if (values.type === 'channelCode') {
                this.props.queryList({
                    userId: userData.id,
                    channelCode: this.state.inputVal,
                    page: '1',
                    size: pageSize1,
                    startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                    endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                    type: this.state.type
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
        if (type === 'type') {
            this.setState({type: value})
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
          startTime: '',
          endTime: '',
          type: ''
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
                            label={(<span style={{fontSize: 14}}>创建时间</span>)}
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
                            label={(<span style={{fontSize: 14}}>通道类型</span>)}
                            labelCol={{span: 6}}
                            wrapperCol={{span: 13}}>
                            <Select
                                value={this.state.type}
                                onChange={this.handleSelectChange.bind(this, 'type')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="00">普通通道</Option>
                                <Option value="01">支付通道</Option>
                                <Option value="02">收单通道</Option>
                                <Option value="03">解绑卡通道</Option>
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
            <div style={{ width: '100%',height: '100%'}} className={styles.commonBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="机构通道管理" key="1">
                            <Row>
                                <Col span={1} style={{marginRight:'2%'}}>
                                  <Button type="primary" 
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增</Button>
                                </Col>
                                <Col span={20} style={{marginRight:'1%'}} key="agment">
                                  <Col span={6}>
                                    <InputGroup compact>
                                      {getFieldDecorator('type', {initialValue: 'channelCode'})(
                                        <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                          <Option value="channelCode">通道编码</Option>
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
                            rowKey={record => record.id}
                            dataSource={content.data}
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
        data: state.agencyChannel.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.agencyChannel
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'agencyChannel/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'agencyChannel/save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'agencyChannel/instDelete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
