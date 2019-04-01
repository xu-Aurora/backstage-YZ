import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Col,Icon,Form,message,DatePicker,Modal} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const userData = JSON.parse(localStorage.getItem('userDetail'));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryDetails({
                id: this.props.argument.id,
                userId: userData.id
        });
    }

    //点击跳转编辑页面
    goEdit(){
      this.props.goEdit(true)
    }
    //点击删除弹出模态框
    delete () {
      this.setState({visibleShow: true});
    }
    //确定删除
    handleOk = (e) => {
        const params = this.props.argument;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const self = this;
          self.props.instDelete({
              params: {
                  id: params.id,
                  userId: userData.id,
              },
              func: function () {
                message.success('删除成功', 1.5, ()=>{
                    self.props.search('detailVisible');
                });
              }
          });

    }
    //取消删除
    handleCancel = (e) => {
      this.setState({
          visibleShow: false,
      });
    }
    

    render() {
        const {data} = this.props;
        const {index_r, input_type, tables} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
       
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
                    <Button type="primary" 
                      onClick={this.delete.bind(this)}
                      style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                  <Row>
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模板ID</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleId', {
                                              initialValue: content.moduleId || null
                                          })(<Input  disabled />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>分组名称</td>
                                  <td>
                                      <span>{getFieldDecorator('name', {
                                              initialValue: content.name || null
                                          })(<Input disabled  />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      创建时间</td>
                                  <td>
                                      <span>{getFieldDecorator('createTime', {
                                              initialValue: content.createTime ? Moment(content.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                          })(<Input disabled />)}</span> 
                                  </td>
                                  <td>
                                      创建人</td>
                                  <td>
                                      <span>{getFieldDecorator('createUserName', {
                                              initialValue: content.createUserName || null
                                          })(<Input disabled />)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      更新时间</td>
                                  <td>
                                      <span>{getFieldDecorator('updateTime', {
                                              initialValue: content.updateTime ? Moment(content.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                          })(<Input disabled />)}</span> 
                                  </td>
                                  <td>
                                      更新人</td>
                                  <td>
                                      <span>{getFieldDecorator('updateUserName', {
                                              initialValue: content.updateUserName || null
                                          })(<Input disabled />)}</span>
                                  </td>
                              </tr>    
                          </tbody>
                      </table>
                  </Row>
                </div>

                <Modal
                    title="删除"
                    visible={this.state.visibleShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <p>确定删除?</p>
                </Modal>
              
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.moduleManagement.hDetail, 
        argument: state.moduleManagement.h_data, 
        linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'moduleManagement/h_detail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'moduleManagement/h_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));