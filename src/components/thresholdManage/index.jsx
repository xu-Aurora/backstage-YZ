import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import {Input,Select,Button,Drawer,Icon,Row,Col,Form,Tabs,Table} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;

let pageSize1 = 10;

//点击高亮排他法,
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

//表格列的配置描述
const columns = [
    {
        title: '编号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
    },{
        title: '阀值',
        dataIndex: 'value',
        key: 'value'
    }, {
        title: '阀值名称',
        dataIndex: 'thresholdName',
        key: 'thresholdName'
    }, {
        title: '阀值标识',
        dataIndex: 'thresholdKey',
        key: 'thresholdKey',
    }, {
        title: '阀值类型',
        dataIndex: 'thresholdType',
        key: 'thresholdType',
        // 参数一:当前行key的值，参数二:当前行数据，参数三:行索引
        render:(text,redord,index) => {
            let thresholdType = '未知类型';
            if(text == '0') {
                thresholdType = '日清'
            }
            if(text == '1') {
                thresholdType = '月清'
            }
            return thresholdType;
        }
    }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    }, {
        title: '更新人',
        dataIndex: 'updateUserName',
        key: 'updateUserName'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName'
    }, {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo'
    }

];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            pageSize: 10,
            thresholdType: '',
            name: '',
            userData: {},
            visibleShow: false,
            selectedRows: '',
            type: '',
            id: '' ,
            setSelectVal: '',
            thresholdKey:'',
            inputVal: '',
            optionVal: 'thresholdKey'
        };
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            page: 1,
            size: 10,
            // userId: this.props.linkID ? this.props.linkID : userData.id
            userId: userData.id
        });
        this.setState({userData})

    }
    //点击搜索匹配数据
    handleSearch = (val) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id, 
            thresholdKey: this.state.inputVal, 
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
    //点击选中数据,参数一是点击选中的那个数据,参数二是数据索引值,
    onSelect(record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);  //点击选中的那个数据,存到redux中
        this.setState({detailVisible: true});
    }

    //列表及分页获取数据
    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        let self = this
        if (content.list) {
            content.list.forEach((item,keys) => {
                data.push({ //列表数据
                    keys: keys+1,
                    value: item.value,
                    thresholdName: item.thresholdName,
                    thresholdType: item.thresholdType,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    updateUserName: item.updateUserName,
                    thresholdKey: item.thresholdKey,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserName: item.createUserName,
                    id:item.id,
                    memo:item.memo,
                    alldata: item
                })
            });
        }
        return {
            data,
            pagination: {   //分页
                total: content.total,   //数据总条数
                current: content.pageNum,   //当前页数
                // pageSize: content.size > this.state.pageSize ? content.size : this.state.pageSize,  //每页条数
                showSizeChanger: true,  //是否可以改变 pageSize
                showQuickJumper: true,  //实现快速跳转某页
                onShowSizeChange: (current, pageSize) => {  //改变pageSize 变化的回调
                    pageSize1 = pageSize;
                    this.props.queryList({
                        userId: this.props.linkID ? this.props.linkID : userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal
                    });
                },
                onChange: (current, pageSize) => {  //页码改变的回调，参数是改变后的页码及每页条数
                    this.props.queryList({
                        userId: this.props.linkID ? this.props.linkID : userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal
                    });
                }
            }
        };
    }


    //处理搜索框非受控组件
    setSelectVal = (val) => {
        this.setState({setSelectVal: val});
    }
    //点击跳转到新增数据
    goAdd() {
       this.context.router.history.push(`/${this.props.match.params.id}/app/thresholdManagement/add`)
    }
    //点击阀值管理,重新获取数据
    resetDefault(){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            page: 1,
            size: 10,
            userId: this.props.linkID ? this.props.linkID : userData.id
        });
    }

    //处理数据选批量选中函数
    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
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
        const {data} = this.props;    //从redux里获取数据
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : []; //数据

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
                        <TabPane tab="阀值管理" key="1">
                            <Row >
                                <Form className="ant-advanced-search-form" layout="horizontal">
                                    <Col span={1} style={{marginRight:'3%'}}>
                                      <Button type="primary" 
                                        onClick={this.sendShow.bind(this, 'addVisible')} 
                                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增模板</Button>                                    
                                    </Col>
                                    <Col span={5} style={{marginRight:'1%'}} key="agment">
                                        <Col span={24}>
                                          <InputGroup compact>
                                            {getFieldDecorator('thresholdKey', {initialValue: 'thresholdKey'})(
                                              <Select style={{ width: '30%' }} onChange={this.selectChange.bind(this)}>
                                                <Option value="thresholdKey">阀值标识</Option>
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
                                </Form>
                            </Row>
                        </TabPane>
                    </Tabs>
                </div>
                <div  style={{width: '100%',padding: 24,backgroundColor: "#FFF",marginTop: 20}}>
                    <Row>
                        <Table
                        loading={this.props.loading}    //设置正在加载样式
                        columns={columns}   //表格列的配置描述
                        dataSource={content.data}   //数据
                        rowKey={record => record.id}      //表格行key的取值,这里是给每行添加一个id标识
                        onRow={(record) => ({
                            onClick: this.onSelect.bind(this, record)
                        })
                        }
                        pagination={content.pagination}     //分页
                        bordered
                        bordered size="middle" />
                    </Row>
                </div>
                <Drawer
                    title="新增阀值"
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
                    visible={this.state.detailVisible}
                    destroyOnClose
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
                    visible={this.state.editVisible}
                    destroyOnClose
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Edit search={this.search.bind(this)} />
                </Drawer>
            </div>
        )
    }
}

//通过context把router注入到组件里,为了实现路由的跳转
App.contextTypes = {
    router: PropTypes.object
}
function mapStateToProps(state, ownProps ) {
    return {
        data: state.thresholdManagement.data,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.thresholdManagement
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'thresholdManagement/queryList', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'thresholdManagement/save', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'thresholdManagement/remove', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
