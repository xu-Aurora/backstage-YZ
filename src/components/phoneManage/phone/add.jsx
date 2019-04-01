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
      requestStatus: true,
      phoneType: '1',
      status: '1'
    };
  }
  componentDidMount() {
  }
  addUserSub() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {      
      let rex = this.rex(values);
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
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
        this.props.form.setFieldsValue({areaCode: '', areaNum: ''})
      } else {
        this.props.form.setFieldsValue({phone: ''})
      }
    }
    this.setState({
      [params]: item
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
                  <td style={{width:'15%'}}><span className={Style.red}>*</span>名称</td>
                  <td>
                    <span>{getFieldDecorator('name', {
                      })(<Input placeholder="请输入名称" />)}</span>
                  </td>
                  <td  style={{width:'15%'}}><span className={Style.red}>*</span>分类</td>
                  <td>
                    {getFieldDecorator('type', {})(
                      <Select placeholder="请选择分类">
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
                          {getFieldDecorator('phone', {
                          })(<Input placeholder="请输入手机号码" maxLength={11}/>)}
                        </Col>
                        </TabPane>
                        <TabPane tab="座机" key="2">
                          <InputGroup style={{marginTop: 10}}>
                            <Col span={4}>
                              {getFieldDecorator('areaCode', {
                              })(<Input maxLength={4} placeholder="请输入区号"/>)}
                            </Col>
                            <Col span={1}>
                            <span>---</span>
                            </Col>
                            
                            <Col span={8}>
                              {getFieldDecorator('areaNum', {
                              })(<Input placeholder="请输入座机号码"  maxLength={8}/>)}
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
                      {getFieldDecorator('seq', {})(<Input placeholder="请输入排序" />)}
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
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityRight: state.phoneManage.communityRight
  }
}
function dispatchToProps(dispatch) {
  return {
    addPhone(payload = {}) {
      dispatch({
        type: 'phoneManage/addPhone',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
