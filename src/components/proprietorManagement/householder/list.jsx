import React, {Component} from 'react';
import { Input,Icon, Button, Form, Row, Col, Drawer, Table, Select, message, Modal } from 'antd';
import { connect } from 'dva'
import styles from '../style.less';
import qs from 'qs';
import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

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
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '出生年月',
    dataIndex: 'birthday',
    key: 'birthday',
    width: 120
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 120
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
    width: 180
  },
  {
    title: '身份关系',
    dataIndex: 'concern',
    key: 'concern',
    width: 120
  },
  {
    title: '认证状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == '1') {
        status = '未认证'
      }
      if(text == '2') {
        status = '已认证'
      }
      return status;
    },
    width: 120
  },
  {
    title: '所在小区',
    dataIndex: 'comName',
    key: 'comName',
    width: 120
  },
  {
    title: '户号',
    dataIndex: 'addressName',
    key: 'addressName',
    width: 150
  },
  {
    title: '数据状态',
    dataIndex: 'dataStatus',
    key: 'dataStatus',
    render: (text) => {
      let status = '未知状态';
      if(text == "0"){
        status = '启用'
      }
      if(text == "1"){
        status = '禁用'
      }
      return status;
    },
    width: 120
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
      dataStatus: '',
      exportVisible: false
    };
  }
  componentWillMount() {
    // skip 跳转过来为1,正常导航进入为undefined
    //skipData 跳转过来保存的roomId 
    let self = this    
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getUser({
      userId: userData.id, 
      type: 1, 
      instCode: userData.instCode, 
      page: '1', 
      size: '10',
      comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
      comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined, 
      roomId: this.props.skip ?  this.props.skipData : undefined
    });
  }
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.houseInfo(record.alldata);
    this.setState({
        detailVisible: true
    })
  }
  formart =(content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
     const data = [];
     let self = this
     if (content.list) {
      content.list.forEach((item, index) => {
        data.push({
          keys: index+1,
          id: item.id,
          name:  item.name,
          birthday: item.birthday,
          phone: item.phone,
          idCard: item.idCard,
          concern: this.props.roleType,
          status: item.status,
          addressName: item.addressName,
          dataStatus: item.dataStatus,
          comName: item.comCourtName ? `${item.comName}-${item.comCourtName}`:`${item.comName}`,
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
          this.props.getUser({
            userId: userData.id, 
            type: 1, 
            instCode: userData.instCode, 
            page: current,
            size: pageSize,
            roomId: this.props.skip ?  this.props.skipData : undefined,
            [`${self.state.optionVal}`]: self.state.inputVal,                       
            status: this.state.status,
            dataStatus: this.state.dataStatus,
            comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
            comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
          });         
        },
        onChange:(current, pageSize) => {
          this.props.getUser({
            userId: userData.id, 
            type: 1, 
            instCode: userData.instCode, 
            page: current,
            size: pageSize,
            roomId: this.props.skip ?  this.props.skipData : undefined,
            [`${self.state.optionVal}`]: self.state.inputVal,                       
            status: this.state.status,
            dataStatus: this.state.dataStatus,
            comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
            comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
          }); 
        }
      }
    };
  }
  resetDefault(){
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.props.queryList({
          page: 1,
          size: 10,
          userId: this.props.linkID ? this.props.linkID : userData.id
      });
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
     message.error('请选择左侧小区或者苑')
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
    this.props.getUser({
      userId: userData.id, 
      type: 1, 
      instCode: userData.instCode, 
      page: '1', 
      size: '10',
      comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
      comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
     });
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

  selectChange (ev) {
    this.setState({
        inputVal: '',
        optionVal: ev
    })
  }
  inputChange (ev) {
    this.setState({
      inputVal: ev.target.value
    })
  }
  handleSelectChange (type, value) {
    this.setState({
      [type]: value
    })
  }
  handleSearch () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    this.props.form.validateFields((err, values) => {
        if (values.type == 'name') {
            this.props.getUser({
                userId: userData.id,
                name: this.state.inputVal,
                instCode: userData.instCode,
                type: 1 ,
                page: '1',
                size: pageSize1,
                status: this.state.status,
                dataStatus: this.state.dataStatus,
                comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
                comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
            })
        } else if (values.type == 'phone') {
            this.props.getUser({
                userId: userData.id,
                phone: this.state.inputVal,
                instCode: userData.instCode, 
                type: 1 ,
                page: '1',
                size: pageSize1,
                status: this.state.status,
                dataStatus: this.state.dataStatus,
                comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
                comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
            })
        }else if (values.type == 'idCard') {
          this.props.getUser({
              userId: userData.id,
              idCard: this.state.inputVal,
              instCode: userData.instCode, 
              type: 1 ,
              page: '1',
              size: pageSize1,
              status: this.state.status,
              dataStatus: this.state.dataStatus,
              comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
              comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined
          })
      }
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
    let url = `/backstage/room/owner/excelRoomOwner?`
    let params = {
      userId: userData.id,
      comId: self.props.communityRight ? self.props.communityRight.id : '', 
      comCourtId: self.props.gardenRight ? self.props.gardenRight.id : '',
      instCode: userData.instCode,
      [self.state.optionVal]: self.state.inputVal,
      status: self.state.status,
      dataStatus: self.state.dataStatus,
      type: 1
    }
    // 删除为空的参数
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
    const { userData } = this.props;
    const content = userData ? this.formart(userData) : [];
    const { getFieldDecorator } = this.props.form;
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col span={5}>
            <FormItem
              label={(<span style={{fontSize: 14}}>认证状态</span>)}
              labelCol={{span: 7}}
              wrapperCol={{span: 15}}>
                <Select 
                  style={{ width: '100%'}} 
                  onChange={this.handleSelectChange.bind(this, 'status')}
                  value={this.state.status}
                >
                  <Option value="">全部</Option>
                  <Option value="1">未认证</Option>
                  <Option value="2">已认证</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label={(<span style={{fontSize: 14}}>数据状态</span>)}
              labelCol={{span: 7}}
              wrapperCol={{span: 15}}>
                  <Select 
                    style={{ width: '100%'}} 
                    onChange={this.handleSelectChange.bind(this, 'dataStatus')}
                    value={this.state.dataStatus}
                  >
                    <Option value="">全部</Option>
                    <Option value="0">启用</Option>
                    <Option value="1">停用</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col span={10}></Col>
          <Col span={4}>
              <Col span={9}>
                  <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
              </Col>  
              <Col span={9}>
                  <Button type="primary" onClick={this.exportShow.bind(this, 'exportVisible')}>导出</Button>
              </Col>       
              <Col>
                <a style={{color: '#1890ff',lineHeight:2.3,fontSize: '14px' }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </Col>
          </Col>
        </Row>
      )
    }
    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '10px 24px 10px 24px', backgroundColor: "#FFF"}}>
              <Row>
                  <Col span={2} >
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight:15}}>新增户主</Button>
                    {/* <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>批量导入</Button> */}
                  </Col>

                  <Col span={15} key="agment">
                    <Col span={16}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {
                          initialValue: 'name'
                        })(
                          <Select style={{ width: '26%' }} onChange={this.selectChange.bind(this)}>
                            <Option value="name">姓名</Option>
                            <Option value="phone">电话</Option>
                            <Option value="idCard">身份证</Option>
                          </Select>
                        )}
                        <Input style={{ width: '50%' }}
                          maxLength={50}
                          value={this.state.inputVal} 
                          onChange={this.inputChange.bind(this)}  
                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                          placeholder="输入搜索内容" />
                      </InputGroup>
                    </Col>
                  </Col>

                  <Col span={4} style={{display:showScreen?'none':''}}>
                      <Col span={9}>
                          <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                      </Col>         
                      <Col span={9}>
                          <Button type="primary" onClick={this.exportShow.bind(this, 'exportVisible')}>导出</Button>
                      </Col>
                      <Col>
                        <a style={{color: '#1890ff',lineHeight:2.3 ,fontSize: '14px'}} onClick={this.toggleForm}>
                          展开 <Icon type="down" />
                        </a>
                      </Col>
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
          destroyOnClose
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
          destroyOnClose
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
          destroyOnClose
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
    communityRight: state.proprietorManagement.communityRight,
    gardenRight: state.proprietorManagement.gardenRight,
    userData: state.proprietorManagement.userData,
    roleType: state.proprietorManagement.roleType,
    skipData: state.proprietorManagement.skipData
  }
}

function dispatchToProps(dispatch) {
  return {
    getUser(payload = {}) {
      dispatch({
        type: 'proprietorManagement/getUser',
        payload
      })
    },
    houseInfo(payload = {}) {
      dispatch({
        type: 'proprietorManagement/houseInfo',
        payload
      })
    },
    skipInfo(payload,params) {
      dispatch({type: 'proprietorManagement/skipInfo', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
