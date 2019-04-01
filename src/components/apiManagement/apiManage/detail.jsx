import React, {Component} from 'react';
import {Input,Radio,Button,Row,Modal,Form,message} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const RadioGroup = Radio.Group;
const userData = JSON.parse(localStorage.getItem('userDetail'));
const { TextArea } = Input;


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
        const {getFieldDecorator} = this.props.form;
        const content = data || {};


        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
                    <Button type="primary" onClick={this.delete.bind(this)}
                        style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>API名称</td>
                                    <td>
                                        <span>{getFieldDecorator('apiName', {
                                                initialValue: content.apiName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>API中文名称</td>
                                    <td>
                                        <span>{getFieldDecorator('apiRemark', {
                                                initialValue: content.apiRemark || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>登录授权类型</td>
                                    <td>
                                        <span>{getFieldDecorator('authorizeType', {
                                                initialValue: `${content.authorizeType}` || "0"
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">无需</Radio>
                                                    <Radio value="1">需要</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>分组Id</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('groupId', {
                                                initialValue: content.groupId || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>模块ID</td>
                                    <td>
                                        <span>{getFieldDecorator('moduleId', {
                                                initialValue: content.moduleId || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>模块名称</td>
                                    <td>
                                        <span>{getFieldDecorator('moduleName', {
                                                initialValue: content.moduleName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>服务名</td>
                                    <td>
                                        <span>{getFieldDecorator('serviceName', {
                                                initialValue: content.serviceName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>服务路径</td>
                                    <td>
                                        <span>{getFieldDecorator('servicePath', {
                                                initialValue: content.servicePath || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>API描述</td>
                                    <td>
                                        <span>{getFieldDecorator('apiMemo', {
                                                initialValue: content.apiMemo || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <span>{getFieldDecorator('status', {
                                                initialValue: `${content.status}` || "0"
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">正常</Radio>
                                                    <Radio value="1">禁用</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        读取数据超时时间</td>
                                    <td>
                                        <span>{getFieldDecorator('soTimeout', {
                                                initialValue: content.soTimeout || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        连接超时时间</td>
                                    <td>
                                        <span>{getFieldDecorator('connectionTimeout', {
                                                initialValue: content.connectionTimeout || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        创建时间</td>
                                    <td>
                                        <span>{getFieldDecorator('createTime', {
                                                initialValue: content.createTime ? Moment(content.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        创建人</td>
                                    <td>
                                        <span>{getFieldDecorator('createUserName', {
                                                initialValue: content.createUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        商户所有权认证</td>
                                    <td>
                                        <span>{getFieldDecorator('merchantAuthorizeType', {
                                                initialValue: `${content.merchantAuthorizeType}` || null
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">无需</Radio>
                                                    <Radio value="1">需要</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                    <td>
                                        是否需要参数校验</td>
                                    <td>
                                        <span>{getFieldDecorator('parameterAuthorizeType', {
                                                initialValue: `${content.parameterAuthorizeType}` || null
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">无需</Radio>
                                                    <Radio value="1">需要</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        所属项目</td>
                                    <td>
                                        <span>{getFieldDecorator('projectName', {
                                                initialValue: content.projectName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        请求json</td>
                                    <td>
                                        <span>{getFieldDecorator('requestJson', {
                                                initialValue: content.requestJson || null
                                            })(<TextArea disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        请求json例子</td>
                                    <td>
                                        <span>{getFieldDecorator('requestJsonDemo', {
                                                initialValue: content.requestJsonDemo || null
                                            })(<TextArea disabled/>)}</span>
                                    </td>
                                    <td>
                                        响应json</td>
                                    <td>
                                        <span>{getFieldDecorator('responseJson', {
                                                initialValue: content.responseJson || null
                                            })(<TextArea disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        响应json例子</td>
                                    <td>
                                        <span>{getFieldDecorator('responseJsonDemo', {
                                                initialValue: content.responseJsonDemo || null
                                            })(<TextArea disabled/>)}</span>
                                    </td>
                                    <td>
                                        是否对结果进行转译</td>
                                    <td>
                                        <span>{getFieldDecorator('returnCodeTranslate', {
                                                initialValue: `${content.returnCodeTranslate}` || null
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">转译</Radio>
                                                    <Radio value="1">不转译</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        更新人</td>
                                    <td>
                                        <span>{getFieldDecorator('updateUserName', {
                                                initialValue: content.updateUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        更新时间</td>
                                    <td>
                                        <span>{getFieldDecorator('updateTime', {
                                                initialValue: content.updateTime ? Moment(content.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Row>
                </div>
              {/* 删除消息 */}
              <Modal
                  title="删除"
                  visible={this.state.visibleShow}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  >
                  <p style={{fontSize:16}}>确定删除?</p>
              </Modal>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {data: state.apiManagement.pDetail, argument: state.apiManagement.p_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'apiManagement/p_detail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'apiManagement/p_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
