import React, {Component} from 'react';
import { Tabs, Input,Icon,DatePicker, Button, Form, Row, Col, Drawer, Table, Select, Modal,message } from 'antd';
import Moment from 'moment';
import { connect } from 'dva'
import styles from '../../common.less';
import PropTypes from 'prop-types';

import Add from './add.jsx';
import Detail from './detail.jsx';
import Edit from './edit.jsx';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;




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

let pageSize1 = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      showScreen: false,
      pageSize: 10,
      visibleShow: false,
      addVisible: false,
      detailVisible: false,
      previewVisible1: false,
      inputVal: '',
      status:'',
      type:'',
      startTime: '',
      endTime: '',
      effectiveTime: '',
      overTime: '',
      optionVal:'name',
      imgUrl:''
    };
  }
  handleSearch = (val) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryadQuery({
      userId: userData.id,
      page: 1,
      size: pageSize1,
      spaceCode: this.props.code,
      [`${this.state.optionVal}`]: this.state.inputVal,
      status: this.state.status,
      type: this.state.type,
      StartTime: this.state.startTime ? Moment(this.state.startTime).format("YYYY-MM-DD"):'',
      EndTime: this.state.endTime ? Moment(this.state.endTime).format("YYYY-MM-DD"):'',
      effectiveStartTime: this.state.effectiveTime ? Moment(this.state.effectiveTime).format("YYYY-MM-DD"):'',
      overStartTime: this.state.overTime ? Moment(this.state.overTime).format("YYYY-MM-DD"):''
    })

  }
  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    // $(e.target).parent().prevAll().children().css('backgroundColor','#FFFFFF');
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record);
    this.setState({
      detailVisible: true
    });
  }

  //获取查看图片的osskey
  // osskeyVal = (item) => {
  //   return id;
  // }

  //查看图片
  showImg = (imgUrl,e) => {
    e.stopPropagation();//阻止时间冒泡
    this.setState({
      imgUrl: `/backstage/upload/download?uuid=${imgUrl}&viewFlag=1&fileType=jpg&filename=aa`,
      previewVisible1: true
    })
  }

  formart =(content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
     let self = this;
     const data = [];
     if (content.list) {
      content.list.forEach((item, keys) => {
        data.push({
          keys: keys+1,
          id: item.id,
          name: item.name,
          status: item.status,
          seq: item.seq,
          effectiveTime: `${Moment(item.effectiveTime).format("YYYY-MM-DD HH:mm:ss")}~${Moment(item.overTime).format("YYYY-MM-DD HH:mm:ss")}`,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          type: item.type,
          content: item.content,
          osskey: <div style={{cursor:'pointer'}} onClick={this.showImg.bind(this,item.osskey)}>查看图片</div>,
          createUserName: item.createUserName,
          adSpaceType: item.adSpaceType
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
          this.props.queryadQuery({
            userId: userData.id, 
            page: current, 
            size: pageSize,
            spaceCode: this.props.code,
            [`${this.state.optionVal}`]: this.state.inputVal,
            status: this.state.status,
            type: this.state.type,
            StartTime: this.state.startTime,
            EndTime: this.state.endTime,
            effectiveTime: this.state.effectiveTime ? Moment(this.state.effectiveTime).format("YYYY-MM-DD"):'',
            overTime: this.state.overTime ? Moment(this.state.overTime).format("YYYY-MM-DD"):''
          });
        },
        onChange:(current, pageSize) => {
          this.props.queryadQuery({
            userId: userData.id, 
            page: current, 
            size: pageSize,
            spaceCode: this.props.code,
            [`${this.state.optionVal}`]: this.state.inputVal,
            status: this.state.status,
            type: this.state.type,
            StartTime: this.state.startTime,
            EndTime: this.state.endTime,
            effectiveTime: this.state.effectiveTime ? Moment(this.state.effectiveTime).format("YYYY-MM-DD"):'',
            overTime: this.state.overTime ? Moment(this.state.overTime).format("YYYY-MM-DD"):''
          });
        }
      }
    };
  }
  selectChange (ev) {
    this.setState({
      inputVal: '',
      optionVal: ev
    })
  }

  handleSelectChange(type, value) {
    this.setState({[type]: value});
  }

  handleCancel = (e) => {
      this.setState({
          visibleShow: false,
      });
  }
  //活动时间
  timeRange = (type, date) => {
    let time;
    if(date){
        time = date._d.getTime();
    }
    if (type === 'x1') {
        this.setState({effectiveTime: time})
    }
    if (type === 'x11') {
        this.setState({overTime: time})
    }
    if (type === 'x2') {
      this.setState({startTime: time})
    }
    if (type === 'x22') {
        this.setState({endTime: time})
    }
  }
  //展开与收起
  toggleForm = () => {
    this.setState({
      showScreen: !this.state.showScreen,
      previewVisible: false,
      startTime: '',
      endTime: '',
      effectiveTime: '',
      overTime: '',
      status:'',
      type:''
    });
  };
  //点击弹出页面
  sendShow (e) {
    if(this.props.code){
      this.setState({
        [e]: true
      })
    }else{
      message.warning('请选择新增到哪个广告位下');
    }

  }
  //点击关闭页面
  handleCancel1(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false,
    })
    // this.props.queryadQuery({userId: userData.id, page: 1, size: 10})
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

  //关闭图片
  closeImg = () => this.setState({ previewVisible1: false });


  render() {
    const { adData } = this.props;
    const content = adData ? this.formart(adData) : [];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {xl: { span: 4 },xxl: { span: 2 }},
      wrapperCol: {xl: { span: 20 },xxl: { span: 21 }}
    };
    const formItemLayout1 = {
      labelCol: {xl: { span: 8 },xxl: { span: 6 }},
      wrapperCol: {xl: { span: 13 },xxl: { span: 14 }}
    };

    const columns = [
      {
        title: '编号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
      },
      {
        title: '广告名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '广告状态',
        dataIndex: 'status',
        key: 'status',
        render:(e) => {
          let status = '未知状态';
          if(e == "1"){
            status = '启用'
          }      
          if(e == "2"){
            status = '停用'
          }
          return status;
        }
      },
      {
        title: '排序',
        dataIndex: 'seq',
        key: 'seq'
      },
      {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        width: 200,
      },
      {
        title: '跳转类型',
        dataIndex: 'type',
        key: 'type',
        render: (code) => {
          let status;
          if(code == 1){
            status = '链接'
          }
          if(code == 2){
            status = '商品'
          }
          if(code == 3){
            status = '列表'
          }
          if(code == 4){
            status = '活动'
          }
          return status;
        }
      },
      {
        title: '跳转地址',
        dataIndex: 'content',
        key: 'content',
        width: 200,
        render: (text, record) => {
          return <div className={styles.adverUrl}>{ record.content }</div>
        }
      },
      {
        title: '图片',
        dataIndex: 'osskey',
        key: 'osskey',
      },
      {
        title: '发布人',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '广告位类型',
        dataIndex: 'adSpaceType',
        key: 'adSpaceType',
        render: (e) => {
          let type = "未知类型";
          if(e == "1"){
            type = '轮播';
          }
          if(e == "2"){
            type = '平铺';
          }
          return type;
        }
      }
    ];

    const {showScreen,imgUrl} = this.state;
    let Element = '';
    if (showScreen) {
      Element = (
        <Row style={{marginTop: '15px'}}>
          <Col xl={6} xxl={5}>
            <FormItem
              label="广告状态"
              {...formItemLayout1}>
                <Select 
                  onChange={this.handleSelectChange.bind(this, 'status')}
                  value={this.state.status}
                  style={{ width: '100%'}} >
                  <Option value="">全部</Option>
                  <Option value="1">启用</Option>
                  <Option value="2">停用</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={13} xxl={15}>
            <FormItem label="生效时间" {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={this.timeRange.bind(this, 'x1')}
                    value={this.state.effectiveTime ? Moment(this.state.effectiveTime) : null} 
                    />
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={this.state.overTime ? Moment(this.state.overTime) : null} 
                    onChange={this.timeRange.bind(this, 'x11')}
                    />
            </FormItem>
          </Col>
          <Col xl={6} xxl={5} style={{marginTop:15}}>
            <FormItem
              label="跳转类型"
              {...formItemLayout1}>
                <Select 
                  onChange={this.handleSelectChange.bind(this, 'type')}
                  value={this.state.type}
                  style={{ width: '100%'}} >
                  <Option value="">全部</Option>
                  <Option value="1">链接</Option>
                  <Option value="2">商品</Option>
                  <Option value="3">列表</Option>
                  <Option value="4">活动</Option>
                </Select>
            </FormItem>
          </Col>
          <Col xl={13} xxl={15} style={{marginTop:15}}>
            <FormItem label="发布时间"
                {...formItemLayout}>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={this.state.startTime ? Moment(this.state.startTime) : null}
                    onChange={this.timeRange.bind(this, 'x2')}
                    />
                <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={this.state.endTime ? Moment(this.state.endTime) : null}
                    onChange={this.timeRange.bind(this, 'x22')}
                    />
            </FormItem>
          </Col>
          <Col xl={5} xxl={3} style={{marginTop:15,textAlign:'center'}}>
              <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
              <a style={{color: '#1890ff',lineHeight:2.3,fontSize: '14px' }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
          </Col>
        </Row>
      )
    }
    return (
      <div className={styles.commonBox} >
        <div style={{width: '100%', padding: '20px 0 10px 24px', backgroundColor: "#FFF"}}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="" key="1">
              <Row >
                  <Col xl={3} xxl={2}>
                    <Button type="primary" 
                      onClick={this.sendShow.bind(this, 'addVisible')} 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增广告</Button>
                  </Col>

                  <Col xl={14} xxl={18}>
                    <Col span={24}>
                      <InputGroup compact>
                        {getFieldDecorator('name', {initialValue: 'name'})(
                          <Select style={{ width: 114}} onChange={this.selectChange.bind(this)} >
                            <Option value="name">广告名称</Option>
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

                  <Col xl={6} xxl={3} style={{display:showScreen?'none':'',textAlign:'center'}}>
                    <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                    <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>展开<Icon type="down" /></a>
                  </Col>
              </Row>
              { Element }
            </TabPane>
          </Tabs>
        </div>
        <div style={{width: '100%', padding: '10px 24px 24px 24px', backgroundColor: "#FFF"}}>
          <Row>
                <Table
                  loading={this.props.loading}
                  columns={columns}
                  dataSource={content.data}
                  rowKey={record => record.id}
                  onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                  pagination={content.pagination}
                  bordered
                  size="middle"
                />
          </Row>
        </div>

        <Drawer
          title="新增广告"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel1.bind(this, 'addVisible')}
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
          onClose={this.handleCancel1.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="新增/编辑"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel1.bind(this, 'editVisible')}
          maskClosable={false}
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} />
        </Drawer>

        <Modal visible={this.state.previewVisible1} footer={null} onCancel={this.closeImg}>
          <img style={{ width: '100%' }} src={ imgUrl } />
        </Modal>

      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    adData: state.advertisingManagment.adList,
    // argument: state.advertisingManagment.saveIds,//广告位id
    code: state.advertisingManagment.saveCodes, //广告位code
    loading: !!state.loading.models.advertisingManagment
  }
}

function dispatchToProps(dispatch) {
  return {
    saveSelect(payload = {}) {
      dispatch({
        type: 'advertisingManagment/save',
        payload
      })
    },
    queryadQuery(payload, params) {
      dispatch({
        type: 'advertisingManagment/adQuery',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
