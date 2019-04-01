import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,Modal,message} from 'antd';
import { connect } from 'dva'
import Style from '../style.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      userData: '',
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetails({
        id: this.props.argument.id,
        userId: userData.id
    })
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

    this.props.remove({
        params: {
            id: params.id,
            userId: userData.id
        },
        func: function () {
            message.success('删除成功', 1.5, ()=>{
              self.props.search('detailVisible');
            });
        }
    })
  }
  //取消删除
  handleCancel = (e) => {
    this.setState({
        visibleShow: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data} = this.props;
    const content = data || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <Button type="primary" 
                onClick={this.delete.bind(this)}
                style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>标题</td>
                    <td>
                      <span>{getFieldDecorator('title', {
                          initialValue: content.title
                        })(<Input placeholder="请输入标题" disabled/>)}</span>
                    </td>
                    <td><span className={Style.red}>*</span>消息分类</td>
                    <td>
                      {getFieldDecorator('types', {initialValue: content.types})(
                        <Select placeholder="请选择" disabled>
                          <Option value="0">app消息</Option>
                          <Option value="1">站内信</Option>
                          <Option value="2">短信</Option>
                          <Option value="3">邮件</Option>
                          <Option value="4">公众号</Option>
                          <Option value="5">商户</Option>
                        </Select>
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>消息类型</td>
                    <td>
                      {getFieldDecorator('newsType', {initialValue: content.newsType})(
                        <Select placeholder="请选择" disabled>
                          <Option value="0">系统通知</Option>
                          <Option value="1">信贷通知</Option>
                          <Option value="2">还款通知</Option>
                          <Option value="3">活动通知</Option>
                          <Option value="4">卡券通知</Option>
                          <Option value="5">短信</Option>
                        </Select>
                        )}
                    </td>
                    <td><span className={Style.red}>*</span>发送目标邮箱</td>
                    <td>
                      <span>
                        {getFieldDecorator('toEmail', {initialValue: content.toEmail})(
                          <Input placeholder="请输入目标邮箱" disabled/>
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>发送目标手机号</td>
                    <td>
                      <span>{getFieldDecorator('toPhone', {initialValue: content.toPhone})(
                        <Input placeholder="请输入目标手机号" disabled/>)}</span>
                    </td>
                    <td><span className={Style.red}>*</span>接收者用户号</td>
                    <td>
                      <span>{getFieldDecorator('toUserId', {initialValue: content.toUserId})(
                        <Input placeholder="请输入接收者用户号" disabled/>)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>终端</td>
                    <td>
                      {getFieldDecorator('terminal', {initialValue: content.terminal})(
                        <Select placeholder="请选择" disabled>
                          <Option value="0">光伏贷</Option>
                          <Option value="1">壹税通</Option>
                        </Select>
                        )}
                    </td>
                    <td>内容</td>
                    <td>
                      <span>
                        {getFieldDecorator('content', {initialValue: content.content})(
                          <Input placeholder="请输入内容" disabled/>
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              </Form>
          </Row>
        </div>

        {/* 删除消息 */}
        <Modal
            title="删除消息"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定删除消息?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.message.details,
    argument: state.message.newsData, //从redux中获取,获取到的是列表组件点击高亮的那个数据
    linkID: state.login.userMsg.id
  }
}
function dispatchToProps(dispatch) {
  return {
    queryDetails(payload = {}) {
      dispatch({type: 'message/details', payload})
    },
    remove(payload = {}) {
      dispatch({type: 'message/newsDelete', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
