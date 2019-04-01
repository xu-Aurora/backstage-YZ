import React, { Component } from 'react';
import {Button,Row,Form,Input,message,Upload,Modal,Icon} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      fileList: [],
      previewVisible: false,
      previewImage: "",
    };
  }


  audit(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
        if(!values.blueTicket){
          message.warning('发票编号不能为空');
          return false;
        }
        if(!this.state.fileList.length){
          message.warning('蓝票图片不能为空');
          return false;
        }
        if(this.state.requestStatus){
          this.setState({requestStatus: false},() =>{
            this.props.uploading({
              params: {
                ...values,
                userId: userData.id,
                blueTicketPic: this.state.fileList[0].response,
                id: this.props.argument.id,
                orderNo: this.props.argument.orderNo,
                instCode: userData.instCode,
                operationType: '1'
              },
              func: function () {
                message.success('操作成功', 1.5, ()=>{
                  self.props.search('auditVisible');
                  
                });
              }
            })
          })

        }

    })
  }


  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange(info) {
    if(info.file.status == 'removed') {
      this.setState({
        fileList: info.fileList,
      });
    } else {
      let rex = this.checkImg(info.file)
      if(rex) {
        this.setState({
          fileList: info.fileList
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
    const uploadButton = (
      <Icon type="plus" style={{fontSize: 30 }} />
  );
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              {
                  this.state.requestStatus ? <Button type="primary" onClick={this.audit.bind(this)}>保存</Button> :
                  <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>发票编号</td>
                    <td colSpan={3}>
                      {getFieldDecorator('blueTicket', {})(
                        <Input placeholder="输入发票编号"  />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>蓝票图片</td>
                    <td colSpan={3}>
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
    argument: state.invoiceManage.saveSeslect,
  }
}

function dispatchToProps(dispatch) {
  return {
    uploading(payload,params) {  //上传发票
      dispatch({type: 'invoiceManage/update', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
