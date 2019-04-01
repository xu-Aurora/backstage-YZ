import React, { Component } from 'react';
import {Row,Form} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';


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
      writeOffCode: this.props.argument.writeOffCode, 
    });
  }


  loop = (data) => {
    for(let i in data){
      if(i == "verificationChannel"){
        switch (data[i]) {
          case "2":
            data[i] = "业务员核销"
            break;
          case "1":
            data[i] = "后台核销"
            break;
        }
      }
      if(i == "status"){
        switch (data[i]) {
          case "2":
            data[i] = "已核销"
            break;
          case "1":
            data[i] = "待核销"
            break;
          case "3":
            data[i] = "已过期"
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
              <h3 style={{marginTop:10}}>基础信息</h3>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>券编号</td>
                    <td>
                      { content.couponCode }
                    </td>
                    <td>券状态</td>
                    <td>
                      { content.status }
                    </td>
                  </tr>
                  <tr>
                    <td>券名称</td>
                    <td>
                      { content.couponName }
                    </td>
                    <td>券有效期</td>
                    <td>
                      { Moment(content.expireTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                  </tr>
                  <tr>
                    <td>发券时间</td>
                    <td>
                      { Moment(content.createTime).format("YYYY-MM-DD HH:mm:ss") }
                    </td>
                    <td>券来源</td>
                    <td>
                      { content.origin }
                    </td>
                  </tr>
                  <tr>
                    <td>领券人账号</td>
                    <td>
                      { content.userAccount }
                    </td>
                    <td>领券人名称</td>
                    <td>
                      { content.userName }
                    </td>
                  </tr>
                  <tr>
                    <td>所属机构</td>
                    <td colSpan={3}>
                      { content.institutionName }
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{display: content.status == '已核销' ? 'block' : 'none'}}>
                <h3>核销信息</h3>
                <table cellSpacing="0" className={Style.mytable}>
                  <tbody>
                    <tr>
                      <td>核销时间</td>
                      <td>
                        { Moment(content.verificationTime).format("YYYY-MM-DD HH:mm:ss") }
                      </td>
                      <td>核销渠道</td>
                      <td>
                        { content.verificationChannel }
                      </td>
                    </tr>
                    <tr>
                      <td>核销机构</td>
                      <td>
                        { content.verificationInstitutionName }
                      </td>
                      <td>核销人</td>
                      <td>
                        { content.verificationUserId }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </Row>
          </Form>
        </div>


      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.ticketDetail.saveSeslect,
    data: state.ticketDetail.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'ticketDetail/detail', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
