import React, {Component} from 'react';
import {Input,Select,Upload,Button,Modal,Icon,Row,Col,TreeSelect,Form,message,DatePicker,Tabs} from 'antd';
import { connect } from 'dva'
import Style from './style.less';
import Moment from 'moment';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      tabKey1:"1",
      tabKey2:"1",
      areas: '',
      ids: [],
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryArea({
      userId: userData.id,
      instCode: userData.instCode
    })
  }

  regx (item) {
    var reg = /^https?|http?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    message.destroy();
    if(!item.name){
      message.warning('活动名称不能为空');
      return 
    }
    if(!this.state.effectiveTime || !this.state.closeTime){
      message.warning('活动时间不能为空');
      return 
    }
    if(!item.url){
      message.warning('活动链接不能为空');
      return 
    }
    if(!reg .test(item.url)){
      message.warning('活动链接格式不正确');
      return
    }
    if(this.state.fileLists == ''){
      message.warning('活动图片不能为空');
      return 
    }
    return true;

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
  add = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.addActivity({
                params: {
                  ...values,
                  userId: userData.id, 
                  osskey: this.state.fileLists.join(),
                  effectiveTime: `${Moment(self.state.effectiveTime).format("YYYY-MM-DD HH:mm:ss")}`,
                  closeTime: `${Moment(self.state.closeTime).format("YYYY-MM-DD HH:mm:ss")}`,
                  status: self.state.tabKey1,
                  scopeType: self.state.comIds ? '2' : '1',
                  scopeInfo: self.state.comIds ? self.state.comIds.join() : '',
                  comIds: self.setcomIds(self.state.comIds),
                  comNames: self.state.comNames?self.state.comNames.join(','):'',
                  instCode: userData.instCode
                },
                func: function () {
                    message.success('操作成功', 1.5, ()=>{
                      self.props.search('addVisible');;
                    });
                }
              })
          })
        }
      }
    })
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

  timeRange (date) {
    let effectiveTime;
    let closeTime;
    if(date){
      effectiveTime = date[0]._d.getTime();
      closeTime = date[1]._d.getTime();
    }
    this.setState({
      effectiveTime,
      closeTime
    })
  }
  TreeSelect(val,name,id){
    this.setState({
      comIds: val,
      comNames: name
    })
  }

  tabKey(type,key){
    if(type == 'status'){
      this.setState({
        tabKey1: key
      })
    }

    if(type == 'area'){
      if(key == 1) {
        this.setState({
          comIds: ''
        })
      }
      this.setState({
        tabKey2: key
      })
    }

  }


  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = ({ fileList }) => {
    let fileLists = [];
    fileList.map((item) => {
      if(item.status == 'done'){//本地上传完成
          if(item.response){
            fileLists.push(item.response)
          }
      }
    })

    this.setState({ 
      fileList,
      fileLists
    });
  }
  //校验上传图片
  checkImg(file, fileList) {
    if (!/image/.test(file.type)) {
        message.error('文件必须为图片！')
        return false;
    }
    if (file.size > 1000000) {
        message.error('图片不能超过1M！')
        return false;
    }
    return true;
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
    const { area } = this.props;
    const treeData = area ? this.loop(area) : [];//小区
    const uploadButton = (
        <Icon type="plus" style={{fontSize: 30 }} />
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.add.bind(this)}>保存</Button> :
              <Button type="primary">保存</Button>
            }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr style={{visibility:'hidden'}}>
                  <td  style={{width:'18%'}}></td><td></td>
                  <td  style={{width:'18%'}}></td><td></td>
                </tr>
                <tr>
                    <td><span className={Style.red}>*</span>活动名称</td>
                    <td colSpan={3}>
                      <span>{getFieldDecorator('name', {
                        })(<Input maxLength={30} placeholder="请输入活动名称" />)}</span>
                    </td>
                </tr>
                <tr>
                  <td>活动状态</td>
                  <td style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs activeKey={ this.state.tabKey1 } onTabClick={this.tabKey.bind(this,'status')} >
                        <TabPane tab="启用" key="1"></TabPane>
                        <TabPane tab="关闭" key="2"></TabPane>
                      </Tabs>
                  </td>
                  <td>活动类型</td>
                  <td>
                    <span>
                      {getFieldDecorator('type', {initialValue: "1"})(
                        <Select placeholder="请选择">
                          <Option value="1">H5</Option>
                          <Option value="2">报名</Option>
                          <Option value="3">房产</Option>
                        </Select>
                        )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>活动时间</td>
                  <td colSpan={3} style={{textAlign:'left'}}>
                    <RangePicker
                      showTime
                      style={{width:'69%'}}
                      onChange={this.timeRange.bind(this)} 
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={['起始时间', '结束时间']}
                    />
                  </td>
                </tr>
                <tr>
                  <td>参与条件</td>
                  <td colSpan={3}>
                      <span>
                        {getFieldDecorator('userType', {initialValue: "1"})(
                          <Select style={{width:'33%'}} placeholder="请选择">
                            <Option value="1">全部</Option>
                            <Option value="2">仅认证用户</Option>
                            <Option value="3">仅户主</Option>
                            <Option value="4">游客</Option>
                          </Select>)}
                      </span>
                      <span>
                          {getFieldDecorator('memberType', {initialValue: "1"})(
                            <Select style={{width:'33%'}} placeholder="请选择">
                              <Option value="1">V1以上会员</Option>
                              <Option value="2">V2以上会员</Option>
                              <Option value="3">V3以上会员</Option>
                              <Option value="4">V4以上会员</Option>
                              <Option value="5">V5以上会员</Option>
                              <Option value="6">V6以上会员</Option>
                            </Select>)}
                      </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>适用区域</td>
                  <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                    <Tabs activeKey={ this.state.tabKey2 } onTabClick={this.tabKey.bind(this,'area')}>
                        <TabPane tab="全部" key="1">
                          
                        </TabPane>
                        <TabPane tab="小区" key="2">
                          <Col>
                            <TreeSelect
                                placeholder='请选择'
                                onChange={ this.TreeSelect.bind(this) }
                                allowClear
                                showCheckedStrategy={SHOW_PARENT}
                                treeCheckable={true}
                                treeData={treeData}
                                />   
                          </Col>
                        </TabPane>
                      </Tabs>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>活动链接</td>
                  <td colSpan={3}>
                    {getFieldDecorator('url',{})(
                      <Input placeholder="请输入活动链接"/>
                    )}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>活动图片</td>
                  <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                    <div className="clearfix">
                      <Upload
                        action="/backstage/upload/upLoadRKey"
                        beforeUpload={this.checkImg}
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
    area: state.activityManagement.area,//小区
  }
}
function dispatchToProps(dispatch) {
  return {
    queryArea(payload, params) {
      dispatch({
        type: 'activityManagement/area',
        payload
      })
    },
    addActivity(payload, params) {
      dispatch({type: 'activityManagement/add', payload })
    },
    queryList(payload, params) {
      dispatch({type: 'activityManagement/serch', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
