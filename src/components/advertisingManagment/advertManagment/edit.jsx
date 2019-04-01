import React, {Component} from 'react';
import {Input,Select,Tabs,Tag,Button,Row,Upload,Icon,Modal,Col,Form,message,DatePicker,TreeSelect} from 'antd';
import { connect } from 'dva';
import Moment from 'moment';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      typePrefix: 'http://',
      previewVisible: false,
      previewImage: "",
      tabKey1:"",
      tabKey2: this.props.adDetail.type ? this.props.adDetail.type : '1',
      tabKey3: "",
      tabKey4: this.props.adDetail.status,
      effectiveTime: this.props.adDetail.effectiveTime,
      overTime: this.props.adDetail.overTime,
      comIds: this.props.adDetail.scopeInfo ? this.props.adDetail.scopeInfo.split(','): '',
      inputVisible: true,
      inputValue: '',
      fileList: '',
    };
  }
  
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryArea({
      userId: userData.id,
      instCode: userData.instCode
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

  regx (item) {
    //正则匹配只能输入数字
    let regNum = /^[0-9]*$/;
    //正则匹配输入网址
    var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    message.destroy();
    // if(!item.name1){
    //   message.warning('广告名称不能为空');
    //   return 
    // }
    // if(!item.content){
    //   message.warning('跳转地址不能为空');
      
    //   return 
    // }
    if(this.state.tabKey2 == 1) {
      if(item.content){
        if(!reg.test(item.content)){
          message.warning('跳转地址格式不正确');
          return
        }
      }
    }
    if(this.state.fileLists == ''){
      message.warning('广告图片不能为空');
      return 
    }
    if(!this.state.effectiveTime || !this.state.overTime){
      message.warning('生效时间不能为空');
      return 
    }
    if(!item.seq){
      message.warning('排序不能为空');
      return 
    }
    if(!regNum.test(item.seq)){
      message.warning('排序只能输入数字');
      return 
    }
    return true;

  }

  update(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        if(this.state.requestStatus){
            self.setState({requestStatus: false},() => {
              self.props.update({
                params: {
                  userId: userData.id, 
                  code: self.props.adDetail.code,
                  spaceCode: self.props.adDetail.adSpace.code,
                  id: this.props.adDetail.id,
                  name: values.name1,
                  type: self.state.tabKey2,
                  content: values.content,
                  osskey: this.state.fileLists ? this.state.fileLists.join() : this.state.fileLists,
                  effectiveTime: `${Moment(self.state.effectiveTime).format("YYYY-MM-DD HH:mm:ss")}`,
                  overTime: `${Moment(self.state.overTime).format("YYYY-MM-DD HH:mm:ss")}`,
                  seq: values.seq,
                  status: self.state.tabKey4,
                  scopeType: self.state.comIds ? '2' : '1',
                  scopeInfo: self.state.comIds ? self.state.comIds.join() : '',
                  comIds: self.setcomIds(self.state.comIds),
                  adSpaceType: self.props.adDetail.adSpace.type
                },
                func: function () {
                  
                    message.success('操作成功', 1.5, () => {
                      self.props.queryadQuery({
                        userId: userData.id,
                        page: 1,
                        size: 10,
                        spaceCode: self.props.code
                      });
                      self.props.search('editVisible');
                    });
                }
              })
            })
          }
        }

    })
  }

  tabKey(type,key){
    if(type == 'spaceStatus'){
      this.setState({
        tabKey1: key
      })
    }
    if(type == 'type'){
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
      this.setState({
        tabKey2: key
      })
    }
    if(type == 'status'){
      this.setState({
        tabKey4: key
      })
    }

    if(type == 'area'){
      if(key == 1) {
        this.setState({
          comIds: ''
        })
      }
      this.setState({
        tabKey3: key
      })
    }

  }

  //区域数组组装
  loop = (data) => {
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


  TreeSelect(val,name,id){
    this.setState({
      comIds: val
    })

  }

  timeRange (date) {
    let effectiveTime;
    let overTime;
    if(date){
      effectiveTime = date[0]._d.getTime();
      overTime = date[1]._d.getTime();
    }
    this.setState({
      effectiveTime,
      overTime
    })
  }


  //上传图片,把上传的图片存到state中
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange(info) {
    let fileLists = [];
    if(info.file.status == 'removed') {
      this.setState({
        fileList: info.fileList,
        fileLists
      });
    } else {
      let rex = this.checkImg(info.file)
      if(rex) {
        info.fileList.map((item) => {
          if(item.status == 'done'){//本地上传完成
              if(item.response){
                fileLists.push(item.response)
              }
          }
        })
        this.setState({
          fileList: info.fileList,
          fileLists
        });
      } 
    }
   
  }
  //校验上传图片
  checkImg(info) {
    if (!/image/.test(info.type)) {
        message.error('文件必须为图片！')
        return false
    }
    if (info.size > 1000000) {
        message.error('图片不能超过1M！')
        return false
    }
    return true
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage,fileList } = this.state;
    const { adDetail,area } = this.props;
    const content = adDetail ? adDetail : '';
    const time1 = Moment(content.effectiveTime).format('YYYY-MM-DD');
    const time2 = Moment(content.overTime).format('YYYY-MM-DD');
    const uploadButton = (
        <Icon type="plus" style={{fontSize: 30 }} />
    );
    const treeData = area ? this.loop(area) : [];//小区
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.update.bind(this)}>保存</Button> :
                <Button type="primary">保存</Button>
              }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>广告位编号</td>
                  <td>
                    {getFieldDecorator('code', { initialValue:content ? content.adSpace.code : '' })(
                      <Input disabled />
                    )}
                  </td>
                  <td>广告位状态</td>
                  <td>
                    {content ? ( content.adSpace.status == '1' ? '启用' : '禁用' ) : ''}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>广告位名称</td>
                  <td>
                    {getFieldDecorator('name', { initialValue:content ? content.adSpace.name : '' })(
                      <Input disabled />
                    )}
                  </td>
                  <td><span className={Style.red}>*</span>所在页面</td>
                  <td>
                    {getFieldDecorator('page', { initialValue:content ? content.adSpace.page : '' })(
                      <Select disabled style={{ width: '100%' }}>
                        <Option value="1">首页</Option>
                        <Option value="2">启动项</Option>
                        <Option value="3">商城</Option>
                      </Select>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>广告位类型</td>
                  <td>
                     <span>{getFieldDecorator('type', { initialValue:content ? content.adSpace.type : '' })(
                     <Select disabled style={{ width: '100%' }}>
                        <Option value="1">轮播</Option>
                        <Option value="2">平铺</Option>
                      </Select>)}</span>
                  </td>
                  <td>最大数量</td>
                  <td>
                    {getFieldDecorator('max', { initialValue:content ? content.adSpace.max : '' })(
                      <Input disabled maxLength={50} />
                    )}
                  </td>
                </tr>

              </tbody>
            </table>

            <table cellSpacing="0" style={{marginTop:40}} className={Style.mytable}>
              <tbody>
                <tr>
                  <td>广告名称</td>
                  <td colSpan={3}>
                    {getFieldDecorator('name1', { initialValue: content.name })(
                      <Input maxLength={50} placeholder="请输入广告名称" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>跳转类型</td>
                  <td colSpan={3} style={{textAlign:'left',padding:'7px 0 7px 15px'}}>
                    <Tabs activeKey={ this.state.tabKey2 } onTabClick={this.tabKey.bind(this,'type')}>
                      <TabPane tab="链接" key="1"></TabPane>
                      <TabPane tab="商品" key="2"></TabPane>
                      <TabPane tab="列表" key="3"></TabPane>
                      <TabPane tab="活动" key="4"></TabPane>
                    </Tabs>
                  </td>
                </tr>
                <tr>
                  <td>跳转地址</td>
                  <td colSpan={3}>
                      {this.state.typePrefix}{getFieldDecorator('content', { initialValue: content.content })(
                        <Input style={{width:'90%'}} />
                      )}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>广告图片</td>
                  <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                    <div className="clearfix">
                      <Upload
                        action="/backstage/upload/upLoadRKey"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange.bind(this)}
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
                  <td><span className={Style.red}>*</span>生效时间</td>
                  <td colSpan={3} style={{textAlign:'left'}}>
                    <RangePicker
                      showTime
                      onChange={this.timeRange.bind(this)}
                      defaultValue={[ Moment(time1,"YYYY-MM-DD HH:mm:ss"),Moment(time2,"YYYY-MM-DD HH:mm:ss")]} 
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={['起始时间', '结束时间']}
                    />
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>适用区域</td>
                  <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                    <Tabs activeKey={ this.state.tabKey3 ? this.state.tabKey3 : content.scopeType } onTabClick={this.tabKey.bind(this,'area')}>
                        <TabPane tab="全部" key="1">
                          
                        </TabPane>
                        <TabPane tab="小区" key="2">
                          <Col>
                            <TreeSelect  
                              placeholder='请选择'
                              allowClear
                              onChange={ this.TreeSelect.bind(this) }
                              showCheckedStrategy={SHOW_PARENT}
                              treeCheckable={true}
                              value={ this.state.comIds == "" ? "" : this.state.comIds }
                              treeData={treeData}
                            />
                          </Col>
                        </TabPane>
                    </Tabs>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>排序</td>
                  <td colSpan={3}>
                    {getFieldDecorator('seq', { initialValue: content.seq })(
                      <Input placeholder="请输入数字,数字越小排序越高" maxLength={11} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>广告状态</td>
                  <td colSpan={3} style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs activeKey={ this.state.tabKey4 } onTabClick={this.tabKey.bind(this,'status')}>
                        <TabPane tab="启用" key="1"></TabPane>
                        <TabPane tab="禁用" key="2"></TabPane>
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
    adDetail: state.advertisingManagment.adDetail,
    argument: state.advertisingManagment.saveIds, //广告位id
    code: state.advertisingManagment.saveCodes, //广告位code
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
    update(payload, params) {
      dispatch({
        type: 'advertisingManagment/adUpdate',
        payload
      })
    },
    queryArea(payload, params) {
      dispatch({
        type: 'advertisingManagment/area',
        payload
      })
    },
    queryadQuery(payload, params) {
      dispatch({
        type: 'advertisingManagment/adQuery',
        payload
      })
    },
    deleteImg(payload, params) {
      dispatch({
        type: 'advertisingManagment/deleteImg',
        payload
      })
    },
    showImg(payload, params) {
      dispatch({
        type: 'advertisingManagment/showImg',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
