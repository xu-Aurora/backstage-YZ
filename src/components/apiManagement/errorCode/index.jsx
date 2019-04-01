import React from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,message,Table,Drawer} from 'antd';
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
        key: 'key',
        sorter: (a, b) => a.key - b.key
    },
    {
        title: '接口id',
        dataIndex: 'interfaceId',
        key: 'interfaceId'
    }, {
        title: '接口名',
        dataIndex: 'interfaceName',
        key: 'interfaceName'
    }, {
        title: '模块id',
        dataIndex: 'moduleId',
        key: 'moduleId'
    }, {
        title: '模块名',
        dataIndex: 'moduleName',
        key: 'moduleName'
    }, {
        title: '内部系统结果码',
        dataIndex: 'retCode',
        key: 'retCode'
    }, {
        title: '内部系统结果消息',
        dataIndex: 'retMsg',
        key: 'retMsg'
    }, {
        title: '返回结果码',
        dataIndex: 'returnCode',
        key: 'returnCode'
    }, {
        title: '返回结果消息',
        dataIndex: 'returnMsg',
        key: 'returnMsg'
    }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            defaultTimex1: null,
            defaultTimex2: null,
            startTime: '',
            endTime: '',
            isSelect: false,
            visibleShow: false,
            id: '',
            interfaceName: '',
            interfaceName1: '',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'interfaceName'
        };
    }
    onSelect (record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        })
    }
    handleSearch() {
        const userData = JSON.parse(localStorage.getItem('userDetail')).id || this.props.linkID;
        this.props.form.validateFields((err, values) => {
            if (values.type === 'interfaceName') {
                this.props.queryList({userId: userData, interfaceName: this.state.inputVal, page: '1', size: pageSize1});
            }
            if (values.type === 'moduleName') {
                this.props.queryList({userId: userData, moduleName: this.state.inputVal, page: '1', size: pageSize1});
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
                    interfaceId: item.interfaceId,
                    interfaceName: item.interfaceName,
                    moduleId: item.moduleId,
                    moduleName: item.moduleName,
                    retCode: item.retCode,
                    retMsg: item.retMsg,
                    returnCode: item.returnCode,
                    returnMsg: item.returnMsg,
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
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal
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
                    self.props.queryList({page: 1, size: 10, userId: userData.id});
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


    render() {
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        const content = data ? this.formart(data) : [];
        return (
            <div className={styles.commonBox}>
            <div className={styles.search}>
                <Row>
                    <Col span={1} style={{marginRight:'1%'}}>
                        <Button type="primary" 
                        onClick={this.sendShow.bind(this, 'addVisible')} 
                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增</Button>
                    </Col>

                    <Col span={5} style={{marginRight:'1%'}} key="agment">
                        <Col span={24}>
                            <InputGroup compact>
                            {getFieldDecorator('type', {initialValue: 'interfaceName'})(
                                <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                <Option value="interfaceName">接口名</Option>
                                <Option value="moduleName">模块名</Option>
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

                    <Col span={1}>
                        <Col span={14}>
                            <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                        </Col> 
                    </Col>
                </Row >
            </div>
            <div style={{height: 14,backgroundColor: '#ccc'}}></div>
            <div style={{width: '100%',backgroundColor: "#FFF",padding:24}}>
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
        queryList(payload, params) {
            dispatch({type: 'apiManagement/t_list', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'apiManagement/t_save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'apiManagement/t_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
