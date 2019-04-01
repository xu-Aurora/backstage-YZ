import React, {Component} from 'react';
import {Button,Row,Form,Input} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './style.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // componentWillMount() {
  //   const userData = JSON.parse(localStorage.getItem('userDetail'));
  //   this.props.queryDetail({
  //     userId: userData.id, 
  //     id: this.props.argument.id
  //   });

  // }

  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }

  render() {
    const { data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const content = data ? data : '';

    return (
      <div className={Style.userBox}>
        <div style={{ width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr style={{visibility:'hidden'}}>
                    <td  style={{width:'18%'}}></td><td></td>
                    <td  style={{width:'18%'}}></td><td></td>
                  </tr>
                  <tr>
                      <td><span className={Style.red}>*</span>字段编码</td>
                      <td colSpan={3}>
                        {getFieldDecorator('code')(
                          <Input disabled placeholder="请输入字段编码" />)}
                      </td>
                  </tr>
                  <tr>
                      <td><span className={Style.red}>*</span>字段名称</td>
                      <td colSpan={3}>
                        {getFieldDecorator('name')(
                          <Input disabled placeholder="请输入字段名称" />)}
                      </td>
                  </tr>
                  <tr>
                      <td><span className={Style.red}>*</span>参数</td>
                      <td colSpan={3}>
                        {getFieldDecorator('parameter')(
                          <Input disabled placeholder="请输入参数" />)}
                      </td>
                  </tr>
                  <tr style={{height:43}}>
                    <td>父节点名称</td>
                    <td></td>
                    <td>所在层级</td>
                    <td></td>
                  </tr>
                  <tr style={{height:43}}>
                    <td><span className={Style.red}>*</span>字段状态</td>
                    <td colSpan={3}>
                        启用
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellSpacing="0" style={{marginTop:30}} className={Style.mytable}>
                  <tbody>
                    <tr style={{height:43}}>
                      <td>编辑人</td>
                      <td></td>
                      <td>编辑时间</td>
                      <td></td>
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
  return {
    argument: state.activityManagement.saveSeslect, 
    data: state.activityManagement.detail, 
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'activityManagement/detail', payload})
    },
    queryArea(payload, params) {
      dispatch({
        type: 'advertisingManagment/area',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
