import React, { Component } from 'react';
import {Button,Row,Form,Upload,Modal} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';
import Moment from 'moment';


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
      id: this.props.argument.id, 
    });
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

  //点击关闭详情页面,弹出答复页面
  sendShow (e) {
    this.props.closeDetail(false);
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
  }
  loop = (data) => {
    for(let i in data){
      if(i == "source"){
        switch (data[i]) {
          case "1":
            data[i] = "用户APP"
            break;
          case "2":
            data[i] = "面谈"
            break;
          case "3":
            data[i] = "电话"
            break;
          case "4":
            data[i] = "邮件"
            break;
          case "5":
            data[i] = "短信"
            break;
          case "6":
            data[i] = "微信"
            break;
          case "8":
            data[i] = "公众号"
            break;
        }
      }
      if(i == "status"){
        switch (data[i]) {
          case "1":
            data[i] = "待处理"
            break;
          case "2":
            data[i] = "已处理"
            break;
        }
      }
      if(i == "userType"){
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
      if(i == "type"){
        switch (data[i]) {
          case "1":
            data[i] = "投诉"
            break;
          case "2":
            data[i] = "建议"
            break;
          case "3":
            data[i] = "表扬"
            break;
        }
      }
      if(i == "createTime"){
        data[i] = Moment(data[i]).format("YYYY-MM-DD HH:mm:ss")
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
              <Button type="primary"  onClick={this.sendShow.bind(this, 'answerVisible')}>答复处理</Button>
              <h3 style={{marginTop:15}}>客户信息</h3>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>订单编号</td>
                    <td>
                      <span>{content.orderNo}</span>
                    </td>
                    <td>客户姓名</td>
                    <td>
                      <span>{content.userName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>客户电话</td>
                    <td>
                      <span>{content.userPhone}</span>
                    </td>
                    <td>客户类型</td>
                    <td>
                      <span>{content.userType}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>申请小区</td>
                    <td>
                      <span>{content.areaDetail}</span>
                    </td>
                    <td>申请户号</td>
                    <td>
                      <span>{content.addressName}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3>事件信息</h3>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>订单类型</td>
                    <td>
                      <span>{content.type}</span>
                    </td>
                    <td>订单时间</td>
                    <td>
                      <span>{content.createTime}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>订单来源</td>
                    <td>
                      <span>{content.source}</span>
                    </td>
                    <td>处理状态</td>
                    <td>
                      <span>{content.status}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>订单内容</td>
                    <td colSpan='3'>
                      <span>{content.content}</span>
                    </td>
                  </tr>
                  <tr className="adImage">
                    <td>订单附件</td>
                    <td colSpan='3'>
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
                    <td>订单记录</td>
                    <td colSpan='3'>
                      { content.answer ? 
                        <div className={Style.card}>
                          <div>1</div>
                          <div>
                            <p>已答复 : {content.answer}</p>
                            <span style={{marginRight:20}}>操作人 : {content.updateUserId}</span><span>操作时间 : {Moment(content.updateTime).format('YYYY-YY-DD HH:mm:ss')}</span>
                          </div>
                        </div>:<p>没有订单答复</p>
                      }
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
function mapStateToProps(state, ownProps) {
  return {
    argument: state.adviceManage.saveSeslect,
    data: state.adviceManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'adviceManage/detail', payload})
    },
    
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
