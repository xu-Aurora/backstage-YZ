
import React, {Component} from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            argument: {},
            userStatus: '0',
            isEdiut: 0,
            index_r: 1,
            input_type: '',
            dataSource: []
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
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        self.setState({
            visibleShow: false,
        })
        self.props.instDelete({
            params: {
                id: self.props.argument.id,
                userId: userData.id,
            },
            func: function () {
                message.success('删除成功!', 1.5, function () {
                    self.props.search('detailVisible')
                })
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
                <div style={{width: '100%',backgroundColor: "#FFF",}}>
                  <Row>
                      <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
                      <Button type="primary" 
                        onClick={this.delete.bind(this)}
                        style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模板标识</td>
                                  <td>
                                      <span>{getFieldDecorator('templateKey', {
                                              initialValue: content.templateKey || null
                                          })(<Input disabled/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模板名称</td>
                                  <td>
                                      <span>{getFieldDecorator('templateName', {
                                              initialValue: content.templateName || null
                                          })(<Input disabled/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>获取来源</td>
                                  <td>
                                        <span>{getFieldDecorator('resourceType', {
                                              initialValue: `${content.resourceType}` || "1"
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                  <Option value="1">业务</Option>
                                                  <Option value="2">渠道</Option>
                                                  <Option value="3">资源</Option>
                                              </Select>
                                          )}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>状态</td>
                                  <td>
                                        <span>{getFieldDecorator('status', {
                                              initialValue: `${content.status}` || "1"
                                          })(
                                              <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                  <Option value="1">启用</Option>
                                                  <Option value="2">禁用</Option>
                                              </Select>
                                          )}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>描述</td>
                                  <td style={{borderRight:'1px solid #A2A2A2'}}>
                                      <span>{getFieldDecorator('describe', {
                                              initialValue: content.describe || null
                                          })(<Input disabled/>)}</span>
                                  </td>
                                  <td colSpan='2'></td>
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
        data: state.computationManagement.hDetail, 
        argument: state.computationManagement.h_data, 
        linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'computationManagement/h_detail', payload})
        },
        instDelete(payload = {}) {
            dispatch({type: 'computationManagement/h_delete', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
