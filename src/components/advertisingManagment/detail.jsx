import React, {Component} from 'react';
import {Input,Select,Row,Col,Tabs,Form,} from 'antd';
import { connect } from 'dva'
import Style from './advertManagment/style.less';


const TabPane = Tabs.TabPane;
const Option = Select.Option;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({userData});
    // this.props.queryDatas({ userId: userData.id, page: 99999,size:99999 });
  }

  loop = (data) => {
    let newData = {};
    for(let i in data){
      if(i == 'type') {
        if(data[i] == "1"){
          data[i] = "轮播"
        }else{
          data[i] = "平铺"
        }
      }
      if(i == 'status') {
        if(data[i] == "1"){
          data[i] = "启用"
        }else{
          data[i] = "禁用"
        }
      }
      if(i == 'page'){
        if(data[i] == "1"){
          data[i] = "首页"
        }
        if(data[i] == "2"){
          data[i] = "启动项"
        }
        if(data[i] == "3"){
          data[i] = "商城"
        }
      }
      newData[i] = data[i];
    }
    return newData;
  }


  render() {
    const { detail } = this.props;
    const content = detail ? this.loop(detail) : {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {/* <Button type="primary" onClick={this.addUserSub}>保存</Button> */}
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td>广告位编号</td>
                  <td>{content.code}</td>
                  <td>广告位状态</td>
                  <td>
                      {content.status}
                  </td>
                </tr>
                <tr>
                  <td>广告位名称</td>
                  <td>
                    {content.name}
                  </td>
                  <td>所在页面</td>
                  <td>
                    {content.page}
                  </td>
                </tr>
                <tr>
                  <td>广告位类型</td>
                  <td>
                    {content.type}
                  </td>
                  <td>最大数量</td>
                  <td>
                    {content.max}
                  </td>
                </tr>
                <tr>
                  <td>广告尺寸</td>
                  <td style={{textAlign:'left'}}>
                    {content.size}
                  </td>
                  <td></td>
                  <td></td>
                </tr>

              </tbody>
            </table>
              
            </Form>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    detail: state.advertisingManagment.detail,
  }
}
function dispatchToProps(dispatch) {
  return {
    
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
