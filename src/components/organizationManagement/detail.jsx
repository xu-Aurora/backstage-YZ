import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message,Modal} from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';
import Moment from 'moment';


const TabPane = Tabs.TabPane;
const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      userData: '',
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.detailInstitutions({ userId: userData.id, id: this.props.institutionsInfo ? this.props.institutionsInfo.id : '' });
  }

  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }

  //点击删除弹出模态框
  delete () {
    this.setState({visibleShow: true});
  }
  //确定删除
  handleOk () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.props.userUpdate({
        params: {
          id: params.id,
          userId: userData.id
        },
        func: function () {
          Modal.success({title: '', content: '删除机构成功!'});
        }
      })
      this.setState({
        visibleShow: false,
      });

  }
  //取消删除
  handleCancel = (e) => {
    this.setState({
        visibleShow: false,
    });
  }

  render() {
    const { institutionsDetail} = this.props;

    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
            {/* <Button type="primary" 
              onClick={this.delete.bind(this)}
              style={{backgroundColor:'red',color:'#FFF',marginLeft:15,borderColor:'red'}}>删除</Button> */}
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>机构名称</td>
                  <td>
                    {getFieldDecorator('name', {
                        initialValue: institutionsDetail.name
                      })(<Input style={{width:'90%'}}  placeholder="请输入机构名称" disabled/>)}
                  </td>
                  <td><span className={Style.red}>*</span>机构类型</td>
                  <td>
                    {getFieldDecorator('type', {initialValue: `${institutionsDetail.type}`})(
                      <Select disabled placeholder="请选择">
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
                      <Tabs  activeKey={institutionsDetail.status}>
                        <TabPane disabled tab="启用" key="0"></TabPane>
                        <TabPane disabled tab="禁用" key="1"></TabPane>
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
                      })(<Input style={{width:'90%'}}  placeholder="请输入联系人名称" disabled/>)}
                  </td>
                  <td><span className={Style.red}>*</span>联系人电话</td>
                  <td>
                    {getFieldDecorator('linkPhone', {
                        initialValue: institutionsDetail.linkPhone
                      })(<Input style={{width:'90%'}}  placeholder="联系人电话" disabled/>)}
                  </td>
                </tr>
                <tr>
                  <td>创建时间</td>
                  <td colSpan={3}>
                     <span>{institutionsDetail.createTime ? Moment(institutionsDetail.createTime).format("YYYY-MM-DD HH:mm:ss"): ''}</span>
                  </td>
                  {/* <td>创建人</td>
                  <td>
                    <span>{institutionsDetail.createUserId}</span>
                  </td> */}
                </tr>
              </tbody>
            </table>

            </Form>
          </Row>
        </div>

        {/* 删除机构提示框 */}
        <Modal
            title="删除机构"
            visible={this.state.visibleShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定删除机构?</p>
        </Modal>
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
    deleteInstitutions(payload = {}) {
      dispatch({
        type: 'organizationManagement/detailInstitutions',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
