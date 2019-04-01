import React from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,Table,Drawer} from 'antd';
import {connect} from 'dva';
import styles from '../index.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

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

let pageSize1 = 10;

const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '模板标识',
        dataIndex: 'templateKey',
        key: 'templateKey'
    }, {
        title: '定额',
        dataIndex: 'quota',
        key: 'quota'
    }, {
        title: '百分比',
        dataIndex: 'percent',
        key: 'percent'
    }, {
        title: '上限',
        dataIndex: 'intervalUpper',
        key: 'intervalUpper'
    }, {
        title: '上限类型',
        dataIndex: 'upperType',
        key: 'upperType',
        render: (text) => {
            let status = '未知类型';
            if (text == '1' ) {
                status = '包含'
            }
            if (text == '2') {
                status = '不包含'
            }
            return status;
        }
    }, {
        title: '下限',
        dataIndex: 'intervalFloor',
        key: 'intervalFloor'
    }, {
        title: '下限类型',
        dataIndex: 'floorType',
        key: 'floorType',
        render: (text) => {
            let status = '未知类型';
            if (text == '1' ) {
                status = '包含'
            }
            if (text == '2') {
                status = '不包含'
            }
            return status;
        }
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
            searchType: 'orderNo',
            startTime: '',
            endTime: '',
            status: '',
            isShow: '',
            isSelect: false,
            visibleShow: false,
            id: '',
            templateKey: '',
            addVisible: false,
            detailVisible: false,
            editVisible: false,
            inputVal: '',
            optionVal: 'templateKey'
        };
    }
    onSelect(record, e){
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({detailVisible: true});
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
        this.props.queryList({
            userId: userData.id, 
            templateKey: this.state.inputVal, 
            page: '1', 
            size: pageSize1
        });
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
                    templateKey: item.templateKey,
                    quota: item.quota,
                    percent: item.percent,
                    intervalUpper: item.intervalUpper,
                    upperType: item.upperType,
                    intervalFloor: item.intervalFloor,
                    floorType: item.floorType,
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

    handleSelectChange = (type, value) => {
        this.setState({[type]: value})
    }
    goPage = (event) => {
        event.preventDefault();
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
                  <Row >
                    <Col span={1} style={{marginRight:'1%'}}>
                      <Button type="primary" 
                        onClick={this.sendShow.bind(this, 'addVisible')} 
                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增</Button>
                    </Col>

                    <Col span={5} style={{marginRight:'1%'}} key="agment">
                        <Col span={24}>
                          <InputGroup compact>
                            {getFieldDecorator('type', {initialValue: 'templateKey'})(
                              <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                <Option value="templateKey">模块标识</Option>
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
                  </Row>
                  </div>
                  <div style={{height: 14,backgroundColor: '#ccc'}}></div>

                  <div style={{width: '100%',backgroundColor: "#FFF",padding: 24}}>
                      <Row>
                          <Table
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
                    visible={this.state.addVisible}
                    destroyOnClose
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
    return {
        pendingData: state.computationManagement.pendingData, 
        linkID: state.login.userMsg.id}
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'computationManagement/p_list', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'computationManagement/p_save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'computationManagement/p_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
