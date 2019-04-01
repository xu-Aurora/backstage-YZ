import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import Detail from './details/detail.jsx';
import Edit from './edit/index.jsx';
import Add from './add/index.jsx';

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
        title: '编号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
    }, {
        title: '业务员编号',
        dataIndex: 'salesmanCode',
        key: 'salesmanCode',
    }, {
        title: '业务员名称',
        dataIndex: 'salesmanName',
        key: 'salesmanName'
    }, {
        title: '手机号码',
        dataIndex: 'salesmanPhone',
        key: 'salesmanPhone',
    }, {
        title: '业务员类型',
        dataIndex: 'salesmanType',
        key: 'salesmanType',
        render: (text) => {
            if(text == '1'){
                return '服务人员'
            }
            if(text == '2'){
                return '配送人员'
            }
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: function(text) {
            if(text == '1') {
                return '启用'
            } 
            if(text == '2') {
                return '禁用'
            }
        }
    }, {
        title: '所属机构',
        dataIndex: 'instName',
        key: 'instName',
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            detailVisible: false,
            editVisible: false,
            addVisible: false,
            salesmanType: '',
            status: '',
            optionVal:'salesmanCode',
            inputVal: '',
            modalShow: false
        };
    }
    componentWillMount() {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.props.queryList({
          page: 1, 
          size: 10, 
          userId: userData.id, 
          instCode: userData.instCode
      });
      this.props.getInstitutions({
        userId : userData.id, 
        code: userData.instCode
      });
    }

    handleSearch = () => {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if(values.type == 'salesmanCode') {
                this.props.queryList({
                    userId: userData.id, 
                    page: 1, 
                    size: pageSize1,
                    salesmanCode: this.state.inputVal,
                    status: this.state.status,
                    salesmanType: this.state.salesmanType,
                    instCode: this.state.instCode ? this.state.instCode : userData.instCode,
                });
            }
            if(values.type == 'salesmanName') {
                this.props.queryList({
                    userId: userData.id, 
                    page: 1, 
                    size: pageSize1,
                    salesmanName: this.state.inputVal,
                    status: this.state.status,
                    salesmanType: this.state.salesmanType,
                    instCode: this.state.instCode ? this.state.instCode : userData.instCode,
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

    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                let key = keys + 1;
                if (content.pageNum > 1) {
                    key = (content.pageNum - 1) * (content.pageSize <= 10 ? 10 : content.pageSize) + key;
                }
                data.push({
                    keys: key,
                    salesmanCode: item.salesmanCode,
                    salesmanName: item.salesmanName,
                    salesmanPhone: item.salesmanPhone,
                    salesmanType: item.salesmanType,
                    status: item.status,
                    instName: item.instName,
                    id: item.id,
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
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        instCode: this.state.instCode ? this.state.instCode : userData.instCode,
                        status: this.state.status,
                        salesmanType: this.state.salesmanType,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        instCode: this.state.instCode ? this.state.instCode : userData.instCode,
                        status: this.state.status,
                        salesmanType: this.state.salesmanType,
                        [`${self.state.optionVal}`]: self.state.inputVal,
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

    //展开与收起
    toggleForm = () => {
      this.setState({
        showScreen: !this.state.showScreen,
        salesmanType: '',
        status: '',
        instCode: '',
      });
    };

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
        this.props.queryList({
          page: 1, 
          size: 10, 
          userId: userData.id, 
          instCode: userData.instCode
        });
    }

    //index组件与Detail组件传值
    detailData(data){
      let self = this;
      self.setState({detailVisible:false},function(){
        setTimeout(() => {
          self.setState({editVisible:data})
        }, 500);
      })
    }

    //确定导出数据
    confirm () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let LINK;
        this.props.form.validateFields((err, values) => {
            LINK = `/backstage/supplier/exportSupplier?keyword=${this.state.inputVal}&type=${this.state.type}&state=${this.state.status}&userId=${userData.id}`;
        })
        window.location.href = LINK;
        this.setState({modalShow:false});
    }


    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row className="flex" style={{marginTop: '15px'}}>
                  <Col>
                    <Col>
                        <FormItem label={(<span style={{fontSize: 14}}>业务员类型</span>)}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'salesmanType')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">服务人员</Option>
                                <Option value="2">配送人员</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label={(<span style={{fontSize: 14}}>状态</span>)}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">启用</Option>
                                <Option value="2">禁用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label={(<span style={{fontSize: 14}}>所属机构</span>)}>
                            <Select
                                placeholder="请选择机构"
                                onChange={this.handleSelectChange.bind(this, 'instCode')}
                                style={{width: '100%'}}>
                                { 
                                  this.props.institutionsData ? this.props.institutionsData.map(item => (
                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                  )) : ( <Option value={' '}>暂无数据</Option> ) 
                                }
                            </Select>
                        </FormItem>
                    </Col>
                  </Col>

                  <Col style={{width:202}}>
                      <Col span={9}>
                          <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                      </Col>
                      <Col span={9}>
                          <Button type="primary" onClick={() => this.setState({modalShow:true})}>导出</Button>
                      </Col>
                      <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          收起 <Icon type="up" />
                      </a>
                  </Col>
                </Row>
            )
        }

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="业务员管理" key="1">
                            <Row className="flex">
                              <Col>
                                <Col style={{width:120}}>
                                    <Button type="primary" 
                                        onClick={ () => this.setState({addVisible: true}) }
                                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff' }}>新增业务员</Button>
                                </Col>
                                <Col>
                                    <InputGroup compact>
                                      {getFieldDecorator('type', {initialValue: 'salesmanCode'})(
                                          <Select style={{ width: 114 }} onChange={this.setSelectVal.bind(this)}>
                                              <Option value="salesmanCode">业务员编号</Option>
                                              <Option value="salesmanName">业务员名称</Option>
                                          </Select>
                                      )}
                                      <Input style={{ width: 240 }}
                                          maxLength={50}
                                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                          value={this.state.inputVal} 
                                          onChange={(e)=> this.setState({inputVal:e.target.value})}
                                          placeholder="输入搜索内容" />
                                    </InputGroup>
                                </Col>
                              </Col>

                              <Col style={{display:showScreen?'none':'',width:202}}>
                                  <Col span={9}>
                                      <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                                  </Col>  
                                  <Col span={9}>
                                      <Button type="primary" onClick={() => this.setState({modalShow:true})}>导出</Button>
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
                            columns={columns}
                            dataSource={content.data}
                            rowKey={record => record.id}
                            onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                            pagination={content.pagination}
                            bordered
                            size="middle"/>
                    </Row>
                </div>

                <Modal
                    title="导出数据"
                    visible={this.state.modalShow}
                    onOk={this.confirm.bind(this)}
                    onCancel={ () => this.setState({modalShow:false}) }
                    >
                    <p style={{fontSize:16}}>确定导出全部数据?</p>
                </Modal>

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
                    <Detail search={this.search.bind(this)} goEdit={this.detailData.bind(this)} />
                </Drawer>

                <Drawer
                    title="编辑业务员"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editVisible')}
                    destroyOnClose
                    maskClosable={false}
                    visible={this.state.editVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Edit search={this.search.bind(this)} closeEdit={ () => this.setState({editVisible: false}) } />
                </Drawer>

                <Drawer
                    title="新增业务员"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'addVisible')}
                    destroyOnClose
                    maskClosable={false}
                    visible={this.state.addVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Add search={this.search.bind(this)} closeAdd={ () => this.setState({addVisible: false}) } />
                </Drawer>

                <Modal
                    title="导出数据"
                    visible={this.state.modalShow}
                    onOk={this.confirm.bind(this,content)}
                    onCancel={ () => this.setState({modalShow:false}) }
                    >
                    <p style={{fontSize:16}}>确定导出全部数据?</p>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.salesmanManage.list,
        institutionsData: state.providerManage.institutionsData,
        loading: !!state.loading.models.salesmanManage,
    }
}

function dispatchToProps(dispatch) {
    return {
      queryList(payload = {}) {
          dispatch({type: 'salesmanManage/serch', payload})
      },
      saveSelect(payload = {}) {
          dispatch({type: 'salesmanManage/save', payload})
      },
      getInstitutions(payload, params) {  //所属机构
        dispatch({type: 'providerManage/getInstitutions',payload})
      },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
