import React, {Component} from 'react';
import {Tabs,Button,Row,Upload,Col,Modal,Form,TreeSelect } from 'antd';
import { connect } from 'dva';
import Moment from 'moment';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typePrefix: 'http://',
      fileList: [],
      previewVisible: false,
      previewImage: "",
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryArea({
      userId: userData.id,
    })
    this.props.queryadDetail({
      params:{ 
        userId: userData.id, 
        id: this.props.detailId.id
      },
      func: () => {
        let img = [];
        let adDetail = this.props.adDetail
        if(adDetail.osskey != ''){
          const osskey = adDetail.osskey.split(',');
          img = osskey.map((item) => {
            const data = {
                status: 'done',
                url: `/backstage/upload/download?uuid=${item}&viewFlag=1&fileType=jpg&filename=aa`,
                uid: item
            };
            return data;
          });
        }
        let typePrefix = ''
        if(adDetail.type == 1) {
          typePrefix = 'http://'
        } else if(adDetail.type == 2) {
          typePrefix = '商品ID='
        } else if(adDetail.type == 2) {
          typePrefix = '列表ID='
        } else if(adDetail.type == 2) {
          typePrefix = '活动ID='
        }
        this.setState({fileList: img, typePrefix})
      }
    });
   
  }

  tabKey(key){
    if(key == 1){
      this.setState({typePrefix:'http://'})
    }
    if(key == 2){
      this.setState({typePrefix:'商品ID='})
    }
    if(key == 3){
      this.setState({typePrefix:'列表ID='})
    }
    if(key == 4){
      this.setState({typePrefix:'活动ID='})
    }
  }
  setcomIds (data) {
    let self = this
    let ids = []
    if(data) {
      data.forEach((item)=>{
        if(item.split('-')[2] == 1) {
          self.props.area.forEach(ele => {
            if(ele.id == item.split('-')[0]) {
              ele.areas.forEach(element=>{
                element.communitys.forEach(e=>{
                  ids.push(e.id)
                })
              })
            }
          });
        } else if(item.split('-')[2] == 2) {

          self.props.area.forEach(ele => {
            ele.areas.forEach(element=>{
              if(element.id == item.split('-')[0]) {
                  element.communitys.forEach(e=>{
                    ids.push(e.id)
                  })
              }
            })

          });
        } else if(item.split('-')[2] == 3) {
          ids.push(item.split('-')[0])
        }
      })
    }
    return ids.join()
  }
  //区域数组组装
  loopArea = (data) => {
    let newData = [];
    data.forEach((item) => {
      let itemData = [];
      if(item.areas){
        item.areas.forEach((e) => {
          if(e.communitys){
            let children = [];
            e.communitys.forEach((en) => {
              children.push({
                title: en.name,
                value: `${en.id}-${en.code}-3`,
                key: `${en.id}-${en.code}`,
              })
            })
            itemData.push({
              title: e.name,
              value: `${e.id}-${e.code}-2`,
              key: `${e.id}-${e.code}`,
              children
            })

          }else{
            itemData.push({
              title: e.name,
              value:`${e.id}-${e.code}-2`,
              key: `${e.id}-${e.code}`,
            })
          }


        })
      }
      newData.push({
        title: item.name,
        value: `${item.id}-${item.code}-1`,
        key: `${item.id}-${item.code}`,
        children: itemData
      })
    })
    return newData;
  }

  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }
  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = ({ fileList }) => this.setState({ fileList });
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  loop = (data) => {
    let newData = {};
    for(let e in data.adSpace) {
      if(e == "page"){
        switch (data.adSpace[e]) {
          case "1":
            data.adSpace[e] = '首页';
            break;
          case "2":
            data.adSpace[e] = '启动项';
            break;
          case "3":
            data.adSpace[e] = '商城';
            break
        }
      }
      if(e == "type"){
        switch (data.adSpace[e]) {
          case "1":
            data.adSpace[e] = '轮播';
            break;
          case "2":
            data.adSpace[e] = '平铺';
            break;
        }
      }
      if(e == "status"){
        switch (data.adSpace[e]) {
          case "1":
            data.adSpace[e] = '启用';
            break;
          case "2":
            data.adSpace[e] = '禁用';
            break;
        }
      }
      newData[e] = data.adSpace[e];
    }
    for(let i in newData){
      data.adSpace[i] = newData[i];
    }
    return data;
  }


  render() {
    const { previewVisible, previewImage,fileList } = this.state;
    const { adDetail,area } = this.props;
    const content = adDetail ? this.loop(adDetail) : '';
    const treeData = area ? this.loopArea(area) : [];//小区
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>广告位编号</td>
                    <td>{ content ? content.adSpace.code : ''}</td>
                    <td>广告位状态</td>
                    <td>
                      {content ? ( content.adSpace.status == '1' ? '启用' : '禁用' ) : ''}
                    </td>
                  </tr>
                  <tr>
                    <td>广告位名称</td>
                    <td>{ content ? content.adSpace.name : '' }</td>
                    <td>所在页面</td>
                    <td>{ content ? content.adSpace.page : '' }</td>
                  </tr>
                  <tr>
                    <td>广告位类型</td>
                    <td>{ content ? content.adSpace.type : '' }</td>
                    <td>最大数量</td>
                    <td>{ content ? content.adSpace.max : '' }</td>
                  </tr>

                </tbody>
              </table>

              <table cellSpacing="0" style={{marginTop:40}} className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>广告名称</td>
                    <td colSpan={3}>{ content.name }</td>
                  </tr>
                  <tr>
                    <td>跳转类型</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 0 7px 15px'}}>
                      <Tabs activeKey={ content.type ? content.type : '1' } onChange={this.tabKey.bind(this)}>
                        <TabPane disabled tab="链接" key="1"></TabPane>
                        <TabPane disabled tab="商品" key="2"></TabPane>
                        <TabPane disabled tab="列表" key="3"></TabPane>
                        <TabPane disabled tab="活动" key="4"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>跳转地址</td>
                    <td colSpan={3}>{this.state.typePrefix} { content.content }</td>
                  </tr>
                  <tr className="adImage">
                    <td>广告图片</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                      <div className="clearfix">
                        <Upload
                          disabled
                          action="bus_backstage/upload/testuploadimg"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>生效时间</td>
                    <td colSpan={3} style={{textAlign:'left'}}>
                      { Moment(content.effectiveTime).format("YYYY-MM-DD HH:mm:ss") } ~&nbsp;
                      { Moment(content.overTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>适用区域</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                      <Tabs activeKey={ content.scopeType ? content.scopeType : "1" }>
                          <TabPane tab="全部" disabled key="1">
                            
                          </TabPane>
                          <TabPane tab="小区" disabled key="2">
                            <Col>
                              <TreeSelect  
                                disabled
                                placeholder='请选择'
                                allowClear
                                showCheckedStrategy={SHOW_PARENT}
                                treeCheckable={true}
                                value={ content.scopeInfo?content.scopeInfo.split(','):'' }
                                treeData={treeData}
                              />
                            </Col>
                          </TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>排序</td>
                    <td colSpan={3}>{content.seq}</td>
                  </tr>
                  <tr>
                    <td>广告状态</td>
                    <td colSpan={3} style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={ content.status ? content.status : "" }>
                          <TabPane disabled tab="启用" key="1"></TabPane>
                          <TabPane disabled tab="停用" key="2"></TabPane>
                        </Tabs>
                    </td>
                  </tr>
                </tbody>
              </table>
                
            </Form>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    adDetail: state.advertisingManagment.adDetail,//广告详情
    argument: state.advertisingManagment.saveIds,//广告位id
    area: state.advertisingManagment.area,//小区
    detailId: state.advertisingManagment.saveSeslect,//广告位点击的数据id
  }
}
function dispatchToProps(dispatch) {
  return {
    queryadDetail(payload, params) {
      dispatch({
        type: 'advertisingManagment/adDetail',
        payload
      })
    },
    queryArea(payload, params) {
      dispatch({
        type: 'advertisingManagment/area',
        payload
      })
    },
  }
    
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
