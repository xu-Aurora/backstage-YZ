import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';
import Moment from 'moment';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

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
        title: '通道编号',
        dataIndex: 'channelCode',
        key: 'channelCode'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName'
    }, {
        title: '字段英文名',
        dataIndex: 'fieldEName',
        key: 'fieldEName'
    }, {
        title: '字段id',
        dataIndex: 'fieldId',
        key: 'fieldId'
    }, {
        title: '字段名称',
        dataIndex: 'fieldName',
        key: 'fieldName'
    }, {
        title: '规则组',
        dataIndex: 'ruleGroup',
        key: 'ruleGroup'
    }, {
        title: '校对值',
        dataIndex: 'ruleValue',
        key: 'ruleValue'
    }, {
        title: '分值',
        dataIndex: 'score',
        key: 'score'
    }, {
        title: '策略类型',
        dataIndex: 'strategyType',
        key: 'strategyType',
        render: (text) => text == '1' ? '选优策略' : '否决策略'
    }, {
        title: '规则类型',
        key: 'type',
        dataIndex: 'type',
        render: (text) => {
            let status = '未知类型';
            const val = parseInt(text, 10);
            if (val === 0) {
                status = '大于'
            }
            if (val === 1) {
                status = '大于等于'
            }
             if (val === 2) {
                status = '等于'
            }
             if (val === 3) {
                status = '小于'
            }
             if (val === 4) {
                status = '小于等于'
            }
             if (val === 5) {
                status = '不等于'
            }
             if (val === 6) {
                status = '匹配'
            }
             if (val === 7) {
                status = '不匹配'
            }
            return status;
        }
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
            startTime: '',
            endTime: '',
            companyCode: '',
            fieldId: '',
            score: '',
            status: '',
            type: '',
            userData: {},
            visibleShow: false,
            selectedRows: '',
            optionVal:'fieldId'
        };
    }
    handleSearch = () => {
        this.props.form.validateFields((err, values) => {
            if (values.type === 'fieldId') {
                this.props.queryList({
                    userId: this.state.userData.id,
                    page: '1',
                    size: pageSize1,
                    fieldId: this.state.inputVal,
                    type: this.state.type,
                });
            }
            if (values.type === 'score') {
                this.props.queryList({
                    userId: this.state.userData.id, 
                    page: '1', 
                    size: pageSize1,
                    score: this.state.inputVal, 
                    type: this.state.type
                });
            }
        })



    }
    handelSelect = (record, selected, selectedRows) => {
        this.props.saveSelect(record.alldata);
        this.setState({saveSelect: record.alldata});
    }
    onSelect = (record, e) => {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        });
    }
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
    //    userData.instCode = Service.platformType === 'bus_backstage' ? userData.institutions.code : userData.institutions.code ? userData.institutions.code.slice(0, 4) : '';
       this.props.queryList({page: 1, size: 10, userId: userData.id});
       this.setState({userData})
    }
    formart = (content) => {
        const data = [];
        let self = this;
        if (content.list) {
            content.list.forEach((item, keys) => {
                let key = keys + 1;
                if (content.pageNum > 1) {
                    key = (content.pageNum - 1) * content.pageSize + key;
                }
                data.push({
                    keys: key,
                    channelCode: item.channelCode,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserName: item.createUserName,
                    fieldEName: item.fieldEName,
                    fieldId: item.fieldId,
                    fieldName: item.fieldName,
                    ruleGroup: item.ruleGroup,
                    id: item.id,
                    ruleValue: item.ruleValue,
                    score: item.score,
                    strategyType: item.strategyType,
                    type: item.type,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    updateUserName: item.updateUserName,
                    alldata: item
                })
            });
        }
        return {
            data,
            pagination: {
                total: content.total,
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
                        type: this.state.type
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                       userId: this.state.userData.id,
                       page: current,
                       size: pageSize,
                       [`${self.state.optionVal}`]: self.state.inputVal,
                        type: this.state.type
                    });
                }
            }
        };
    }
    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }
    setSelectVal = (val) => {
        this.setState({optionVal: val});
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
          type:''
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
                    <Col span={4}>
                        <FormItem
                            label={( <span style={{fontSize: 14}}>规则类型</span>)}
                            labelCol={{span: 7}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue=''
                                onChange={this.handleSelectChange.bind(this, 'type')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">大于</Option>
                                <Option value="1">大于等于</Option>
                                <Option value="2">等于</Option>
                                <Option value="3">小于</Option>
                                <Option value="4">小于等于</Option>
                                <Option value="5">不等于</Option>
                                <Option value="6">匹配</Option>
                                <Option value="7">不匹配 </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={18}>
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
                        <TabPane tab="规则管理" key="1">
                            <Row>
                                <Col span={1} style={{marginRight:'2%'}}>
                                    <Button type="primary" 
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增</Button>
                                </Col>
                                <Col span={20} style={{marginRight:'1%'}} key="agment">
                                <Col span={6}>
                                    <InputGroup compact>
                                    {getFieldDecorator('type', {initialValue: 'fieldId'})(
                                        <Select style={{ width: '30%' }} onChange={this.setSelectVal.bind(this)}>
                                            <Option value="fieldId">字段id</Option>
                                            <Option value="score">分值</Option>
                                        </Select>
                                    )}
                                    <Input style={{ width: '70%' }} 
                                        maxLength={50}
                                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        value={this.state.inputVal} onChange={(e)=> this.setState({inputVal:e.target.value})}
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
                            rowSelection={rowSelection}
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
                    title="新增"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'addVisible')}
                    maskClosable={false}
                    visible={this.state.addVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Add search={this.search.bind(this)} />
                </Drawer>

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
                    <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
                </Drawer>

                <Drawer
                    title="新增/编辑"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editVisible')}
                    maskClosable={false}
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
        data: state.rulesManagement.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.rulesManagement
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'rulesManagement/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'rulesManagement/save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'rulesManagement/instDelete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
