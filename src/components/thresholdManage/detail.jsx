import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,Modal,message} from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';

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

    this.props.instDelete({
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
        </div>
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
                        <td>
                            <span className={Style.red}>*</span>名称</td>
                        <td>
                            <span>{getFieldDecorator('thresholdName', {initialValue: content.thresholdName})(<Input disabled/>)}</span>
                        </td>
                        <td>
                            <span className={Style.red}>*</span>阀值类型</td>
                        <td>
                            <span>
                              {getFieldDecorator('thresholdType', {initialValue: `${content.thresholdType}`})(
                                  <Select style={{width:'100%'}} disabled>
                                      <Option value="0">日清</Option>
                                      <Option value="1">月清</Option>
                                  </Select>
                                )}
                              </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={Style.red}>*</span>key
                        </td>
                        <td>
                            <div>
                                {getFieldDecorator('thresholdKey', {initialValue: content.thresholdKey})(<Input disabled/>)}
                            </div>
                        </td>
                        <td>
                            <span className={Style.red}>*</span>阀值</td>
                        <td>
                            <div>
                                {getFieldDecorator('value', {initialValue: content.value})(<Input disabled/>)}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className={Style.red}></span>备注
                        </td>
                        <td colSpan='3'>
                            <div>
                                {getFieldDecorator('memo', {initialValue: content.memo})(<Input disabled/>)}
                            </div>
                        </td>
                    </tr>
                </tbody>
              </table>

            </Form>
          </Row>
        </div>

        {/* 删除消息 */}
        <Modal
            title="删除阀值"
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定删除阀值?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.thresholdManagement.details,
    argument: state.thresholdManagement.saveSeslect, //从redux中获取,获取到的是列表组件点击高亮的那个数据
    linkID: state.login.userMsg.id
  }
}
function dispatchToProps(dispatch) {
  return {
    instDelete(payload = {}) {
      dispatch({type: 'thresholdManagement/remove', payload})
    },
    queryDetails(payload = {}) {
      dispatch({type: 'thresholdManagement/details', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
