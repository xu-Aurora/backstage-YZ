import React, {Component} from 'react';
import Md5 from 'js-md5';
import {Input,Select,Radio,Button,Row,Col,Tabs,Form,message} from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';

import VerifyContent from '../../util/verifyContent';
import verifyEmail from '../../util/verifyEmail';

const TabPane = Tabs.TabPane;
const Option = Select.Option;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      roloStatus: '0',
      name: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({userData});
    this.setState({
      name: this.props.treeInfo ? this.props.treeInfo.name : ''
    })
  }
  addUserSub () {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.addInstitutions({
                params: {
                  userId: userData.id,
                  status: self.state.roloStatus,
                  parentId: this.props.treeInfo ? this.props.treeInfo.id : '',
                  parentName: this.props.treeInfo ? this.props.treeInfo.name : '',
                  parentCode:  this.props.treeInfo ? this.props.treeInfo.code : '',
                  ...values           
                },
                func: function(){
                  message.success('操作成功!', 1.5, function() {
                    self.props.search('addVisible')
                    
                  });
                }
              })
          })
        }
      } 
    })
  }
  rex (item) {
    let self = this
    message.destroy();
    if(!item.name){
      message.warning('机构名称不能为空');
      return false
    }
    if(!item.type){
      message.warning('请选择机构类型');
      return false
    }

    if(!item.linkMan) {
      message.warning('联系人不能为空');
      return false
    }
    if(!item.linkPhone) { 
      message.warning('联系人电话不能为空');
      return false
    } else {
      let regPhone =  /^((0?1[34578]\d{9})|((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}))$/   //手机号码+固定电话
      if(!regPhone.test(item.linkPhone)) {
        message.warning('联系人电话格式不正确');
        return false        
      } 
    }
    return true;
  }
  tabChange (item) {
    this.setState({
      roloStatus: item
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.addUserSub.bind(this)}>保存</Button> :
              <Button type="primary">保存</Button>
            }
            
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>机构名称</td>
                  <td>
                    <span>{getFieldDecorator('name', {
                      })(<Input placeholder="请输入机构名称" maxLength={30}/>)}</span>
                  </td>
                  <td><span className={Style.red}>*</span>机构类型</td>
                  <td>
                    {getFieldDecorator('type', {})(
                      <Select placeholder="请选择">
                        <Option value="0">平台机构</Option>
                        <Option value="1">社区物业管理公司</Option>
                        <Option value="2">市场物业管理公司</Option>
                        <Option value="3">体检中心</Option>
                      </Select>
                      )}
                  </td>
                </tr>
                <tr>
                  <td>机构状态</td>
                  <td style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs defaultActiveKey="0" onTabClick={this.tabChange.bind(this)}>
                        <TabPane tab="启用" key="0"></TabPane>
                        <TabPane tab="禁用" key="1"></TabPane>
                      </Tabs>
                  </td>
                  <td>上机机构</td>
                  <td>
                    <span>
                     {this.state.name}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>联系人</td>
                  <td>
                     <span>{getFieldDecorator('linkMan', {
                      })(<Input placeholder="请输入联系人"  maxLength={5}/>)}</span>
                  </td>
                  <td><span className={Style.red}>*</span>联系人电话</td>
                  <td>
                    <span>{getFieldDecorator('linkPhone', {
                      })(<Input maxLength={11} placeholder="请输入联系人电话" />)}</span>
                  </td>
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
    treeInfo: state.organizationManagement.treeInfo,
    datas: state.userManage.datas,
    roloList: state.roloManage.data
  }
}
function dispatchToProps(dispatch) {
  return {
    queryRoloList(payload = {}) {
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
    addInstitutions(payload, params) {
      dispatch({type: 'organizationManagement/addInstitutions', payload })
    },


    bangUserRole(payload, params) {
      dispatch({ type: 'userManage/bangUserRole', payload })
    },
    queryDatas(payload, params) {
      dispatch({ type: 'userManage/queryLists', payload })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
