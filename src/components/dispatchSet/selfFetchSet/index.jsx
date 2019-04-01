import React, {Component} from 'react';
import {Input,Button,Form,Icon,Row,Col,Table,Select,Drawer} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import Detail from './detail.jsx';
import Edit from './edit.jsx';
import Add from './add.jsx';

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
    title: '自提点编号',
    dataIndex: 'code',
    key: 'code'
  },{
    title: '自提点名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '自提点地址',
    dataIndex: 'address',
    key: 'address'
  },  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal'
  },{
    title: '负责人电话',
    dataIndex: 'principalPhone',
    key: 'principalPhone'
  }, {
    title: '自提点电话',
    dataIndex: 'phone',
    key: 'phone'
  },{
    title: '服务时间',
    dataIndex: 'serverTime',
    key: 'serverTime'
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '1'){
        status = '启用'
      }
      if(text == '2'){
        status = '禁用'
      }
      return status;
    }
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScreen: false,
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      inputVal: '',
      optionVal: 'code',
      status: ''
    };
  }


  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({detailVisible: true,});
  }
  handleSearch = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      this.props.queryList({
        instCode: userData.instCode,
        userId: userData.id, 
        [`${this.state.optionVal}`]: this.state.inputVal,
        status: this.state.status,
        pageSize1,
        page: '1',
      });
    })

  }
  formart = (content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
        }
        data.push({
          keys: key,
          id: item.id,
          code: item.code,
          name: item.name,
          address: `${item.provinceName}${item.cityName}${item.countyName}${item.address}`,
          principal: item.principal,
          principalPhone: item.principalPhone,
          phone: item.phone,
          status: item.status,
          serverTime: item.serverTime,
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
            instCode: userData.instCode,
            name: this.state.name,
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id,
            page: current,
            size: pageSize,
            instCode: userData.instCode,
            name: this.state.name,
          });
        }
      }
    };
  }

  resetDefault(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId: userData.id,
      page: 1,
      size: 10,
      instCode: userData.instCode,
    });
  }

  onShowScreen = () => {
    this.setState({
      showScreen: !this.state.showScreen,
    })
  }

  handleSelectChange(type, value) {
    this.setState({[type]: value});
  }
  selectChange (ev) {
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }

  //时间
  timeRange = (type, date) => {
    let time
    if(date){
        time = date._d.getTime();
    }

    if (type === 'x1') {
        this.setState({startTime: time})
    }
    if (type === 'x2') {
        this.setState({endTime: time})
    }
  }

  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      status: ''
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

  goEdit(){
    this.setState({
      detailVisible: false
    },() => {
      setTimeout(() => {
        this.setState({editVisible: true})
      }, 500);
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
    const {showScreen} = this.state;
    const {getFieldDecorator} = this.props.form;
    const content = data ? this.formart(data) : [];
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={5} xxl={4}>
            <FormItem
              label="状态"
              labelCol={{span: 4}}
              wrapperCol={{span: 13}}>
              <Select
                value={this.state.status}
                onChange={this.handleSelectChange.bind(this,'status')} 
                style={{ width: '100%'}} >
                <Option value="">全部</Option>
                <Option value="1">启用 </Option>
                <Option value="2">禁用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col xxl={3} offset={16} style={{textAlign:'center'}}>
              <Button type="primary" style={{marginRight: 10}} onClick={this.handleSearch.bind(this)}>确定</Button>
              <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
          </Col>
        </Row>
      )
    }
    return (
      <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
        <div className={styles.search}>
          <Row>
              <Col xl={3} xxl={2}>
                <Button type="primary" 
                  onClick={ () => this.setState({addVisible: true})} 
                  style={{marginRight: 20,backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增自提点</Button>
              </Col>
              <Col xl={18} xxl={19}>
                <Col span={16}>
                    <InputGroup compact>
                      {getFieldDecorator('type', {initialValue: 'code'})(
                        <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                          <Option value="code">自提点编号</Option>
                          <Option value="name">自提点名称</Option>
                          <Option value="specificAddress">自提点地址</Option>
                        </Select>
                      )}
                      <Input style={{ width: 240}} 
                        maxLength={50}
                        value={this.state.inputVal}
                        onChange={(e) => this.setState({inputVal:e.target.value})}
                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                        placeholder="输入搜索内容" />
                    </InputGroup>
                </Col>
              </Col>

              <Col span={3} style={{display:showScreen?'none':'',textAlign:'center'}}>
                  <Button type="primary" style={{marginRight: 10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                  <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </a>
              </Col>
          </Row>
          {Element}
        </div>
        <div style={{height: 6}}></div>
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
          title="自提点详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.goEdit.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑自提点"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} closeEdit={ () => this.setState({editVisible: false}) } />
        </Drawer>

        <Drawer
          title="新增自提点"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)} closeAdd={ () => this.setState({addVisible: false}) } />
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.selfFetchSet.list,
    loading:state.loading.models.selfFetchSet
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'selfFetchSet/serch', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'selfFetchSet/save', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
