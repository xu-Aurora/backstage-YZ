import React, { Component } from 'react';
import {Row,Form,Upload,Modal} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './style.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: "",
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      serviceType: '2',
      id: this.props.argument.id
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data){
      let fileList;
      if(nextProps.data.osskeys){
        fileList = [{
          status: 'done',
          name: 'xxx1.png',
          url: `/backstage/upload/download?uuid=${nextProps.data.osskeys}&viewFlag=1&fileType=jpg&filename=aa`,
          uid: -1
        }]
      }else{
        fileList = []
      }

      this.setState({fileList})
    }
  }

  loop = (data) => {
    for(let i in data){
      if(i == "newsType"){
        switch (data[i]) {
          case "0":
            data[i] = "系统通知 "
            break;
          case "1":
            data[i] = "物业通知"
            break;
          case "2":
            data[i] = "服务通知"
            break;
          case "3":
            data[i] = "活动通知"
            break;
          case "4":
            data[i] = "卡券通知"
            break;
          case "5":
            data[i] = "商城通知"
            break;
          case "6":
            data[i] = "会员通知"
            break;
        }
      }
      if(i == "pushStatus"){
        switch (data[i]) {
          case "1":
            data[i] = "未推送"
            break;
          case "2":
            data[i] = "已推送"
            break;
          case "3":
            data[i] = "推送失败"
            break;
        }
      }
      if(i == "newsType"){
        switch (data[i]) {
          case "1":
            data[i] = "消息"
            break;
          case "2":
            data[i] = "短信"
            break;
        }
      }
      if(i == "sendType"){
        switch (data[i]) {
          case 1:
            data[i] = "系统推送"
            break;
          case 0:
            data[i] = "主动推送"
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

  render() {
    const {data} = this.props;
    const { previewVisible, previewImage,fileList } = this.state;
    const content = data ? this.loop(data) : {};
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Row>
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td>消息类型</td>
                  <td colSpan='3'>
                    <span>{ content.newsType }</span>
                  </td>
                </tr>
                <tr>
                  <td>消息内容</td>
                  <td colSpan='3'>
                    <span>{ content.content }</span>
                  </td>
                </tr>
                <tr className="adImage">
                  <td>消息图片</td>
                  <td colSpan='3'>
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
                  <td>消息链接</td>
                  <td colSpan='3'>
                    <span>http://{ content.url }</span>
                  </td>
                </tr>
                <tr>
                  <td>推送数量</td>
                  <td colSpan='3'>
                    <span>{ content.pushNumber }</span>
                  </td>
                </tr>
                <tr>
                  <td>推送时间</td>
                  <td colSpan='3'>
                      { Moment(content.sendTime).format("YYYY-MM-DD HH:mm:ss") } 
                  </td>
                </tr>
                <tr>
                  <td>推送结果</td>
                  <td colSpan='3'>
                    <span> { content.pushStatus } </span>
                  </td>
                </tr>
                <tr>
                  <td>推送类型</td>
                  <td colSpan='3'>
                    <span>{ content.sendType }</span>
                  </td>
                </tr>
                <tr>
                  <td>失败推送名单</td>
                  <td colSpan='3' style={{textAlign:'left',paddingLeft:10}}>
                    <div style={{float:'left',lineHeight:2}}>{ content.pushFailurePhones }</div>
                    {/* <Button type="primary" 
                      style={{ backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff',marginRight: 10,float:'right' }}>重新推送</Button> */}
                  </td>
                </tr>

              </tbody>
            </table>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.messagePush.saveSeslect,
    data: state.messagePush.detailData,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'messagePush/detail', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
