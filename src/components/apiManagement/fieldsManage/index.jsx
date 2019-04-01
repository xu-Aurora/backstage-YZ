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
        dataIndex: 'itfcId',
        key: 'itfcId'
    }, {
        title: '长度',
        dataIndex: 'length',
        key: 'length'
    }, {
        title: '参数',
        dataIndex: 'param',
        key: 'param'
    }, {
        title: '参数名称',
        dataIndex: 'paramName',
        key: 'paramName'
    }, {
        title: '默认参数值',
        dataIndex: 'dataValue',
        key: 'dataValue'
    }, {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        render: (text) => {
            let status = '';
            if (text == '0') {
                status = 'varchar';
            }
            if (text == '1') {
                status = 'int';
            }
            if (text == '2') {
                status = 'date';
            }
            if (text == '3') {
                status = 'object';
            }
            if (text == '4') {
                status = 'array<object>';
            }
            return status;
        }
    }, {
        title: '是否启用该请求参数',
        dataIndex: 'isEnable',
        key: 'isEnable',
        render: (text) => text == '1' ? '禁用' : '启用'
    }, {
        title: '是否可为空',
        dataIndex: 'isnull',
        key: 'isnull',
        render: (text) => text == '1' ? '不可以' : '可以'
    }, {
        title: '参数类型',
        dataIndex: 'paramType',
        key: 'paramType',
        render: (text) => {
            let status = '';
            if (text == '0') {
                status = '请求参数';
            }
            if (text == '1') {
                status = '返回参数';
            }
            if (text == '2') {
                status = '默认请求参数';
            }
            if (text == '3') {
                status = '默认返回参数';
            }
            return status;
        }
    }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
    }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            pageSize: 10,
            defaultTimex1: null,
            defaultTimex2: null,
            startTime: '',
            endTime: '',
            itfcId: '',
            paramType: '',
            isEnable: '',
            isSelect: false,
            visibleShow: false,
            id: '',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'itfcId'
        };
    }

    handelSelected = () => {
        this.setState({
            visible: !this.state.visible,
            isEnable:'',
            paramType:''
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
    timeRange = (type, date, times) => {
        let time
        if(date){
            time = date._d ? date._d.getTime() : Moment(times, 'YYYY-MM-DD HH:mm:ss');
        }
        // const time = date._d ? date._d.getTime() : Moment(times, 'YYYY-MM-DD HH:mm:ss');
        if (type === 'x1') {
            this.setState({startTime: time })
        }
        if (type === 'x2') {
            this.setState({endTime: time })
        }
    }

    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail')).id || this.props.linkID;
        this.props.queryList({
            userId: userData,
            itfcId: this.state.inputVal,
            paramType: this.state.paramType,
            isEnable: this.state.isEnable,
            page: '1',
            size: pageSize1
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
                    itfcId: item.itfcId,
                    length: item.length,
                    param: item.param,
                    paramType:item.paramType,
                    paramName: item.paramName,
                    dataValue: item.dataValue,
                    dataType: item.dataType,
                    isEnable: item.isEnable,
                    isnull: item.isnull,
                    alldata: item,
                    remark:item.remark
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
                        size: pageSize ,
                        paramType: this.state.paramType,
                        isEnable: this.state.isEnable,
                        [`${self.state.optionVal}`]: self.state.inputVal
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        paramType: this.state.paramType,
                        isEnable: this.state.isEnable
                    });
                }
            }
        };
    }

    handleOk = (e) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this;
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
        self.setState({
            visibleShow: false,
        })
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
      paramType: '',
      isEnable: ''
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
        const {throughData} = this.props;
        const {showScreen} = this.state;
        const content = throughData ? this.formart(throughData) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                  <Col span={6}>
                      <FormItem
                          label={(<span style={{fontSize: 14}}>是否启用该请求参数</span>)}
                          labelCol={{span: 9}}
                          wrapperCol={{span: 13}}>
                          <Select
                              onChange={this.handleSelectChange.bind(this, 'isEnable')}
                              value={this.state.isEnable}
                              style={{ width: '144.5px'}}>
                              <Option value="">全部</Option>
                              <Option value="0">启用</Option>
                              <Option value="1">禁用</Option>
                          </Select>
                      </FormItem>
                  </Col>
                 <Col span={4}>
                    <FormItem
                        label={(<span style={{fontSize: 14}}>参数类型</span>)}
                        labelCol={{span: 7}}
                        wrapperCol={{span: 13}}>
                        <Select
                            onChange={this.handleSelectChange.bind(this, 'paramType')}
                            value={this.state.paramType}
                            style={{width: '100%'}}>
                            <Option value="">全部</Option>
                            <Option value="0">请求参数</Option>
                            <Option value="1">返回参数</Option>
                            <Option value="2">默认请求参数</Option>
                            <Option value="3">默认返回参数</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={2} offset={12}>
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
                            {getFieldDecorator('type', {initialValue: 'itfcId'})(
                                <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                <Option value="itfcId">接口id</Option>
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
        throughData: state.apiManagement.throughData,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.apiManagement
    }
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'apiManagement/h_list', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'apiManagement/h_save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'apiManagement/h_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
