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
      id: this.props.argument.id 
    });
  }

  componentDidMount(){
    if(this.props.data){
      let fileList;
      if(this.props.data.osskeys){
        fileList = [{
          status: 'done',
          name: 'xxx1.png',
          url: `/backstage/upload/download?uuid=${this.props.data.osskeys}&viewFlag=1&fileType=jpg&filename=aa`,
          uid: -1
        }]
      }else{
        fileList = []
      }

      this.setState({fileList})
    }
  }

  loop(data){
    for(let i in data){
      if(i == "newsType"){
        switch (data[i]) {
          case "0":
            data[i] = "系统通知"
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
      if(i == "sendType"){
        switch (data[i]) {
          case "1":
            data[i] = "主动发送"
            break;
          case "2":
            data[i] = "系统发送"
            break;
        }
      }
      if(i == "createTime"){
        data[i] = Moment(data[i]).format("YYYY-MM-DD HH:mm:ss")
      }
    }
    return data;
  }

    handleCancel = () => this.setState({ previewVisible: false });
    handleChange = ({ fileList }) => this.setState({ fileList });
    handlePreview = file => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
      });
    };


  render() {
    const { previewVisible, previewImage,fileList } = this.state;
    const {data} = this.props;
    const content = data ? this.loop(data) : {};
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>消息内容</td>
                    <td>
                      <span>{ content.content }</span>
                    </td>
                  </tr>
                  <tr>
                    <td>消息图片</td>
                    <td>
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
                    <td>
                      <span>http://{ content.url }</span>
                    </td>
                  </tr>
                  <tr>
                    <td>推送时间</td>
                    <td>{ content.createTime }</td>
                  </tr>
                  <tr>
                    <td>消息类型</td>
                    <td>{ content.newsType }</td>
                  </tr>
                  <tr>
                    <td>推送类型</td>
                    <td>{ content.sendType }</td>
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
    argument: state.messageManage.saveSeslect,
    data: state.messageManage.msgDetail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'messageManage/msgDetail', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));

