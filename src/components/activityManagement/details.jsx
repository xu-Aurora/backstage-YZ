import React, {Component} from 'react';
import {Select,Button,Row,Upload,Modal,Tabs,Form,Col,TreeSelect} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './style.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id
    });
    this.props.queryArea({
      userId: userData.id,
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data){
      let img = [];
      if(nextProps.data.osskey != ''){
        const osskey = nextProps.data.osskey.split(',');
        img = osskey.map((item) => {
          const data = {
              status: 'done',
              url: `/backstage/upload/download?uuid=${item}&viewFlag=1&fileType=jpg&filename=aa`,
              uid: item
          };
          return data;
        });
      }
      this.setState({fileList: img})
    }
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
  render() {
    const { data,area} = this.props;
    const {getFieldDecorator} = this.props.form;
    const content = data ? data : '';
    const treeData = area ? this.loopArea(area) : [];//小区
    const { previewVisible, previewImage,fileList } = this.state;
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div style={{ width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr style={{visibility:'hidden'}}>
                    <td  style={{width:'18%'}}></td><td></td>
                    <td  style={{width:'18%'}}></td><td></td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>活动名称</td>
                    <td colSpan={3}>
                      { content.name }
                    </td>
                  </tr>
                  <tr>
                    <td>活动编号</td>
                    <td>
                      { content.code }
                    </td>
                    <td><span className={Style.red}>*</span>发布时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                  </tr>
                  <tr>
                    <td>活动状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs activeKey={content.status}>
                        <TabPane disabled tab="启用" key="1"></TabPane>
                        <TabPane disabled tab="关闭" key="2"></TabPane>
                      </Tabs>
                    </td>
                    <td>活动类型</td>
                    <td>
                      <span>
                        {getFieldDecorator('type', {initialValue: content.type || null})(
                          <Select disabled placeholder="请选择">
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
                      { Moment(content.effectiveTime).format("YYYY-MM-DD HH:mm:ss") } ~&nbsp;
                      { Moment(content.closeTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                  </tr>
                  <tr>
                    <td>参与条件</td>
                    <td colSpan={3}>
                        <span>
                          {getFieldDecorator('userType', {initialValue: content.userType || null})(
                            <Select style={{width:'33%'}} disabled>
                              <Option value="1">全部</Option>
                              <Option value="2">认证用户</Option>
                              <Option value="3">户主</Option>
                              <Option value="4">游客</Option>
                            </Select>)}
                        </span>
                        <span>
                          {getFieldDecorator('memberType', {initialValue: content.memberType || null})(
                            <Select style={{width:'33%'}} disabled>
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
                    <Tabs activeKey={ content.scopeType ? content.scopeType : "1" }>
                        <TabPane tab="全部" key="1">
                          
                        </TabPane>
                        <TabPane tab="小区" key="2">
                          <Col>
                            <TreeSelect  
                              disabled
                              placeholder='请选择'
                              allowClear
                              showCheckedStrategy={SHOW_PARENT}
                              treeCheckable={true}
                              value={content.scopeInfo?content.scopeInfo.split(','):'' }
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
                        { content.url }
                    </td>
                  </tr>
                  <tr className="adImage">
                    <td><span className={Style.red}>*</span>活动图片</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                      <div className="clearfix">
                        <Upload
                          disabled
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

                </tbody>
              </table>
            </Row>

          </Form>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.activityManagement.saveSeslect, 
    data: state.activityManagement.detail, 
    area: state.advertisingManagment.area,//小区
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'activityManagement/detail', payload})
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
