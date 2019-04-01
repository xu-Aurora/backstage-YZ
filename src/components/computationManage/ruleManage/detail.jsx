import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Modal} from 'antd';
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
            dataSource: [],
            visibleShow: false
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
              <div style={{width: '100%',backgroundColor: "#FFF"}}>
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
                                    <span className={Style.red}>*</span>定额</td>
                                <td>
                                    <span>{getFieldDecorator('quota', {
                                            initialValue: content.quota || null
                                        })(<Input disabled/>)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className={Style.red}>*</span>上限</td>
                                <td>
                                    <span>{getFieldDecorator('intervalUpper', {
                                            initialValue: content.intervalUpper || null
                                        })(<Input  disabled/>)}</span>
                                </td>
                                <td>
                                    <span className={Style.red}>*</span>上限类型</td>
                                <td>
                                      <span>{getFieldDecorator('upperType', {
                                            initialValue: `${content.upperType}` || null
                                        })(
                                            <Select style={{width:'100%'}} disabled>
                                                <Option value="1">包含</Option>
                                                <Option value="2">不包含</Option>
                                            </Select>
                                        )}</span>
                                </td>                               
                            </tr>
                            <tr>
                                <td>
                                    <span className={Style.red}>*</span>下限</td>
                                <td>
                                    <span>{getFieldDecorator('intervalFloor', {
                                            initialValue: content.intervalFloor || null
                                        })(<Input disabled/>)}</span>
                                </td>
                                <td>
                                    <span className={Style.red}>*</span>下限类型</td>
                                <td>
                                      <span>{getFieldDecorator('floorType', {
                                            initialValue: `${content.floorType}` || null
                                        })(
                                            <Select style={{width:'100%'}} disabled>
                                                <Option value="1">包含</Option>
                                                <Option value="2">不包含</Option>
                                            </Select>
                                        )}</span>
                                </td>                               
                            </tr>
                              <tr>
                                <td>
                                    <span className={Style.red}>*</span>百分比</td>
                                <td style={{borderRight:'1px solid #A2A2A2'}}>
                                    <span>{getFieldDecorator('percent', {
                                            initialValue: content.percent || null
                                        })(<Input disabled/>)}</span>
                                </td>
                                <td colSpan='2'></td>
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
    return {data: state.computationManagement.pDetail, argument: state.computationManagement.p_data, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'computationManagement/p_detail', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'computationManagement/p_delete', payload})
        },
        queryKey(payload = {}) {
            dispatch({type: 'paymentManage/key1', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));