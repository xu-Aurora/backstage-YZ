import React, {Component} from 'react';
import {Input,Select,Icon,Button,Row,Upload,Tabs,Modal,Col,DatePicker,Form,message,TreeSelect} from 'antd';
import { connect } from 'dva';
import Moment from 'moment';
import Style from './style.less';


const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      fileList: [],
      tabKey1: '1',
      tabKey2: '1',
      tabKey3: '1',
      previewVisible: false,
      previewImage: "",
      isTrue: 'table-row'
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryArea({
      userId: userData.id,
      instCode: userData.instCode
    })
  }

  timeRange (date) {
    let sendTime;
    if(date){
      sendTime = date._d.getTime();
    }
    this.setState({
      sendTime
    })
  }

  tabKey(type,key){
    if(type == 'newsType'){
      this.setState({tabKey1: key})
      if(key == '1'){
        this.setState({isTrue: 'table-row'})
      }
      if(key == '2'){
        this.setState({
          isTrue: 'none',
          fileList: [],
          url: ''
        })
        this.props.form.setFieldsValue({url: ''})
      }
    }
    if(type == 'scopeType'){
      this.setState({tabKey2: key})
    }
    if(type == 'sendTime'){
      this.setState({tabKey3: key})
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
        } else if(item.split('-')[1] == 1) {
          ids.push(`-${item.split('-')[1]}`)
        }
      })
    }
    return ids.join()
  }
  //区域数组组装
  loop = (data) => {
    let newData = [];
    let newDatas = [];
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
    newDatas.push({
      title: "全国",
      value: `${-1}-${-1}--1`,
      key: `${-1}-${-1}`,
      children: newData
    })
    return newDatas;
  }
  TreeSelect(val,name,id){
    this.setState({
      comIds: val
    })
  }

  regx(item){
    let reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    message.destroy();
    if(this.state.tabKey1 == '1'){
      if(!item.title){
        message.warning('消息标题不能为空');
        return 
      }
    }
    if(!item.content){
      message.warning('消息内容不能为空');
      return 
    }
    if(this.state.tabKey1 == '1'){
      if(this.state.fileList == ''){
        message.warning('消息图片不能为空');
        return 
      }
      if(!item.url){
        message.warning('消息链接不能为空');
        return 
      }
      if(!reg .test(item.url)){
        message.warning('消息链接格式不正确');
        return
      }
    }
    if(this.state.tabKey2 == '1'){
      if(!item.phones){
        message.warning('用户手机号码不能为空');
        return 
      }
      // if(item.phones.indexOf('，')){
      //   message.warning('必须要用英文逗号隔开');
      //   return 
      // }
      if(item.phones.split(',').length > 1){
        item.phones.split(',').forEach((item) => {
          if(!regPhone.test(item)){
            message.warning('用户手机号码格式不正确');
            return 
          }
        })
      }
      if(item.phones.split(',').length == 1){
        if(!regPhone.test(item.phones)){
          message.warning('用户手机号码格式不正确');
          return 
        }
      }
      
    }

    if(this.state.tabKey2 == '2'){
      if(!this.state.comIds){
        message.warning('选择区域不能为空');
        return 
      }
      if(!item.userType){
        message.warning('认证角色不能为空');
        return 
      }
    }
    if(this.state.tabKey3 == '2'){
      if(!this.state.sendTime){
        message.warning('推送时间不能为空');
        return 
      }
    }
    if(!item.messageClassify){
      message.warning('消息分类不能为空');
      return 
    }
    return true;
  }

  add = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    let scopeType;
    if(self.state.tabKey2 == '1'){
      scopeType = '0'
    }
    if(self.state.tabKey2 == '2'){
      scopeType = '1'
    }
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        self.setState({requestStatus: false},() => {
          self.props.addSend({
            params: {
              ...values,
              serviceType: '2',
              instCode: userData.instCode,
              phones: values.phones,
              userId: userData.id, 
              newsType: self.state.tabKey1,
              pushTimeStatus: self.state.tabKey3,
              scopeType: scopeType,
              sendTime: this.state.sendTime?Moment(this.state.sendTime).format("YYYY-MM-DD HH:mm:ss"):'',
              comIds: self.setcomIds(self.state.comIds),
              osskeys: this.state.tabKey1 == '1' ? this.state.fileList[0].response : ''
            },
            func: function () {
                message.success('操作成功', 1.5, ()=>{
                  self.props.search('addVisible');
                });
            }
          })
        })
      }

    })
  }


  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = ({ fileList }) => {
    this.setState({ fileList });
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
    const treeData = area ? this.loop(area) : [];//区域
    const uploadButton = (
        <Icon type="plus" style={{fontSize: 30 }} />
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.add}>确认推送</Button> :
                <Button type="primary">确认推送</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>消息类型</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 0 7px 15px'}}>
                      <Tabs activeKey={ this.state.tabKey1 } onChange={this.tabKey.bind(this,'newsType')}>
                        <TabPane tab="消息" key="1"></TabPane>
                        <TabPane tab="短信" key="2"></TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr style={{display:this.state.isTrue}}>
                    <td><span className={Style.red}>*</span>消息标题</td>
                    <td colSpan={3}>
                      {getFieldDecorator('title')(
                        <Input maxLength={30} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>消息内容</td>
                    <td colSpan={3}>
                      {getFieldDecorator('content')(
                        <TextArea maxLength={200} />
                      )}
                    </td>
                  </tr>
                  <tr style={{display:this.state.isTrue}}>
                    <td><span className={Style.red}>*</span>消息图片</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                      <div className="clearfix">
                        <Upload
                          action="/backstage/upload/upLoadRKey"
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
                  <tr style={{display:this.state.isTrue}}>
                    <td><span className={Style.red}>*</span>消息链接</td>
                    <td colSpan={3}>
                      {getFieldDecorator('url')(
                        <Input maxLength={30} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>推送对象</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                      <Tabs activeKey={ this.state.tabKey2 } onChange={this.tabKey.bind(this,'scopeType')}>
                        <TabPane tab="自定义" key="1">
                          {getFieldDecorator('phones')(
                              <Input style={{margin:'20px 0'}} placeholder="请输入用户手机号码(多个手机号用英文','隔开)" />
                          )}
                        </TabPane>
                        <TabPane tab="选择用户" key="2">
                          <Col>
                            <span>选择区域&nbsp;:&nbsp;&nbsp;</span>
                            <TreeSelect
                                style={{width:'80%'}}
                                placeholder='请选择'
                                onChange={ this.TreeSelect.bind(this) }
                                allowClear
                                showCheckedStrategy={SHOW_PARENT}
                                treeCheckable={true}
                                treeData={treeData}
                              />    
                          </Col>
                          <Col>
                            <span>认证角色&nbsp;:&nbsp;&nbsp;</span>
                            {getFieldDecorator('userType', {})(
                              <Select placeholder="请选择" style={{width:'80%'}}>
                                <Option value='1'>全部用户</Option>
                                <Option value='2'>已认证业主</Option>
                                <Option value='3'>已认证户主</Option>
                                <Option value='4'>游客</Option>
                              </Select>
                            )}   
                          </Col>
                        </TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>推送时间</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                      <Tabs activeKey={ this.state.tabKey3 } onChange={this.tabKey.bind(this,'sendTime')}>
                        <TabPane tab="立刻" key="1">
                        
                        </TabPane>
                        <TabPane tab="设置时间" key="2">
                            <Col span={15}>
                              <span>选择日期时间&nbsp;:&nbsp;&nbsp;</span>
                              <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择日期时间"
                                onChange={this.timeRange.bind(this)}
                                // onOk={onOk}
                              />
                            </Col>
                          {/* <Col span={10}>
                            <span>选择日期&nbsp;:&nbsp;&nbsp;</span>
                            <DatePicker
                              format="YYYY-MM-DD"
                              placeholder="请选择日期"
                              onChange={this.timeRange.bind(this)}
                              // onOk={onOk}
                            />
                          </Col>
                          <Col span={12}>
                            <span>选择时间&nbsp;:&nbsp;&nbsp;</span>
                            <TimePicker placeholder="请选择时间" />
                          </Col> */}
                        </TabPane>
                      </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>消息分类</td>
                    <td colSpan={3}>
                      <span>
                        {getFieldDecorator('messageClassify')(
                          <Select placeholder="请选择">
                            <Option value='0'>系统通知</Option>
                            <Option value='1'>物业通知</Option>
                            <Option value='2'>服务通知</Option>
                            <Option value='3'>活动通知</Option>
                            <Option value='4'>卡券通知</Option>
                            <Option value='5'>商城通知</Option>
                            <Option value='6'>会员通知</Option>
                          </Select>
                        )}
                      </span>
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
    area: state.activityManagement.area,//区域
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
    addSend(payload, params) {
      dispatch({type: 'messagePush/add',payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
