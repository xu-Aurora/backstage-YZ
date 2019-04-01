import React, {Component} from 'react';
import {Input,Select,Row,Col,Icon,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import Moment from 'moment';

const Option = Select.Option;
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
        });
    }

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
        let status = '未知状态';
        if (content.apiType !== undefined){
            let value = content.apiType.slice(0,2)
            let item = content.apiType.substring(2,4)

            if (value == '00') {  //普通通道
                if (item = '00') {
                    status = '普通通道-下单'
                }
            } else if (value == '01') { //支付通道
                if (item == '01') {
                    status = '支付通道-提现'
                }
                if (item == '02') {
                    status = '支付通道-充值'
                }
                if (item == '03') {
                    status = '支付通道-冲退'
                }
                if (item == '04') {
                    status = '支付通道-退票'
                }
                if (item == '05') {
                    status = '支付通道-支付'
                }
                if (item == '06') {
                    status = '支付通道-对账'
                }
            } else if (value == '02') { //收单通道
                if (item == '01') {
                    status = '收单通道-下单'
                }
                if (item == '02') {
                    status = '收单通道-查询'
                }
                if (item == '03') {
                    status = '收单通道-关闭'
                }
                if (item == '04') {
                    status = '收单通道-撤销'
                }
                if (item == '05') {
                    status = '收单通道-退款'
                }
                if (item == '06') {
                    status = '收单通道-对账'
                }
            }
        }
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>交易金额</td>
                                    <td>
                                        <span>{getFieldDecorator('amount', {
                                                initialValue: content.amount
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>api编码</td>
                                    <td>
                                        <span>{getFieldDecorator('apiCode', {
                                                initialValue: content.apiCode
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>清算类型</td>
                                    <td>
                                        <span>{getFieldDecorator('apiType', {
                                                initialValue: status
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>前置返回业务数据</td>
                                    <td>
                                        <span>{getFieldDecorator('bizOrderNo', {
                                                initialValue: content.bizOrderNo
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>业务字段</td>
                                    <td>
                                        <span>{getFieldDecorator('bizInfo', {
                                                initialValue: content.bizInfo
                                            })(<TextArea disabled style={{height: '100px'}}/>)}</span>
                                    </td>
                                    <td>前置返回业务数据</td>
                                    <td>
                                        <span>{getFieldDecorator('bizData', {
                                                initialValue: content.bizData
                                            })(<TextArea  disabled style={{height: '100px'}}/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>业务状态</td>
                                    <td>
                                        <span>{getFieldDecorator('bizStatus', {
                                                initialValue: `${content.bizStatus}`
                                            })(
                                                <Select disabled style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="0">未知</Option>
                                                    <Option value="1">成功</Option>
                                                    <Option value="2">失败</Option>
                                                    <Option value="3">关闭</Option>
                                                    <Option value="4">处理中</Option>                                                 
                                                </Select>
                                            )}</span>
                                    </td>
                                    <td>业务状态</td>
                                    <td>
                                        <span>{getFieldDecorator('settlementStatus', {
                                                initialValue: `${content.settlementStatus}`
                                            })(
                                                <Select disabled style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="A">待处理</Option>
                                                    <Option value="I">处理中</Option>
                                                    <Option value="P">已下单</Option>
                                                    <Option value="C">撤销</Option>
                                                    <Option value="S">成功</Option>
                                                    <Option value="F">失败</Option>
                                                </Select>
                                            )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>创建时间</td>
                                    <td>
                                        <span>{getFieldDecorator('createTime', {
                                                initialValue: content.createTime ? Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") : ''
                                            })(<Input  disabled />)}</span>
                                    </td>
                                    <td>创建人</td>
                                    <td>
                                        <span>{getFieldDecorator('createUserId', {
                                                initialValue: content.createUserId || null
                                            })(<Input  disabled />)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>网关流水号</td>
                                    <td>
                                        <span>{getFieldDecorator('gatewayNo', {
                                                initialValue: content.gatewayNo
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>备注</td>
                                    <td>
                                        <span>{getFieldDecorator('memo', {
                                                initialValue: content.memo || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>支付方业务代码</td>
                                    <td>
                                        <span>{getFieldDecorator('payCode', {
                                                initialValue: content.payCode
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>手续费</td>
                                    <td>
                                        <span>{getFieldDecorator('percent', {
                                                initialValue: content.percent || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>更新时间</td>
                                    <td>
                                        <span>{getFieldDecorator('updateTime', {
                                                initialValue: content.updateTime ? Moment(content.updateTime).format("YYYY-MM-DD HH:mm:ss") : ''
                                            })(<Input  disabled />)}</span>
                                    </td>
                                    <td>更新人</td>
                                    <td>
                                        <span>{getFieldDecorator('updateUserId', {
                                                initialValue: content.updateUserId || null
                                            })(<Input  disabled />)}</span>
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
    return {data: state.gatewayWater.ItemDetail, argument: state.gatewayWater.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'gatewayWater/flowDetail', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));