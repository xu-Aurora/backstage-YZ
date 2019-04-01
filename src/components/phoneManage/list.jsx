import React, {Component} from 'react';
import { Input,Icon, Button, Form, Row, Col, Drawer, Table, Select, message, Modal } from 'antd';
import { connect } from 'dva'
import styles from './style1.less';
import qs from 'qs';
import Add from './phone/add.jsx';
import Detail from './phone/detail.jsx';
import Edit from './phone/edit.jsx';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

let pageSize1 = 10;

const columns = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 120
  },
  {
    title: '电话类型',
    dataIndex: 'phoneType',
    key: 'phoneType',
    width: 120,
    render: (text) => {
      let type = '未知类型';
      if(text == '1'){
        type = '手机'
      }
      if(text == '2'){
        type = '座机'
      }
      return type
    },
  },
  {
    title: '分类',
    dataIndex: 'type',
    key: 'type',
    width: 180,
    render: (text) => {
      let type = '未知分类';
      if(text == '1'){
        type = '小区电话'
      }
      if(text == '2'){
        type = '周边电话'
      }
      return type
    },
  },
  {
    title: '排序',
    dataIndex: 'seq',
    key: 'seq',
    width: 180
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 180,
    render: (text) => {
      let type = '未知状态';
      if(text == '1'){
        type = '启用'
      }
      if(text == '2'){
        type = '禁用'
      }
      return type
    },
  }
];

function siblingElems(elem){
  var _elem=elem;
  while((elem=elem.previousSibling)){
          if(elem.nodeType==1){
                elem.removeAttribute('style');
          }
  }
  var elem=_elem;
  while((elem=elem.nextSibling)){
          if(elem.nodeType==1){
                elem.removeAttribute('style');
          }
  }

};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
      rowSelection: [],
      showScreen: false,
      parentData: '',
      isSelect: false,
      pagination: { },
      pageSize: 10,
      saveSelect: false,
      id:'',
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      inputVal: '',
      optionVal: 'name',
      status: '',
      type: '',
      exportVisible: false        
    };
  }
  componentWillMount() {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getPhone({userId: userData.id, comId: self.props.communityRight ? self.props.communityRight.id : undefined, instCode: userData.instCode, page: '1', size: '10' });
  }
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveInfo(record.alldata);
    this.setState({
        detailVisible: true
    })
  }
  handleSearch () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
        if (values.type == 'name') {
          this.props.getPhone({
            userId: userData.id,
            name: this.state.inputVal,
            page: '1',
            size: pageSize1,
            status: this.state.status,
            type: this.state.type,
            comId: this.props.communityRight ? this.props.communityRight.id : undefined,
            instCode: userData.instCode
          });
        } else if(values.type == 'phone') {
          this.props.getPhone({
            userId: userData.id,
            phone: this.state.inputVal,
            page: '1',
            size: pageSize1,
            status: this.state.status,
            type: this.state.type,
            comId: this.props.communityRight ? this.props.communityRight.id : undefined,
            instCode: userData.instCode
          });
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
  handleSelectChange(item, value) {
    this.setState({
      [item]: value
    })
  }
  formart =(content) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'))
    const data = []
    if (content.list) {
      content.list.forEach((item, index) => {
        data.push({
          keys: index+1,
          id: item.id,
          name: item.name,
          phone:  item.phone,
          type: item.type,
          phoneType: item.phoneType,
          seq: item.seq,
          fee: item.fee,
          status: item.status,
          status: item.status,
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
            this.props.getPhone({
              userId: userData.id, 
              comId : self.props.communityRight ? self.props.communityRight.id : undefined, 
              instCode: userData.instCode, 
              page: current,
              size: pageSize,
              [`${self.state.optionVal}`]: self.state.inputVal,
              status: this.state.status,
              type: this.state.type
            });
        },
        onChange:(current, pageSize) => {
          this.props.getPhone({
            userId: userData.id, 
            comId : self.props.communityRight ? self.props.communityRight.id : undefined, 
            instCode: userData.instCode, 
            page: current,
            size: pageSize,
            [`${self.state.optionVal}`]: self.state.inputVal,
            status: this.state.status,
            type: this.state.type
           });
        }
      }
    };
  }
  goPage = (url, event) => {
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
    if (this.props.communityRight) {
       this.setState({
        [e]: true
      })
    } else {
      message.destroy();
      message.error('请选择左侧小区')
    }
  }
  //点击关闭页面
  handleCancel(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.getPhone({userId: userData.id, comId: self.props.communityRight ? self.props.communityRight.id : undefined, instCode: userData.instCode, page: '1', size: '10' });
  }

  //List组件与Detail组件传值
  DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:data})
      }, 500);
    })
  }

  // 导出
  exportShow (e) {
      this.setState({
          [e]: true
      })
  }
  exportOk () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    let url = `/backstage/community/phone/excelCommunityPhone?`
    let params = {
      userId: userData.id,
      comId: self.props.communityRight ? self.props.communityRight.id : '',
      instCode: userData.instCode,
      [self.state.optionVal]: self.state.inputVal,
      status: self.state.status,
      type: self.state.type
    }
    // 去除为空的参数
    for (let k in params) {
      if(!params[k]) {
        delete params[k]
      }
    }
    window.location.href = `${url}${qs.stringify(params)}`
    self.setState({
        exportVisible: false
    })
  }
  render() {
    const { phoneData } = this.props;
    const content = phoneData ? this.formart(phoneData) : [];
    const { getFieldDecorator } = this.props.form;
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={6} xxl={4}>
            <FormItem
              label="分类"
              labelCol={{span: 6}}
              wrapperCol={{span: 13}}>
                  <Select 
                    style={{ width: '100%'}}
                    value={this.state.type}
                    onChange={this.handleSelectChange.bind(this, "type")}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">小区电话</Option>
                    <Option value="2">周边电话</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col xl={6} xxl={4}>
            <FormItem
              label="状态"
              labelCol={{span: 6}}
              wrapperCol={{span: 13}}>
                  <Select 
                    style={{ width: '100%'}} 
                    value={this.state.status}
                    onChange={this.handleSelectChange.bind(this, 'status')}>
                    <Option value="">全部</Option>
                    <Option value="1">启用</Option>
                    <Option value="2">禁用</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col xl={5} xxl={11} style={{visibility:"hidden"}}>
            <FormItem
                label="状态"
                labelCol={{span: 6}}
                wrapperCol={{span: 13}}>
                    <Select 
                      style={{ width: '100%'}} 
                      value={this.state.status}
                      onChange={this.handleSelectChange.bind(this, 'status1')}>
                      <Option value="">全部</Option>
                      <Option value="1">启用</Option>
                      <Option value="2">禁用</Option>
                    </Select>
              </FormItem>
          </Col>
          <Col xl={7} xxl={4} style={{textAlign:'right'}}>
              <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
              <Button type="primary" style={{marginRight:10}} onClick={this.exportShow.bind(this, 'exportVisible')}>导出</Button>
              <a style={{color: '#1890ff',lineHeight:2.3,fontSize: '14px' }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
          </Col>
        </Row>
      )
    }
    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '20px 24px 10px 24px', backgroundColor: "#FFF"}}>
              <Row >
                  <Col xl={3} xxl={2} >
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight:15}}>新增电话</Button>
                  </Col>

                  <Col xl={14} xxl={17}>
                    <Col span={24}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {initialValue: 'name'})(
                          <Select style={{ width: 114}} onChange={this.selectChange.bind(this)}>
                            <Option value="name">名称</Option>
                            <Option value="phone">电话号码</Option>
                          </Select>
                        )}
                        <Input style={{ width: 240}}
                          maxLength={50}
                          value={this.state.inputVal} 
                          onChange={this.inputChange.bind(this)} 
                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                          placeholder="输入搜索内容" />
                      </InputGroup>
                    </Col>
                  </Col>

                  <Col xl={7} xxl={4} style={{display:showScreen?'none':'',textAlign:'right'}}>
                      <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                      <Button type="primary" style={{marginRight:10}} onClick={this.exportShow.bind(this, 'exportVisible')}>导出</Button>
                      <a style={{color: '#1890ff',lineHeight:2.3,fontSize: '14px' }} onClick={this.toggleForm}>
                        展开 <Icon type="down" />
                      </a>
                  </Col>
              </Row>
              { Element }
        </div>
        <div style={{width: '100%', padding: '10px 24px 24px 24px', backgroundColor: "#FFF"}}>
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
                  // scroll={{ y: true}}
                  size="middle"
                />
          </Row>
        </div>

        <Drawer
          title="新增"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} />
        </Drawer>
        <Modal
            title="导出"
            visible={this.state.exportVisible}
            onOk={this.exportOk.bind(this)}
            onCancel={this.handleCancel.bind(this, 'exportVisible')}
            >
            <p>是否导出全部数据？</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityRight: state.phoneManage.communityRight,
    gardenRight: state.phoneManage.gardenRight,
    phoneData: state.phoneManage.phoneData,
  }
}

function dispatchToProps(dispatch) {
  return {
    getPhone(payload = {}) {
      dispatch({
        type: 'phoneManage/getPhone',
        payload
      })
    },
    saveInfo(payload = {}) {
      dispatch({
        type: 'phoneManage/saveInfo',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
