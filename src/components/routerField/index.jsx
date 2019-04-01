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
        title: '通道码',
        dataIndex: 'channelCode',
        key: 'channelCode'
    }, {
        title: '字段名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    },{
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        render: (text) => {
            let data = '';
            if (data == 0) {
                data = '数字'
            }
            if (data == 1) {
                data = '字符串'
            }
            if (data == 2) {
                data = '时间'
            }
            if (data == 3) {
                data = 'BigDecim'
            }
            return data;
        }
    }, {
        title: '英文名',
        dataIndex: 'eName',
        key: 'eName'
    }, {
        title: '分值',
        dataIndex: 'score',
        key: 'score'
    }, {
        title: '策略类型',
        dataIndex: 'strategyType',
        key: 'strategyType',
        render: (text) => text == 1 ? '选优策略' : '否决策略'
    }, {
        title: '字段类型',
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
            let data = '';
            if (text == 0) {
                data = '原始'
            }
            if (text == 1) {
                data = '开发'
            }
            if (text == 2) {
                data = '订单'
            }
            return data;
        }
    }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    }, {
        title: '更新人',
        dataIndex: 'updateUserName',
        key: 'updateUserName'
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            data: {},
            rowSelection: [],
            pageSize: 10,
            channelCode: '',
            name: '',
            userData: {},
            visibleShow: false,
            selectedRows: '',
            type: '',
            optionVal:'channelCode'
        };
    }
    handleSearch = (val) => {
        this.props.form.validateFields((err, values) => {
            if(values.type == 'name') {
                this.props.queryList({
                    userId: this.state.userData.id, 
                    page: '1', 
                    size: pageSize1,
                    type: this.state.type,
                    name: this.state.inputVal
                });
            }
            if(values.type == 'channelCode') {
                this.props.queryList({
                    userId: this.state.userData.id, 
                    page: '1', 
                    size: pageSize1,
                    type: this.state.type,
                    channelCode: this.state.inputVal
                });
            }
        })

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
       this.props.queryList({page: 1, size: 10, userId: userData.id});
       this.setState({userData})
    }
    formart = (content) => {
        let self = this;
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                let key = keys + 1;
                if (content.pageNum > 1) {
                    key = (content.pageNum - 1) * content.pageSize + key;
                }
                data.push({
                    keys: key,
                    channelCode: item.channelCode,
                    name: item.name,
                    eName: item.eName,
                    createUserName: item.createUserName,
                    dataType: item.dataType,
                    score: item.score,
                    strategyType: item.strategyType,
                    id: item.id,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD") : '',
                    type: item.type,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD") : '',
                    updateUserName: item.updateUserName,
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
    setSelectVal = (val) => {
        this.setState({optionVal: val});
    }

    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }

    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
    }
      //展开与收起
      toggleForm = () => {
        this.setState({
          showScreen: !this.state.showScreen,
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
                    <Col span={3}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>字段类型</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'type')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">原始</Option>
                                <Option value="1">开发 </Option>
                                <Option value="2">订单 </Option>
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
                        <TabPane tab="路由字段管理" key="1">
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
                                        <Select style={{ width: '30%' }} onChange={this.setSelectVal.bind(this)}>
                                            <Option value="channelCode">通道码</Option>
                                            <Option value="name">字段名</Option>
                                        </Select>
                                    )}
                                    <Input style={{ width: '70%' }} 
                                        maxLength={50}
                                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        value={this.state.inputVal} 
                                        onChange={(e)=> this.setState({inputVal:e.target.value})}
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
                <div style={{width: '100%',padding: 24, backgroundColor: "#FFF",marginTop: 20}}>
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
        data: state.routerField.data,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.routerField
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'routerField/queryList', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'routerField/save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'routerField/remove', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
