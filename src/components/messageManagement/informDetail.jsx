import React, { Component } from 'react';
import {Row,Form} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './style.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      id: this.props.argument.id 
    });
  }

  loop(data){
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "0":
            data[i] = "发送中"
            break;
          case "1":
            data[i] = "推送成功"
            break;
          case "2":
            data[i] = "推送失败"
            break;
        }
      }
      if(i == "sendType"){
        switch (data[i]) {
          case "1":
            data[i] = "主动发送"
            break;
          case "2":
            data[i] = "系统发送"
            break;
        }
      }
      if(i == "sendTime"){
        data[i] = Moment(data[i]).format("YYYY-MM-DD HH:mm:ss")
      }
    }
    return data;
  }

  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>短信内容</td>
                    <td>
                      <span>{ content.contents }</span>
                    </td>
                  </tr>
                  <tr>
                    <td>推送时间</td>
                    <td>{ content.sendTime }</td>
                  </tr>
                  <tr>
                    <td>推送结果</td>
                    <td>{ content.status }</td>
                  </tr>
                  <tr>
                    <td>推送类型</td>
                    <td>{ content.sendType }</td>
                  </tr>
                </tbody>
              </table>
          </Row>

            </Form>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.messageManage.saveSeslect,
    data: state.messageManage.smsDetail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'messageManage/smsDetail', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));

