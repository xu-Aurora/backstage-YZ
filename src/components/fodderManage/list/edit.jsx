import React, { Component } from 'react';
import {Button,Row,Form,Icon,Modal,Input,Select,message} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({  //图片详情
      userId: userData.id, 
      id: this.props.imgListId,
      instCode: userData.instCode
    });

    this.props.queryGroup1({  //分组数据请求
      userId: userData.id, 
      id: this.props.imgListId,
      instCode: userData.instCode
    });

  }


  update(){
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if(!values.name){
        message.warning('图片名称不能为空')
      }
      if(this.state.requestStatus){

        self.setState({requestStatus: false},() => {
          this.props.updateMaterial({
            params: {
              userId: userData.id,
              name: values.name,
              ossKey: self.props.data.ossKey,
              id: self.props.data.id,
              pictureGroupId: values.pictureGroupId
            },
            func: function(){
              message.success('操作成功!', 1.5, function() {
                self.props.search('editListVisible')
                
              });
            }
          })
        })
      }
    })
  }

  handleOk(){
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.delete({
        params: {
            userId: userData.id,
            ids: self.props.data.id,
            pictureGroupIds: self.props.data.pictureGroupId
        },
        func: function () {
            message.success('操作成功!', 2, function() {
                self.props.search('editListVisible')
            });
        }
    })
    this.setState({
      visibleShow: false
    })
  }

  //点击关闭页面
  handleCancel = () => {
    this.setState({
      visibleShow: false
    })
  }



  render() {
    const {data,listGroup1} = this.props;
    const { getFieldDecorator } = this.props.form;
    const content = data ? data : {};
    const listGroups = listGroup1 ? listGroup1 : [];

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={ this.update.bind(this) }>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <Button type="primary" 
                  onClick={ () => this.setState({visibleShow: true}) }
                  style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>删除</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>模板名称</td>
                    <td colSpan={3}>
                        <img src={`/backstage/upload/download?uuid=${content.ossKey}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>图片名称</td>
                    <td colSpan={3}>
                        {getFieldDecorator('name',{ initialValue: content.name })(
                          <Input placeholder="请输入图片名称" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>选择分组</td>
                    <td colSpan={3}>
                        {getFieldDecorator('pictureGroupId',{ initialValue: content.pictureGroupId })(
                            <Select placeholder="请选择分组">
                              {listGroups ? listGroups.map((item,index) => (
                                  <Option key={item.id} value={item.id}>{item.name}</Option>
                              )) : null}
                            </Select>
                        )}
                    </td>
                  </tr>

                </tbody>
              </table>
            </Row>
          </Form>
        </div>

        <Modal
            title="删除数据"
            visible={this.state.visibleShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定删除数据?</p>
        </Modal>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.fodderManage.detail,  //图片详情数据
    listGroup1: state.fodderManage.listGroup1,//分组数据
  }
}

function dispatchToProps(dispatch) {
  return {
    queryGroup1(payload = {}) {
      dispatch({type: 'fodderManage/queryGroup1', payload})
    },
    queryDetail(payload = {}) {
      dispatch({type: 'fodderManage/detailMaterial', payload})
    },
    updateMaterial(payload = {}) {
      dispatch({type: 'fodderManage/updateMaterial', payload})
    },
    delete(payload = {}) {
      dispatch({type: 'fodderManage/deleteMaterial', payload})
    }

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
