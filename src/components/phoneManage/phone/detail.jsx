import React, {Component} from 'react';
import {Input,Select,Button,Row,Cascader,Tabs,Form,message,Icon,Modal,Col} from 'antd';
import { connect } from 'dva'
import Style from '../addStyle.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const InputGroup = Input.Group;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneType: '1',
      status: '1',
      phoneInfo: {},
      phone: '',
      areaCode: '',
      areaNum: '',
      delvisibleShow: false,
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.props.detailPhone({
      params:{userId: userData.id, id: self.props.info.id},
      func: function() {
        if(self.props.phoneInfo.phoneType == 1) {
          self.setState({
            phone:  self.props.phoneInfo.phone
          })
        } else if(self.props.phoneInfo.phoneType == 2) {
          self.setState({
            areaCode:  self.props.phoneInfo.phone.split('-')[0],
            areaNum:  self.props.phoneInfo.phone.split('-')[1]
          })
        }
        self.setState({
          phoneInfo: self.props.phoneInfo,
          phoneType: self.props.phoneInfo.phoneType,
          status: self.props.phoneInfo.status
        })
      }
    })
  }
  componentWillReceiveProps(nextProps) {
  }
  addUserSub() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values)
      if (rex) {
        self.props.addPhone({
          params: { 
            userId: userData.id,
            name: values.name,
            type: values.type,
            phoneType: self.state.phoneType,
            phone: self.state.phoneType == '1' ?  values.phone : `${values.areaCode}-${values.areaNum}`,
            seq: values.seq,
            status: self.state.status,
            comId: self.props.communityRight.id,
            comName: self.props.communityRight.name
          },
          func: function(){
            // message.success('操作成功!', 1.5, function() {self.props.search('addVisible')});
          }
        })
      } 
    })
  }
  rex (item) {
    let self = this
    message.destroy();
    if(!item.name){
      message.warning('名称不能为空');
      return false
    }
    if(!item.type){
      message.warning('请选择分类');
      return false
    }
    if(self.state.phoneType == '1') {
      if(!item.phone) {
        message.warning('手机号码不能为空');
        return false
      }
    } else {
      if(!item.areaCode) {
        message.warning('区号不能为空');
        return false
      }
      if(!item.areaNum) {
        message.warning('座机号码不能为空');
        return false
      }
    }
    if(!item.seq) {
      message.warning('排序不能为空');
      return false
    }
    return true;
  }
  tabChange (params, item) {
    if(params == 'phoneType') {
      if(item == '1') {
        this.setState({
          areaCode: '',
          areaNum: ''
        })
      } else {
        this.setState({
          phone: ''
        })
      }
    }
    this.setState({
      [params]: item
    })
  }
  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }
  sure (e) {
    this.setState({
      [e]: true
    })
  }
  handleCancel(e) {
    this.setState({
        [e]: false
    })
  }
  del () {
    let self = this
    const params = self.props.phoneInfo;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      self.props.deletePhone({
        params: {
          id: params.id,
          userId: userData.id
        },
        func: function () {
          message.success('操作成功!', 1.5, function() {
            self.setState({
              delvisibleShow: false
            })
            self.props.search('detailVisible')
          })
        }
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { phoneInfo} = this.state;
    const content = phoneInfo || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form> 
            <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
            <Button type="primary" 
              style={{marginLeft: 10}}
              onClick={this.sure.bind(this, 'delvisibleShow')}>删除</Button>
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>名称</td>
                  <td>
                    <span>{getFieldDecorator('name', {
                        initialValue: content.name
                      })(<Input placeholder="请输入名称" disabled/>)}</span>
                  </td>
                  <td  style={{width:'15%'}}><span className={Style.red}>*</span>分类</td>
                  <td>
                    {getFieldDecorator('type', {initialValue: content.type})(
                      <Select placeholder="请选择分类" disabled>
                        <Option value="1">小区电话</Option>
                        <Option value="2">周边电话</Option>
                      </Select>
                      )}
                  </td>
                </tr>
                <tr>
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>电话</td>
                  <td colSpan='3'>
                      <Tabs activeKey={this.state.phoneType} onTabClick={this.tabChange.bind(this, 'phoneType')}>
                        <TabPane tab="手机" key="1">
                        <Col span={9} style={{marginTop: 10}}>
                          <Input placeholder="请输入手机号码" maxLength={11} value={this.state.phone} disabled/>
                        </Col>
                        </TabPane>
                        <TabPane tab="座机" key="2">
                          <InputGroup style={{marginTop: 10}}>
                            <Col span={4}>
                              <Input maxLength={4} placeholder="请输入区号" value={this.state.areaCode} disabled/>
                            </Col>
                            <Col span={1}>
                            <span>---</span>
                            </Col>
                            <Col span={8}>
                              <Input placeholder="请输入座机号码"  maxLength={8} value={this.state.areaNum} disabled/>
                            </Col>
                          </InputGroup>
                        </TabPane>
                      </Tabs>
                  </td>
                </tr>


                <tr>
                  <td><span className={Style.red}>*</span>排序</td>
                  <td>
                    <span>
                      {getFieldDecorator('seq', {initialValue: content.seq})(<Input placeholder="请输入排序" disabled/>)}
                    </span>
                  </td>
                  <td><span className={Style.red}>*</span>是否启用</td>
                  <td>
                      <Tabs activeKey={this.state.status} onTabClick={this.tabChange.bind(this, 'status')}>
                        <TabPane tab="启用" key="1"></TabPane>
                        <TabPane tab="禁用" key="2"></TabPane>
                      </Tabs>
                  </td>
                </tr>
              </tbody>
            </table>
            </Form>
          </Row>
        </div>
         {/* 删除提示框 */}
         <Modal
            title="删除"
            visible={this.state.delvisibleShow}
            onOk={this.del.bind(this)}
            onCancel={this.handleCancel.bind(this,'delvisibleShow')}
            >
            <p style={{fontSize:16}}>确定删除?</p>
          </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityRight: state.phoneManage.communityRight,
    info: state.phoneManage.info,
    phoneInfo: state.phoneManage.phoneInfo
  }
}
function dispatchToProps(dispatch) {
  return {
    detailPhone(payload = {}) {
      dispatch({
          type: 'phoneManage/detailPhone',
          payload
      })
    },
    deletePhone(payload = {}) {
      dispatch({
        type: 'phoneManage/deletePhone',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
