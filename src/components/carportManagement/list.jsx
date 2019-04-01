import React, {Component} from 'react';
import { Input,Icon, Button, Form, Row, Col, Drawer, Table, Select, message, Modal,Upload } from 'antd';
import { connect } from 'dva'
import styles from './style.less';
import qs from 'qs';
import Add from './parking/add.jsx';
import Detail from './parking/detail.jsx';
import Edit from './parking/edit.jsx';

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
    title: '车位编号',
    dataIndex: 'code',
    key: 'code',
    width: 180
  },
  {
    title: '车位类型',
    dataIndex: 'type',
    key: 'type',
    render: (text) => {
      let type = '未知类型';
      if(text == '1'){
        type = '正常'
      }
      if(text == '2'){
        type = '人防'
      }
      if(text == '3'){
        type = '子母'
      }
      return type;
    },
    width: 120
  },
  {
    title: '车位面积',
    dataIndex: 'acreage',
    key: 'acreage',
    width: 120
  },
  {
    title: '所有者',
    dataIndex: 'ownerName',
    key: 'ownerName',
    width: 120
  },
  {
    title: '所有者电话',
    dataIndex: 'ownerPhone',
    key: 'ownerPhone',
    width: 120
  },
  {
    title: '所属小区',
    dataIndex: 'unit',
    key: 'unit',
    width: 180
  },
  {
    title: '户号',
    dataIndex: 'addressName',
    key: 'addressName',
    width: 180
  },
  {
    title: '关联车牌',
    dataIndex: 'carNames',
    key: 'carNames',
    width: 180
  },
  {
    title: '管理费',
    dataIndex: 'fee',
    key: 'fee',
    width: 120
  },
  {
    title: '车位状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == "1"){
        status = '正常'
      }
      if(text == "2"){
        status = '租用'
      }
      if(text == "3"){
        status = '闲置'
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
      optionVal: 'code',
      status: '',
      type: '',
      exportVisible: false        
    };
  }
  componentWillMount() {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getParking({
      userId: userData.id, 
      comId: self.props.communityRight ? self.props.communityRight.id : undefined, 
      comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined, 
      instCode: userData.instCode, 
      page: '1', 
      size: '10' 
    });
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
        if (values.type == 'code') {
          this.props.getParking({
            userId: userData.id,
            code: this.state.inputVal,
            page: '1',
            size: pageSize1,
            status: this.state.status,
            type: this.state.type,
            comId: this.props.communityRight ? this.props.communityRight.id : undefined,
            comCourtId: this.props.gardenRight ? this.props.gardenRight.id : undefined,
            instCode: userData.instCode
          });
        } else if(values.type == 'addressName') {
          this.props.getParking({
            userId: userData.id,
            addressName: this.state.inputVal,
            page: '1',
            size: pageSize1,
            status: this.state.status,
            type: this.state.type,
            comId: this.props.communityRight ? this.props.communityRight.id : undefined,
            comCourtId: this.props.gardenRight ? this.props.gardenRight.id : undefined,
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
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'))
    const data = []
    if (content.list) {
      content.list.forEach((item, index) => {
        data.push({
          keys: index+1,
          id: item.id,
          code:  item.code,
          type: item.type,
          acreage: item.acreage,
          addressName: item.addressName,
          fee: item.fee,
          status: item.status,
          carNames: item.carNames,
          unit: item.comCourtName ? `${item.comName}-${item.comCourtName}`:`${item.comName}`,
          ownerName: item.ownerName,
          ownerPhone: item.ownerPhone,
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
            this.props.getParking({
              userId: userData.id, 
              comId : self.props.communityRight ? self.props.communityRight.id : undefined, 
              comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined, 
              instCode: userData.instCode, 
              page: current,
              size: pageSize,
              [`${self.state.optionVal}`]: self.state.inputVal,
              status: this.state.status,
              type: this.state.type
            });
        },
        onChange:(current, pageSize) => {
          this.props.getParking({
            userId: userData.id, 
            comId : self.props.communityRight ? self.props.communityRight.id : undefined, 
            comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined, 
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
    this.props.getParking({userId: userData.id, comId: self.props.communityRight ? self.props.communityRight.id : undefined, comCourtId: self.props.gardenRight ? self.props.gardenRight.id : undefined, instCode: userData.instCode, page: '1', size: '10' });
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
    let url = `/backstage/room/parking/excelRoomParking?`
    let params = {
      userId: userData.id,
      comId: self.props.communityRight ? self.props.communityRight.id : '',
      comCourtId: self.props.gardenRight ? self.props.gardenRight.id : '',
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
  beforeUpload(file) {
    if(!this.props.communityRight) {
      message.error('请选择左侧小区或苑')
      return false
    }
    let name = file.name
    let format = name.split('.')[1]
    if(format != 'xlsx') {
      message.error('文件格式不正确')
      return false
    }
    return true
  }
  handleImg(info) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if (info.file.status === 'done') {
      if(info.file.response.code == '200') {
        message.success('导入成功')
        this.props.getParking({userId: userData.id, comId: this.props.communityRight ? this.props.communityRight.id : undefined, comCourtId: this.props.gardenRight ? this.props.gardenRight.id : undefined, instCode: userData.instCode, page: '1', size: '10' });
      } else {
        message.error(info.file.response.message)
      }
    } else if (info.file.status === 'error') {
      message.error(`导入失败`);
    }
  }
  render() {
    const { parkingData } = this.props;
    const content = parkingData ? this.formart(parkingData) : [];
    const { getFieldDecorator } = this.props.form;
    const {showScreen} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col span={5}>
            <FormItem
              label={(<span style={{fontSize: 14}}>车位状态</span>)}
              labelCol={{span: 7}}
              wrapperCol={{span: 15}}>
                  <Select 
                    style={{ width: '100%'}}
                    value={this.state.status}
                    onChange={this.handleSelectChange.bind(this, "status")}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">租用</Option>
                    <Option value="3">闲置</Option>
                  </Select>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label={(<span style={{fontSize: 14}}>车位类型</span>)}
              labelCol={{span: 7}}
              wrapperCol={{span: 15}}>
                  <Select 
                    style={{ width: '100%'}} 
                    value={this.state.type}
                    onChange={this.handleSelectChange.bind(this, 'type')}>
                    <Option value="">全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">人防</Option>
                    <Option value="3">子母</Option>
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
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let params = {
      name: 'file',
      action: '/backstage/room/parking/excelImportParking',
      data: {
        userId: userData.id,
        comId : this.props.communityRight.id, 
        comCourtId :  this.props.gardenRight ? this.props.gardenRight.id:''
      }
    }
    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '20px 24px 10px 24px', backgroundColor: "#FFF"}}>
              <Row >
                  <Col span={5} >
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2',marginRight:15}}>新增车位</Button>
                    <Upload 
                        beforeUpload={this.beforeUpload.bind(this)}
                        onChange={this.handleImg.bind(this)}
                        {...params}
                    >
                       <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2'}} >批量导入</Button>
                    </Upload>
                  </Col>

                  <Col span={15} key="agment">
                    <Col span={16}>
                      <InputGroup compact>
                        {getFieldDecorator('type', {
                          initialValue: 'code'
                        })(
                          <Select style={{ width: '26%' }} onChange={this.selectChange.bind(this)}>
                            <Option value="code">车位编号</Option>
                            <Option value="addressName">户号</Option>
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
                        <a style={{color: '#1890ff',lineHeight:2.3,fontSize: '14px' }} onClick={this.toggleForm}>
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
          title="新增车位"
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
    communityRight: state.carportManagement.communityRight,
    gardenRight: state.carportManagement.gardenRight,
    parkingData: state.carportManagement.parkingData,

    data: state.roloManage.data,
    loading: !!state.loading.models.roloManage,
    linkID: state.login.userMsg.id
  }
}

function dispatchToProps(dispatch) {
  return {
    getParking(payload = {}) {
      dispatch({
        type: 'carportManagement/getParking',
        payload
      })
    },
    saveInfo(payload = {}) {
      dispatch({
        type: 'carportManagement/saveInfo',
        payload
      })
    },
    exportParking(payload = {}) {
      dispatch({
        type: 'carportManagement/exportParking',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
