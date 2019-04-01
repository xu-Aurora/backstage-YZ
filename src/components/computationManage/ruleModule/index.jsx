import React from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,Table,Drawer} from 'antd';
import {connect} from 'dva';
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
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName'
    }, {
        title: '模板标识',
        dataIndex: 'templateKey',
        key: 'templateKey'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            let status = '未知状态';
            if (text == '1' ) {
                status = '启用'
            }
            if (text == '2') {
                status = '禁用'
            }
            return status;
        }
    }, {
        title: '来源',
        dataIndex: 'resourceType',
        key: 'resourceType',
        render: (text) => {
            let status = '未知来源';
            if (text == '1' ) {
                status = '业务'
            }
            if (text == '2') {
                status = '渠道'
            }
            if (text == '3') {
                status = '资源'
            }
            return status;
        }
    }, {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe'
    }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            pageSize: 10,
            defaultTimex1: null,
            defaultTimex2: null,
            startTime: '',
            endTime: '',
            isSelect: false,
            visibleShow: false,
            id: '' ,
            templateKey: '',
            templateName: '',
            status: '',
            resourceType: '',
            showScreen:false,
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'templateKey'
        };
    }

    onSelect(record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({detailVisible: true});
    }

    handleSelectChange = (type, value) => {
        if (type === 'resourceType') {
            this.setState({resourceType: value})
        }
        if (type === 'status') {
            this.setState({status: value})
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
    handleSearch() {
        const userData = JSON.parse(localStorage.getItem('userDetail'))
        this.props.form.validateFields((err, values) => {
            if (values.type === 'templateKey'){
                this.props.queryList({
                    userId: userData.id, 
                    templateKey: this.state.inputVal, 
                    page: '1', 
                    size: pageSize1, 
                    status: this.state.status,
                    resourceType: this.state.resourceType
                });
                
            } else if(values.type === 'templateName') {
                this.props.queryList({
                    userId: userData.id, 
                    templateName: this.state.inputVal, 
                    page: '1', 
                    size: pageSize1,
                    status: this.state.status,
                    resourceType: this.state.resourceType
                });
                
            }
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
                    templateName: item.templateName,
                    templateKey: item.templateKey,
                    status: item.status,
                    resourceType: item.resourceType,
                    describe: item.describe,
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
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        status: this.state.status,
                        resourceType: this.state.resourceType
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: this.props.linkID || userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        status: this.state.status,
                        resourceType: this.state.resourceType
                    });
                }
            }
        };
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
        resourceType: '',
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
        const {showScreen} = this.state;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
          selectElemnt = (
              <Row style={{marginTop: '15px'}}>
                <Col span={5}>
                    <FormItem
                        label={(<span style={{fontSize: 14}}>状态</span>)}
                        labelCol={{span: 3}}
                        wrapperCol={{span: 12}}>
                        <Select
                            onChange={this.handleSelectChange.bind(this, 'status')}
                            value={this.state.status}
                            style={{ width: '100%'}}>
                            <Option value="">全部</Option>
                            <Option value="1">启用</Option>
                            <Option value="2">禁用</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem
                      label={(<span style={{fontSize: 14}}>来源</span>)}
                      labelCol={{span: 3}}
                      wrapperCol={{span: 12}}>
                      <Select
                          onChange={this.handleSelectChange.bind(this, 'resourceType')}
                          value={this.state.resourceType}
                          style={{ width: '100%'}}>
                          <Option value="">全部</Option>
                          <Option value="1">业务</Option>
                          <Option value="2">渠道</Option>
                          <Option value="3">资源</Option>
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
                  <Row >
                    <Col span={1} style={{marginRight:'2%'}}>
                      <Button type="primary" 
                        onClick={this.sendShow.bind(this, 'addVisible')}
                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增</Button>
                    </Col>
                    <Col span={20} style={{marginRight:'1%'}} key="agment">
                        <Col span={6}>
                          <InputGroup compact>
                            {getFieldDecorator('type', {initialValue: 'templateKey'})(
                              <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                <Option value="templateKey">模板标识</Option>
                                <Option value="templateName">模板名称</Option>
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
                  </div>
                  <div style={{height: 14,backgroundColor: '#ccc'}}></div>

                  <div style={{width: '100%',backgroundColor: "#FFF",padding: 24}}>
                    <Row>
                        <Table
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
                    title="新增/编辑"
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
    return {pendingData: state.computationManagement.throughData, linkID: state.login.userMsg.id}
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'computationManagement/h_list', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'computationManagement/h_save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'computationManagement/h_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
