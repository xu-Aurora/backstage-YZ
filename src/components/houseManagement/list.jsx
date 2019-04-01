import React, {Component} from 'react';
import { Tabs, Button, Form, Row, Col, Drawer, Table, message, Upload } from 'antd';
import Moment from 'moment';
import { connect } from 'dva'
import styles from './style.less';
import {mul} from '../../util/count';

import AddBuilding from './addBuilding.jsx';
import AddNo from './home/add.jsx';
import Detail from './home/detail.jsx';
import Edit from './home/edit.jsx';


const TabPane = Tabs.TabPane;
const columns = [
  {
    title: '序号',
    dataIndex: 'keys',
    key: 'keys',
    width: 60
  },
  {
    title: '户号',
    dataIndex: 'code',
    key: 'code',
    width: 120
  },
  {
    title: '户型',
    dataIndex: 'typeCode',
    key: 'typeCode',
    width: 120
  },
  {
    title: '面积',
    dataIndex: 'square',
    key: 'square',
    width: 120
  },
  {
    title: '物业费率',
    dataIndex: 'propertyRate',
    key: 'propertyRate',
    width: 120    
  },
  {
    title: '物业费',
    dataIndex: 'fee',
    key: 'fee',
    width: 120
  },

];

function siblingElems(elem){
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      pageSize: 10,
      saveSelect: false,
      id:'',
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      title: '',
      zxhsData: [],
      unitData: []
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.getZxhs({
      params: {userId: userData.id, comId : self.props.communityRight.id, comCourtId :  self.props.gardenRight ? self.props.gardenRight.id:''},
      func: function() {
        if(self.props.zxhsData.length) {
          self.props.saveZxhs(self.props.zxhsData[0])
          self.props.getUnit({
            params:{userId: userData.id,type: 2, parentId: self.props.zxhsData[0].id},
            func: function(){
              if(self.props.unitData[0]) {
                self.props.saveUnit(self.props.unitData[0])
                self.props.getHose({userId: userData.id, addressId: self.props.unitData[0].id, page: 1,size:10})
              } else {
                self.props.saveUnit('')
              }
            }
          }) 
        }
      } 
    });
  }
  componentWillReceiveProps(nextProps) {
    let self = this
    if(nextProps.gardenRight) {
      let title = `${nextProps.communityRight.area}${nextProps.communityRight.name}-${nextProps.gardenRight.name}`
      self.setState({
        title
      })
    } else {
      let title = `${nextProps.communityRight.area}${nextProps.communityRight.name}`
      self.setState({
        title
      })
    }
    this.setState({
      zxhsData: nextProps.zxhsData,
      unitData: nextProps.unitData
    })
  }
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveHouse(record.alldata);
    this.setState({
        detailVisible: true
    })
  }
  formart =(content) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
     const data = [];
     if (content.list) {
      content.list.forEach((item, key) => {
        data.push({
          keys: key+1,
          id: item.id,
          code: item.code,
          typeCode:  item.typeCodeName,
          square: item.square,
          propertyRate: item.propertyRate,
          fee: mul(item.propertyRate, item.square),
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
          this.props.getHose({
            userId: userData.id, 
            addressId: this.props.unitInfo.id, 
            page: current, 
            size: pageSize
          })    
        },
        onChange:(current, pageSize) => {
          this.props.getHose({
            userId: userData.id, 
            addressId: this.props.unitInfo.id, 
            page: current, size: pageSize
          })    
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

  //点击弹出页面
  sendShow (e) {
    if (e == 'addNo') {
      if(this.props.unitInfo) {
        this.setState({
          [e]: true
        })
      } else{
        message.error('没有单元不能新增')
      }
    } else {
      this.setState({
        [e]: true
      })
    }
  }
  //点击关闭页面
  handleCancel(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    let self=this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    self.props.getZxhs({
      params: {userId: userData.id, comId : self.props.communityRight.id, comCourtId :  self.props.gardenRight ? self.props.gardenRight.id:''},
      func: function() {
        if(self.props.zxhsData.length) {
          self.props.saveZxhs(self.props.zxhsData[0])
          self.props.getUnit({
            params:{userId: userData.id,type: 2, parentId: self.props.zxhsData[0].id},
            func: function(){
              if(self.props.unitData[0]) {
                self.props.saveUnit(self.props.unitData[0])
                self.props.getHose({userId: userData.id, addressId: self.props.unitData[0].id, page: 1,size:10})
              } else {
                self.props.saveUnit('')
              }
            }
          }) 
        }
      } 
    })
  }
  house (item) {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    self.props.getHose({userId: userData.id, addressId: this.props.unitInfo.id, page: 1,size:10})    
  }
  loop (data) {
    let self = this
    let children = []
    data.forEach(function(item, index){
        children.push(
            <div className={styles.building} key={index} onClick={self.zxhs.bind(self, item)}>
              <div className={item.status ? `${styles.in}`: ''}>{item.name}</div>
            </div>
            )
    })
    return children
  }
  zxhs(data) {
    let self = this
    //幢
    let list = this.state.zxhsData
    list.forEach(function(item){
      if(item.id == data.id) {
        item.status = true
      } else{
        item.status = false
      }
    })
    this.setState({
      zxhsData: list 
    })
    self.props.saveZxhs(data)
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getUnit({
      params:{userId: userData.id,type: 2, parentId: data.id},
      func: function(){
        if(self.props.unitData[0]) {
          self.props.saveUnit(self.props.unitData[0])
          self.props.getHose({userId: userData.id, addressId: self.props.unitData[0].id, page: 1,size:10})
        } else {
          self.props.saveUnit('')
        }
      }
    })
  }
  unitLoop (data) {
    let self = this
    let children = []
    data.forEach(function(item, index){
        children.push(
            <div className={styles.building} key={index} onClick={self.unit.bind(self, item)}>
              <div className={item.status ? `${styles.in}`: ''}>{item.name}</div>
            </div>
            )
    })
    return children
  }
  unit(data) {
    let self = this
    let list = this.state.unitData
    list.forEach(function(item){
      if(item.id == data.id) {
        item.status = true
      } else{
        item.status = false
      }
    })
    this.setState({
      unitData: list 
    })
    self.props.saveUnit(data)
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    self.props.getHose({userId: userData.id, addressId: data.id, page: 1,size:10})    
  }
  goEdit(){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:true})
      }, 500);
    })
  }
  beforeUpload(file) {
    let name = file.name
    let format = name.split('.')[1]
    if(format != 'xlsx') {
      message.error('文件格式不正确')
      return false
    }
    return true
  }
  handleImg(info) {
    let self = this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if (info.file.status === 'done') {
      if(info.file.response.code == '200') {
        message.success('导入成功')
        self.props.getZxhs({
          params: {userId: userData.id, comId : self.props.communityRight.id, comCourtId :  self.props.gardenRight ? self.props.gardenRight.id:''},
          func: function() {
            if(self.props.zxhsData.length) {
              self.props.saveZxhs(self.props.zxhsData[0])
              self.props.getUnit({
                params:{userId: userData.id,type: 2, parentId: self.props.zxhsData[0].id},
                func: function(){
                  if(self.props.unitData[0]) {
                    self.props.saveUnit(self.props.unitData[0])
                    self.props.getHose({userId: userData.id, addressId: self.props.unitData[0].id, page: 1,size:10})
                  } else {
                    self.props.saveUnit('')
                  }
                }
              }) 
            }
          } 
        })
      } else {
        message.error(info.file.response.message)
      }
    } else if (info.file.status === 'error') {
      message.error(`导入失败`);
    }
  }
  render() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const { hoseData } = this.props;
    const content = hoseData ? this.formart(hoseData) : [];
    let params = {
      name: 'file',
      action: '/backstage/community/importExcel',
      data: {
        userId: userData.id,
        comId : this.props.communityRight.id, 
        comCourtId :  this.props.gardenRight ? this.props.gardenRight.id:''
      }
    }
    return (
      <div className={styles.commonBox} >
        <div className={styles.header1}>
          <Row>
            <Col span={3} className={styles.title}>{this.state.title}</Col>
            <Col>
                <Button type="primary" 
                  onClick={this.sendShow.bind(this, 'addBuilding')}
                  style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight: 15}}>新增/编辑幢</Button>
                <Button type="primary" 
                  onClick={this.sendShow.bind(this, 'addNo')}
                  style={{backgroundColor:'#FFF',borderColor:'rgba(55, 127, 194, 1)',color:'#377FC2'}}>新增户</Button>
                   <Upload 
                        beforeUpload={this.beforeUpload.bind(this)}
                        onChange={this.handleImg.bind(this)}
                        {...params}
                    >
                       <Button type="primary" 
                                    style={{borderColor:'#FFF',marginLeft: 10}} >批量导入</Button>
                    </Upload>
                   
            </Col>
          </Row>
        </div>
        <div className={styles.header2}>
          <Row style={{maxHeight:126,overflow:'auto'}}>
            <Col style={{fontWeight:650,color:'#333',lineHeight:2.5}} span={1}>楼栋</Col>
            <Col span={23}>
                {this.loop(this.state.zxhsData)}
            </Col>
          </Row>
          <Row style={{maxHeight:126,overflow:'auto'}}>
            <Col style={{fontWeight:650,color:'#333',lineHeight:2.5}} span={1}>单元</Col>
            <Col span={23}>
                {this.unitLoop(this.state.unitData)}
            </Col>
          </Row>

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
                  scroll={{ y: true}}
                  size="middle"
                />
          </Row>
        </div>

        <Drawer
          title="新增/编辑楼栋"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addBuilding')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.addBuilding}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <AddBuilding search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="新增户"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addNo')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.addNo}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <AddNo search={this.house.bind(this)} />
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
          <Detail search={this.house.bind(this)} goEdit={this.goEdit.bind(this)}/>
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
          <Edit search={this.house.bind(this)}/>
        </Drawer>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityRight: state.houseManagement.communityRight,
    gardenRight: state.houseManagement.gardenRight,
    zxhsData: state.houseManagement.zxhsData,
    unitData: state.houseManagement.unitData,
    unitInfo: state.houseManagement.unitInfo,
    hoseData: state.houseManagement.hoseData
  }
}

function dispatchToProps(dispatch) {
  return {
    getZxhs(payload = {}) {
      dispatch({
        type: 'houseManagement/getZxhs',
        payload
      })
    },
    getUnit(payload = {}) {
      dispatch({
        type: 'houseManagement/getUnit',
        payload
      })
    },
    getHose(payload = {}) {
      dispatch({
        type: 'houseManagement/getHose',
        payload
      })
    },
    saveUnit(payload = {}) {
      dispatch({
        type: 'houseManagement/saveUnit',
        payload
      })
    },
    saveZxhs(payload = {}) {
      dispatch({
        type: 'houseManagement/saveZxhs',
        payload
      })
    },
    saveHouse(payload = {}) {
      dispatch({
        type: 'houseManagement/saveHouse',
        payload
      })
    },


    queryList(payload = {}) {
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
    saveSelect(payload = {}) {
      dispatch({
        type: 'roloManage/save',
        payload
      })
    },
    detele(payload = {}) {
      dispatch({
        type: 'roloManage/details',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
