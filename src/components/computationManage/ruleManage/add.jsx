import React, {Component} from 'react';
import {Input,Select,Button,Row,Col,Icon,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            argument: {},
            userStatus: '0',
            isEdiut: 0,
            dataSource: [],
            requestStatus: true
        };
        this.regx = this.regx.bind(this)
    }
    add () {
        let rex = this.regx()
        if (rex) {
            const self = this;
            const userData = JSON.parse(localStorage.getItem('userDetail'));
            this.props.form.validateFields((err, values) => {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                        this.props.instAdd({
                            params: {
                                ...values,
                                userId: this.props.linkID ? this.props.linkID : userData.id
                            },
                            func: function () {
                                message.success('添加成功!', 1.5, function() {
                                    self.props.search('addVisible')
                                });
                            }
                        })
                    })
                }

    
            })
        }
    }
    regx () {
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.templateKey) {
            message.warning('模板标识不能为空')
            return false
        }
        if (!value.quota) {
            message.warning('定额不能为空')
            return false
        }
        if (!value.intervalUpper) {
            message.warning('上限不能为空')
            return false
        }
        if (value.upperType === undefined) {
            message.warning('请选择上限类型')
            return false
        }
        if (!value.intervalFloor) {
            message.warning('下限不能为空')
            return false
        }
         if (value.floorType === undefined) {
            message.warning('请选择下限类型')
            return false
        }
        if (!value.percent) {
            message.warning('百分比不能为空')
            return false
        }
        return true
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                  <Row>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.add.bind(this)}>保存</Button> :
                        <Button type="primary">保存</Button>
                    }
                    
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模板标识</td>
                                  <td>
                                      <span>{getFieldDecorator('templateKey', {})(<Input maxLength={30} />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>定额</td>
                                  <td>
                                      <span>{getFieldDecorator('quota', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>上限</td>
                                  <td>
                                      <span>{getFieldDecorator('intervalUpper', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>上限类型</td>
                                  <td>
                                        <span>{getFieldDecorator('upperType', {})(
                                              <Select style={{width:'100%'}} placeholder="请选择">
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
                                      <span>{getFieldDecorator('intervalFloor', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>下限类型</td>
                                  <td>
                                        <span>{getFieldDecorator('floorType', {})(
                                              <Select style={{width:'100%'}} placeholder="请选择">
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
                                      <span>{getFieldDecorator('percent', {})(<Input maxLength={30}/>)}</span>
                                  </td>
                                  <td colSpan='2'></td>
                              </tr>
                          </tbody>
                      </table>
                  </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

function dispatchToProps(dispatch) {
    return {
        instAdd(payload = {}) {
            dispatch({type: 'computationManagement/p_add', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
