import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Col,Icon,Form,message } from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
        };
    }

    update = () => {
        const self = this;
        this.props.form.validateFields((err, values) => {
            let rex = this.regx(values);
            if(rex){
                if(this.state.requestStatus){
                    self.setState({requestStatus:false},() => {
                        this.props.update({
                            params: {
                                id: this.props.argument.id,
                                userId: userData.id,
                                ...values
                            },
                            func: function () {
                                message.success('更新成功!', 1.5, function () {
                                    self.props.search('editVisible');
                                });
            
                            }
                        })
                    })
                }
            }

        })

    }

    regx(item) {
        //正则匹配只能输入英文
        var regName =/^[a-zA-Z]+$/;
        message.destroy();
        if(!item.dataType){
            message.warning('字段数据类型不能为空');
            return;
        }else if(!item.eName){
            message.warning('英文名不能为空');
            return;
        }else if(!regName .test(item.eName)){
            message.warning('英文名只能输入英文');
            return;
        }else if(!item.name){
            message.warning('字段名不能为空');
            return;
        }else if(!item.strategyType){
            message.warning('策略类型不能为空');
            return;
        }else if(!item.type){
            message.warning('字段类型不能为空');
            return;
        }else{
            return true;
        }
    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryDetails({
            id: this.props.argument.id,
            userId: userData.id
        });

    }

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
       
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.update}>保存</Button> :
                        <Button type="primary">保存</Button>
                    }
                    
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {
                                                initialValue: content.channelCode || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段数据类型</td>
                                    <td>
                                        <span>{getFieldDecorator('dataType', {
                                                initialValue: `${content.dataType}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择" disabled={this.state.isEdiut == 0 ? true : false}>
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
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>字段名</td>
                                    <td>
                                        <span>{getFieldDecorator('name', {
                                                initialValue: content.name || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        分值</td>
                                    <td>
                                        <span>{getFieldDecorator('score', {
                                                initialValue: content.score || null
                                            })(<Input  disabled={this.state.isEdiut == 0 ? true : false}/>)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>策略类型</td>
                                    <td>
                                        <span>{getFieldDecorator('strategyType', {
                                                initialValue: `${content.strategyType}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择" disabled={this.state.isEdiut == 0 ? true : false}>
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
                                            <Select style={{width:'100%'}} placeholder="请选择" disabled={this.state.isEdiut == 0 ? true : false}>
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
              
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {data: state.routerField.details, argument: state.routerField.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'routerField/details', payload})
        },
        update(payload = {}) {
            dispatch({type: 'routerField/update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));