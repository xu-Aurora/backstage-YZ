import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const RadioGroup = Radio.Group;
const Option = Select.Option;
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
                                        <span className={Style.red}>*</span>接口id</td>
                                    <td>
                                        <span>{getFieldDecorator('itfcId', {
                                                initialValue: content.itfcId || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>参数</td>
                                    <td>
                                        <span>{getFieldDecorator('param', {
                                                initialValue: content.param || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>参数名称</td>
                                    <td>
                                        <div>
                                            {getFieldDecorator('paramName', {
                                                initialValue: content.paramName || null
                                            })(<Input disabled/>)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>请求参数类型</td>
                                    <td>
                                        <div>
                                            <span>{getFieldDecorator('paramType', {
                                                initialValue: `${content.paramType}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                    <Option value="0">请求参数</Option>
                                                    <Option value="1">返回参数</Option>
                                                    <Option value="2">默认请求参数</Option>
                                                    <Option value="3">默认返回参数</Option>
                                                </Select>
                                            )}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>数据类型</td>
                                    <td>
                                        <div>
                                            <span>{getFieldDecorator('dataType', {
                                                initialValue: `${content.dataType}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                    <Option value="0">varchar</Option>
                                                    <Option value="1">int</Option>
                                                    <Option value="2">date</Option>
                                                    <Option value="3">object</Option>
                                                </Select>
                                            )}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>是否启用</td>
                                    <td>
                                        <span>{getFieldDecorator('isEnable', {
                                                initialValue:`${content.isEnable}` || null
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">启用</Radio>
                                                    <Radio value="1">禁用</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>是否为空</td>
                                    <td>
                                        <span>{getFieldDecorator('isnull', {
                                                initialValue: `${content.isnull}` || null
                                            })(
                                                <RadioGroup disabled>
                                                    <Radio value="0">可以</Radio>
                                                    <Radio value="1">不可以</Radio>
                                                </RadioGroup>
                                            )}</span>
                                    </td>
                                    <td>默认参数值</td>
                                    <td>
                                        <span>{getFieldDecorator('dataValue', {
                                                initialValue: content.dataValue || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                      <td>长度</td>
                                    <td>
                                        <span>{getFieldDecorator('length', {
                                                initialValue: content.length || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                      <td>备注</td>
                                    <td>
                                        <span>{getFieldDecorator('remark', {
                                                initialValue: content.remark || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>创建时间</td>
                                    <td>
                                        <span>{getFieldDecorator('createTime', {
                                                initialValue: content.createTime ? Moment(content.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>创建人</td>
                                    <td>
                                        <span>{getFieldDecorator('createUserName', {
                                                initialValue: content.createUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>更新人</td>
                                    <td>
                                        <span>{getFieldDecorator('updateUserName', {
                                                initialValue: content.updateUserName || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>更新时间</td>
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
    return {data: state.apiManagement.hDetail, argument: state.apiManagement.h_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'apiManagement/h_detail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'apiManagement/h_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
