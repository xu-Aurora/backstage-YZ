import React, { Component } from 'react';
import {Button,Row,Col,Form,Modal,Icon,Upload} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';
import Moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: "",
      fileList1: [],
      previewVisible1: false,
      previewImage1: ""
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id, 
      instCode: userData.instCode,
    });
  }

  componentDidMount(){
    if(this.props.data){
      let fileList = [{
          status: 'done',
          name: 'xxx1.png',
          url: `/backstage/upload/download?uuid=${this.props.data.blueTicketPic}&viewFlag=1&fileType=jpg&filename=aa`,
          uid: -1
      }]
      let fileList1 = [{
        status: 'done',
        name: 'xxx2.png',
        url: `/backstage/upload/download?uuid=${this.props.data.redTicketPic}&viewFlag=1&fileType=jpg&filename=aa`,
        uid: -2
      }]
      this.setState({fileList,fileList1})
    }
  }

  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleCancel1 = () => this.setState({ previewVisible1: false });
  handlePreview1 = file => {
    this.setState({
      previewImage1: file.url || file.thumbUrl,
      previewVisible1: true
    });
  };


  loop = (data) => {
    for(let i in data){
      if(i == "type"){
        switch (data[i]) {
          case "1":
            data[i] = "增值税普通发票 "
            break;
          case "2":
            data[i] = "增值税专用发票"
            break;
        }
      }
      if(i == "status"){
        switch (data[i]) {
          case "1":
            data[i] = "待开具"
            break;
          case "2":
            data[i] = "已开具"
            break;
          case "3":
            data[i] = "已核销"
            break;
        }
      }
      if(i == "userType"){
        switch (data[i]) {
          case "1":
            data[i] = "个人"
            break;
          case "2":
            data[i] = "单位"
            break;
        }
      }
    }
    return data;
  }

  goDrawer(type){
    this.props.closeDetail(type);
  }

  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};
    const { previewVisible, previewImage,fileList,previewVisible1, previewImage1,fileList1 } = this.state;
    const uploadButton = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    const uploadButton1 = (
      <div>
        {/* <Icon type="plus" style={{fontSize: 30 }} /> */}
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              <Col style={{display: content.status == '已核销' ? 'none' : 'block'}}>
                <Button type="primary" style={{marginRight:10}} onClick={this.goDrawer.bind(this,'updateVisible')}>修改发票</Button>
                <Button type="primary" 
                  onClick={this.goDrawer.bind(this,'cancelVisible')}
                  style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>核销发票</Button>
              </Col>

              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>发票类型</td>
                    <td>
                      { content.type }
                    </td>
                    <td>开票内容</td>
                    <td>
                      { content.content }
                    </td>
                  </tr>
                  <tr>
                    <td>开票金额</td>
                    <td>
                      { content.amountInvoice }
                    </td>
                    <td>开票对象</td>
                    <td>
                        {content.userType}                        
                    </td>
                  </tr>
                  <tr>
                    <td>开票抬头</td>
                    <td>
                      { content.title }
                    </td>
                    <td>纳税人识别号</td>
                    <td>
                      { content.tax }
                    </td>
                  </tr>
                  <tr>
                    <td>开票用户账号</td>
                    <td>
                      { content.invoiceUserAccount }
                    </td>
                    <td>开票业务单号</td>
                    <td>{ content.orderNo }</td>
                  </tr>
                  <tr>
                    <td>开票申请时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-YY-DD HH:mm:ss") }
                    </td>
                    <td>开票模式</td>
                    <td>
                      { content.invoiceMode }
                    </td>
                  </tr>
                  <tr>
                    <td>开票机构</td>
                    <td>
                      { content.invoiceInstitution }
                    </td>
                    <td>开票状态</td>
                    <td>
                      { content.status }
                    </td>
                  </tr>
                  <tr>
                    <td>发票号</td>
                    <td colSpan={3}>
                      { content.blueTicket }
                    </td>
                  </tr>
                  <tr style={{display: content.status == '已核销' ? 'none' : 'table-row'}}>
                    <td>修改记录</td>
                    <td colSpan={3}>
                      { content.updateRecordList ? content.updateRecordList.map((item,index) => (
                          <p key={index}>{ item }</p>
                        )) : <p>无修改记录</p>
                      }
                    </td>
                  </tr>
                  <tr style={{display: content.status == '已核销' ? 'table-row' : 'none'}}>
                    <td>核销备注</td>
                    <td colSpan={3}>
                      { content.writeOffRecord }
                    </td>
                  </tr>
                  <tr className="adImage">
                    <td>发票图片</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                        <Col span={12}>
                          <div className="clearfix">
                            <Upload
                              action="/backstage/upload/upLoadRKey"
                              listType="picture-card"
                              fileList={fileList}
                              onPreview={this.handlePreview}
                            >
                              {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p style={{width:'80%',textAlign:'center',marginTop:10}}>蓝票</p>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          </div>
                        </Col>
                        <Col style={{display: content.status == '已核销' ? 'block' : 'none'}} span={12}>
                          <div className="clearfix">
                            <Upload
                              action="/backstage/upload/upLoadRKey"
                              listType="picture-card"
                              fileList={fileList1}
                              onPreview={this.handlePreview1}
                            >
                              {fileList1.length >= 1 ? null : uploadButton1}
                            </Upload>
                            <p style={{width:'80%',textAlign:'center',marginTop:10}}>红票</p>
                            <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
                              <img style={{ width: '100%' }} src={previewImage1} />
                            </Modal>
                          </div>
                        </Col>
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
    argument: state.invoiceManage.saveSeslect,
    data: state.invoiceManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'invoiceManage/detail', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
