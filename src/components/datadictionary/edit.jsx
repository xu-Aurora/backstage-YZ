import React, {Component} from 'react';
import {Input,Button,Row,Form,Tabs} from 'antd';
import { connect } from 'dva';
import Moment from 'moment';
import Style from './style.less';

const TabPane = Tabs.TabPane;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey:"1"
    };
  }
  // componentWillMount() {
  //   const userData = JSON.parse(localStorage.getItem('userDetail'));
  //   this.props.queryDetail({
  //     userId: userData.id, 
  //     // id: this.props.argument.id
  //   });
  // }


  regx (item) {
    message.destroy();
    if(!item.code){
      message.warning('字段编码不能为空');
      return 
    }
    if(!item.name){
      message.warning('字段名称不能为空');
      return 
    }
    if(!item.parameter){
      message.warning('参数不能为空');
      return 
    }
    return true;
  }

  update = () => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      let reg = self.regx(values);
      if(reg){
        self.props.update({
          params: {
            ...values,
            id: self.props.data.id,
            userId: userData.id, 
            status: self.state.tabKey,
            instCode: userData.instCode
          },
          func: function () {
              message.success('操作成功', 1.5, ()=>{
                self.props.search('editVisible');
              });
          }
        })
      }

    })
  }




  tabKey(key){
      this.setState({
        tabKey: key
      })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const content = data ? data : '';

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
              <Button type="primary" onClick={this.update}>保存</Button>
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
                          <Input placeholder="请输入字段编码" />)}
                      </td>
                  </tr>
                  <tr>
                      <td><span className={Style.red}>*</span>字段名称</td>
                      <td colSpan={3}>
                        {getFieldDecorator('name')(
                          <Input placeholder="请输入字段名称" />)}
                      </td>
                  </tr>
                  <tr>
                      <td><span className={Style.red}>*</span>参数</td>
                      <td colSpan={3}>
                        {getFieldDecorator('parameter')(
                          <Input placeholder="请输入参数" />)}
                      </td>
                  </tr>
                  <tr style={{height:43}}>
                    <td>父节点名称</td>
                    <td></td>
                    <td>所在层级</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>字段状态</td>
                    <td colSpan={3}>
                        <Tabs activeKey={ this.state.tabKey } onTabClick={this.tabKey.bind(this)} >
                          <TabPane tab="启用" key="1"></TabPane>
                          <TabPane tab="关闭" key="2"></TabPane>
                        </Tabs>
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
            </Form>
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
    update(payload = {}) {
      dispatch({type: 'activityManagement/update', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
