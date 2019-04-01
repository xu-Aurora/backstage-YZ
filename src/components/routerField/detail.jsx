import React, {Component} from 'react';
import {Input,Select,Button,Row,Form,message,Modal} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleShow: false,
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
        const params = this.props.argument;
        let self = this
        self.props.instDelete({
            params: {
                ids: params.id,
                userId: userData.id,
            },
            func: function () {
                message.success('删除成功!', 1.5, function () {
                    self.props.search('detailVisible');
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
                    <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
                    <Button type="primary" 
                      onClick={this.delete.bind(this)}
                      style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button>
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {
                                                initialValue: content.channelCode || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段数据类型</td>
                                    <td>
                                        <span>{getFieldDecorator('dataType', {
                                                initialValue: `${content.dataType}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                  <Option value="0">数字</Option>
                                                  <Option value="1">字符串</Option>
                                                  <Option value="2">时间</Option>
                                                </Select>
                                            )}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>
                                        <span className={Style.red}>*</span>英文名</td>
                                    <td>
                                        <span>{getFieldDecorator('eName', {
                                                initialValue: content.eName || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段名</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {
                                                initialValue: content.name || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                  <tr>
                                    <td>
                                        分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {
                                                initialValue: content.score || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <span>{getFieldDecorator('strategyType', {
                                                initialValue: `${content.strategyType}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                <Option value="0">否决策略</Option>
                                                <Option value="1">选优策略</Option>
                                            </Select>
                                        )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>字段类型</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择" disabled>
                                                <Option value="0">原始</Option>
                                                <Option value="1">开发</Option>
                                                <Option value="2">订单</Option>                                                 
                                            </Select>
                                        )}</span>
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
                    <p>确定删除所选项?</p>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.routerField.details, 
        argument: state.routerField.saveSeslect, 
        linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'routerField/details', payload})
        },
        instDelete(payload = {}) {
          dispatch({type: 'routerField/remove', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));