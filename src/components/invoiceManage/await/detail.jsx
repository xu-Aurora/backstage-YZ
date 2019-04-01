import React, { Component } from 'react';
import {Button,Row,Form} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';
import Moment from 'moment';

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
      id: this.props.argument.id, 
      instCode: userData.instCode,
    });
  }

  //点击关闭详情,跳转到上传发票页面
  sendShow (e) {
    this.props.closeDetail(false);
  }


  loop = (data) => {
    for(let i in data){
      if(i == "type"){
        switch (data[i]) {
          case "1":
            data[i] = "增值税普通发票 "
            break;
          case "2":
            data[i] = "增值税专用发票"
            break;
        }
      }
      if(i == "status"){
        switch (data[i]) {
          case "1":
            data[i] = "待开具"
            break;
          case "2":
            data[i] = "已开具"
            break;
          case "3":
            data[i] = "已核销"
            break;
        }
      }
      if(i == "userType"){
        switch (data[i]) {
          case "1":
            data[i] = "个人"
            break;
          case "2":
            data[i] = "单位"
            break;
        }
      }
    }
    return data;
  }

  render() {
    const {data} = this.props;
    const content = data ? this.loop(data) : {};
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.sendShow.bind(this, 'auditVisible')}>上传发票</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>发票类型</td>
                    <td>
                      { content.type }
                    </td>
                    <td>开票内容</td>
                    <td>
                      { content.content }
                    </td>
                  </tr>
                  <tr>
                    <td>开票金额</td>
                    <td>
                      { content.amountInvoice }
                    </td>
                    <td>开票对象</td>
                    <td>
                        {content.userType}                        
                    </td>
                  </tr>
                  <tr>
                    <td>开票抬头</td>
                    <td>
                      { content.title }
                    </td>
                    <td>纳税人识别号</td>
                    <td>
                      { content.tax }
                    </td>
                  </tr>
                  <tr>
                    <td>开票用户账号</td>
                    <td>
                      { content.invoiceUserAccount }
                    </td>
                    <td>开票业务单号</td>
                    <td>{ content.orderNo }</td>
                  </tr>
                  <tr>
                    <td>开票申请时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-YY-DD HH:mm:ss") }
                    </td>
                    <td>开票模式</td>
                    <td>
                      { content.invoiceMode }
                    </td>
                  </tr>
                  <tr>
                    <td>开票机构</td>
                    <td>
                      { content.invoiceInstitution }
                    </td>
                    <td>开票状态</td>
                    <td>
                      { content.status }
                    </td>
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
    argument: state.invoiceManage.saveSeslect,
    data: state.invoiceManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'invoiceManage/detail', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
