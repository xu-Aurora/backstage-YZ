import React, { Component } from 'react';
import {Table,Select,Button,Row,Tabs,Form,Upload,Modal} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from '../detail.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;


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
          case "7":
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
          case "3":
            data[i] = "处理中"
            break;
        }
      }
      if(i == "type"){
        switch (data[i]) {
          case "0":
            data[i] = "报修"
            break;
        }
      }
      if(i == "subType"){
        switch (data[i]) {
          case "00":
            data[i] = "紧急报修"
            break;
          case "01":
            data[i] = "室内报修"
            break;
          case "02":
            data[i] = "公共报修"
            break;
          case "03":
            data[i] = "公共卫生"
            break;
          case "04":
            data[i] = "小区绿化"
            break;
          case "04":
            data[i] = "小区安全"
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
      if(i == "acceptType"){
        switch (data[i]) {
          case "0":
            data[i] = "客户报事"
            break;
          case "1":
            data[i] = "内部报事"
            break;
        }
      }
      if(i == "level"){
        switch (data[i]) {
          case "0":
            data[i] = "紧急"
            break;
          case "1":
            data[i] = "正常"
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
 

  goDrawer(type){
    this.props.closeDetail(type);
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
            <Row>
              <Button type="primary" 
                  style={{display: content.status == '待处理' ? 'inline-block' : 'none'}} 
                  onClick={this.goDrawer.bind(this,'sendVisible')}>派单</Button>
              <Button type="primary" 
                  style={{display: content.status == '处理中' ? 'inline-block' : 'none'}} 
                  onClick={this.goDrawer.bind(this,'finishVisible')}>结单</Button>
              <Button type="danger" 
                  onClick={this.goDrawer.bind(this,'closeVisible')}
                  style={{backgroundColor:'#EB000E',borderColor:'#EB000E',color:'#ffffff'}}>关闭</Button>
              <h3 style={{marginTop:10}}>客户信息</h3>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>订单编号</td>
                    <td>
                      { content.orderNo }
                    </td>
                    <td>客户姓名</td>
                    <td>
                      { content.userName }
                    </td>
                  </tr>
                  <tr>
                    <td>客户电话</td>
                    <td>
                      { content.userPhone }
                    </td>
                    <td>客户类型</td>
                    <td>
                      { content.userType }
                    </td>
                  </tr>
                  <tr>
                    <td>申请小区</td>
                    <td>
                      { content.areaDetail }
                    </td>
                    <td>申请户号</td>
                    <td>
                      { content.addressName }
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3>事件信息</h3>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>报事类型</td>
                    <td>
                      { content.type }
                    </td>
                    <td>子类型</td>
                    <td>
                      { content.subType }
                    </td>
                  </tr>
                  <tr>
                    <td>报事时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                    <td>受理类型</td>
                    <td>
                      暂时未定,以后再改
                      {/* { content.acceptType } */}
                    </td>
                  </tr>
                  <tr>
                    <td>期望上门时间</td>
                    <td>
                      { content.reservationTime }
                    </td>
                    <td>报事级别</td>
                    <td>
                      { content.level }
                    </td>
                  </tr>
                  <tr>
                    <td>报事来源</td>
                    <td>
                      { content.source }
                    </td>
                    <td>订单状态</td>
                    <td>
                      { content.status }
                    </td>
                  </tr>
                  <tr>
                    <td>申请备注</td>
                    <td colSpan='3'>
                      { content.content }
                    </td>
                  </tr>
                  <tr className="adImage">
                    <td>申请附件</td>
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
                      { content. }
                    </td>
                  </tr> */}
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
    argument: state.affairManage.saveSeslect,
    data: state.affairManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'affairManage/detail', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
