import React, { Component } from 'react';
import {Button,Row,Form,Upload,Modal,message} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';
import Moment from 'moment';
import PropTypes from 'prop-types';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data){
      let img = [];
      if(nextProps.data.osskeys != ''){
        const osskeys = nextProps.data.osskeys.split(',');
        img = osskeys.map((item) => {
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

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id, 
      instCode: userData.instCode,
    });
    this.props.skipInfo(this.props.argument.roomId)
  }

  //点击关闭详情页面,弹出答复页面
  sendShow (type) {
    this.props.closeDetail(type);//关闭详情
  }

  loop = (data) => {
    for(let i in data){
      if(i == "type"){
        switch (data[i]) {
          case "1":
            data[i] = "户主"
            break;
          case "2":
            data[i] = "亲属"
            break;
          case "3":
            data[i] = "朋友"
            break;  
          case "4":
            data[i] = "租客"
            break;
        }
      }
      if(i == "status"){
        switch (data[i]) {
          case "1":
            data[i] = "待审核"
            break;
          case "2":
            data[i] = "已审核"
            break;
          case "3":
            data[i] = "审批拒绝"
            break;
        }
      }
    }
    return data;
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
  goToOwner () {
    this.context.router.history.push(`/${this.props.match}/app/proprietorManagement?1`)
  }
  render() {
    const {data} = this.props;
    const content = this.loop(data) || {};
    const { previewVisible, previewImage,fileList } = this.state;
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.sendShow.bind(this, 'auditVisible')}>审核</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>申请人姓名</td>
                    <td>
                      { content.applyUserName }
                    </td>
                    <td>手机号码</td>
                    <td>
                      { content.applyUserPhone }
                    </td>
                  </tr>
                  <tr>
                    <td>申请小区</td>
                    <td>
                      { content.areaDetail }
                    </td>
                    <td>申请户号</td>
                    <td>
                      <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={this.goToOwner.bind(this)}>
                        {content.addressName}                        
                      </span>  
                    </td>
                  </tr>
                  <tr>
                    <td>申请类型</td>
                    <td>
                      { content.type }
                    </td>
                    <td>审核状态</td>
                    <td>
                      { content.status }
                    </td>
                  </tr>
                  <tr>
                    <td>申请时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>申请备注</td>
                    <td colSpan='3'>
                      { content.applyMemo }
                    </td>
                  </tr>
                  <tr className="adImage">
                    <td>申请附件</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan="3">
                      <div className="clearfix">
                        <Upload
                          disabled
                          action="/backstage/upload/upLoadRKey"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                        >
                          {fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>历史记录</td>
                    <td colSpan='3'>
                      <span>HY302001929921</span>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </Row>
          </Form>
        </div>

      </div>
    )
  }

  
}

App.contextTypes = {
  router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.proprietorManage.saveSeslect,
    data: state.proprietorManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'proprietorManage/detail', payload})
    },
    approve(payload,params) {//审核
      dispatch({type: 'proprietorManage/approve', payload})
    },
    queryList(payload, params) {
      dispatch({type: 'proprietorManage/serch', payload})
    },
    skipInfo(payload,params) {
      dispatch({type: 'proprietorManagement/skipInfo', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
