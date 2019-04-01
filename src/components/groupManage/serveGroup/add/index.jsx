import React, { Component } from 'react';
import {Button,Row,Form,Upload,Icon,Modal,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
      fileList: [],
      pic: ''
    };
  }


  //上传图片
  handleCancel = () => this.setState({ previewVisible: false });

  handleChange(info) {
    if(info.file.status == 'uploading') {
      this.setState({
        fileList: info.fileList,
        pic: []
      })
    } else if (info.file.status == 'done') {
      this.setState({
        fileList: info.fileList,
        pic: info.file.response
      })
    } else if (info.file.status === 'error') {
      message.error(`上传失败`);
      this.setState({
        fileList: [],
        pic: ''
      })
    } else {
      this.setState({
        fileList: [],
        pic: ''
      })
    }
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  checkImg = (file, fileList) => {
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

  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() =>{
              self.props.addGroup({
                params: {
                  name: values.name,
                  pic: self.state.pic,
                  userId: userData.id,
                  businessType: '2'
                },
                  func: function(){
                  message.success('添加成功!', 1.5, function() {self.props.search('addVisible')});
                }
              })
          })
        }
      } 

    })
  }
  rex (item) {
    if(!item.name){
      message.warning('分组名称不能为空');
      return false
    }
    if(!this.state.fileList.length){
      message.warning('请上传图片');
      return false
    }
    return true;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage,fileList} = this.state;
    const uploadButton = (
      <Icon type="plus" style={{fontSize: 30 }} />
    );
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.save.bind(this)}>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>分组名称</td>
                    <td colSpan={3}>
                        {getFieldDecorator('name')(
                          <Input maxLength={6} placeholder="请输入分组名称" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>上传图片</td>
                    <td colSpan={3} style={{paddingLeft:20,paddingTop:12}}>
                        <div className="clearfix">
                          <Upload
                            action="/backstage/upload/upLoadRKey"
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={this.checkImg}
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
  }
}

function dispatchToProps(dispatch) {
  return {
    addGroup(payload = {}) {
      dispatch({type: 'groupManage/addGroup', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
