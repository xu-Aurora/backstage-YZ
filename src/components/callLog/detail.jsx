import React, {Component} from 'react';
import {Input,Row,Col,Icon,Form,message} from 'antd';
import {connect} from 'dva';
import Style from './style.less';
import Moment from 'moment';

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
                logId: this.props.argument.logid,
                userId: userData.id
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
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>流水号</td>
                                    <td>
                                        <span>{getFieldDecorator('flowNo', {
                                                initialValue: content.flowNo || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>日志编号</td>
                                    <td>
                                        <span>{getFieldDecorator('logid', {
                                                initialValue: content.logid || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>                         
                                <tr>
                                    <td>请求报文内容</td>
                                    <td>
                                        <span>{getFieldDecorator('request', {
                                                initialValue: content.request || null
                                            })(<TextArea disabled style={{height: '100px'}}/>)}</span>
                                    </td>
                                    <td>响应报文内容</td>
                                    <td>
                                        <span>{getFieldDecorator('response', {
                                                initialValue: content.response || null
                                            })(<TextArea  disabled style={{height: '100px'}}/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>交易响应代码</td>
                                    <td>
                                        <span>{getFieldDecorator('rtncode', {
                                                initialValue: content.rtncode
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>交易响应信息</td>
                                    <td>
                                        <span>{getFieldDecorator('rtnmsg', {
                                                initialValue: content.rtnmsg || null
                                            })(<Input disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>接口发送开始时间</td>
                                    <td>
                                        <span>{getFieldDecorator('sendendtime', {
                                                initialValue: content.sendendtime ? Moment(content.sendendtime).format("YYYY-MM-DD HH:mm:ss") : ''
                                            })(<Input  disabled />)}</span>
                                    </td>
                                    <td>接口发送结束时间</td>
                                    <td>
                                        <span>{getFieldDecorator('sendstarttime', {
                                                initialValue: content.sendstarttime ? Moment(content.sendstarttime).format("YYYY-MM-DD HH:mm:ss") : ''
                                            })(<Input disabled />)}</span>
                                    </td>
                                </tr>                                   
                                <tr>
                                    <td>交易通道api</td>
                                    <td>
                                        <span>{getFieldDecorator('transchannel', {
                                                initialValue: content.transchannel
                                            })(<Input disabled/>)}</span>
                                    </td>
                                    <td>交易名称</td>
                                    <td>
                                        <span>{getFieldDecorator('transcode', {
                                                initialValue: content.transcode || null
                                            })(<Input  disabled/>)}</span>
                                    </td>
                                </tr>
                                <tr>                                      
                                    <td>接口关键字</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <span>{getFieldDecorator('transkeyword', {
                                                initialValue: content.transkeyword || null
                                            })(<Input disabled/>)}</span>
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
    return {data: state.callLog.ItemDetail, argument: state.callLog.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'callLog/transactionDetail', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));