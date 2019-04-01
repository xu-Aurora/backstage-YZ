import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message,Modal} from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
      userData: '',
      fileList: [],
      previewVisible: false,
      previewImage: "",
      roloStatus: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.detailInstitutions({ userId: userData.id, id: this.props.institutionsInfo ? this.props.institutionsInfo.id : '' });
    this.setState({roloStatus: this.props.institutionsInfo.status});
  }
  addUserSub () {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
              self.props.updateInstitutions({
                params: {
                  userId: userData.id,
                  id: this.props.institutionsDetail ? this.props.institutionsDetail.id : '',
                  status: self.state.roloStatus,
                  parentId: this.props.institutionsDetail ? this.props.institutionsDetail.parentId : '',
                  parentName: this.props.institutionsDetail ? this.props.institutionsDetail.parentName : '',
                  parentCode:  this.props.institutionsDetail ? this.props.institutionsDetail.parentCode : '',
                  ...values           
                },
                func: function(){
                  message.success('操作成功!', 1.5, function() {
                    self.props.search('editVisible')
                    
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
    const { institutionsDetail} = this.props;

    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
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
                    {getFieldDecorator('name', {
                        initialValue: institutionsDetail.name
                      })(<Input style={{width:'90%'}}  maxLength={30} placeholder="请输入机构名称" />)}
                  </td>
                  <td><span className={Style.red}>*</span>机构类型</td>
                  <td>
                    {getFieldDecorator('type', {initialValue: `${institutionsDetail.type}`})(
                      <Select  placeholder="请选择">
                        <Option value="0">平台机构</Option>
                        <Option value="1">社区物业管理</Option>
                        <Option value="2">市场物业管理</Option>
                        <Option value="3">体检中心</Option>
                      </Select>
                      )}
                  </td>
                </tr>
                <tr>
                  <td>机构状态</td>
                  <td style={{textAlign:'left',paddingLeft:15}}>
                      <Tabs  activeKey={this.state.roloStatus} onTabClick={this.tabChange.bind(this)}>
                        <TabPane  tab="启用" key="0"></TabPane>
                        <TabPane  tab="禁用" key="1"></TabPane>
                      </Tabs>
                  </td>
                  <td>上机机构</td>
                  <td>
                    <span>{institutionsDetail.parentName}</span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>联系人名称</td>
                  <td>
                    {getFieldDecorator('linkMan', {
                        initialValue: institutionsDetail.linkMan
                      })(<Input style={{width:'90%'}}  placeholder="请输入联系人名称" maxLength={5}/>)}
                  </td>
                  <td><span className={Style.red}>*</span>联系人电话</td>
                  <td>
                    {getFieldDecorator('linkPhone', {
                        initialValue: institutionsDetail.linkPhone
                      })(<Input style={{width:'90%'}}  maxLength={11}  placeholder="联系人电话" />)}
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
    institutionsInfo: state.organizationManagement.institutionsInfo,
    institutionsDetail: state.organizationManagement.institutionsDetail
  }
}
function dispatchToProps(dispatch) {
  return {
    detailInstitutions(payload = {}) {
      dispatch({
        type: 'organizationManagement/detailInstitutions',
        payload
      })
    },
    updateInstitutions(payload = {}) {
      dispatch({
        type: 'organizationManagement/updateInstitutions',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
