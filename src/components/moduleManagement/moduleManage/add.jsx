import React, {Component} from 'react';
import {Input,Button,Row,Form,Tabs,message} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            status: '0',
            isShow: '0'
        };
        this.regx = this.regx.bind(this)
    }

    add = () => {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.instAdd({
                                params: {
                                    ...values,
                                    status: self.state.status,
                                    isShow: self.state.isShow,
                                    userId: this.props.linkID ? this.props.linkID : userData.id
                                },
                                func: function () {
                                    message.success('新增成功', 1.5, function() {
                                        self.props.search('addVisible')
                                    });
                                }
                            })
                    })
                }
            }
        })
        
    }
    regx () {
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.moduleName) {
            message.warning('模块名不能为空')
            return false
        }
         if (!value.moduleCode) {
            message.warning('模块名称不能为空')
            return false
        }
        return true
    }

    tabChange (type,item) {
        this.setState({
          [type]: item
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                {
                    this.state.requestStatus ? <Button type="primary" onClick={this.add}>保存</Button> :
                    <Button type="primary">保存</Button>
                }
                  
                  <Row>
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模块名</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleName', {})(<Input/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模块名称</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleCode', {})(<Input/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>状态</td>
                                  <td  style={{textAlign:'left',paddingLeft:15}}>
                                    <Tabs activeKey={this.state.status} onTabClick={this.tabChange.bind(this,'status')}>
                                        <TabPane tab="正常" key="0"></TabPane>
                                        <TabPane tab="禁用" key="1"></TabPane>
                                    </Tabs>
                                        {/* <span>{getFieldDecorator('status', {})(
                                              <RadioGroup>
                                                  <Radio value="0">正常</Radio>
                                                  <Radio value="1">禁用</Radio>
                                              </RadioGroup>
                                          )}</span> */}
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>是否展示</td>
                                  <td>
                                    <Tabs activeKey={this.state.isShow} onTabClick={this.tabChange.bind(this,'isShow')}>
                                        <TabPane tab="展示" key="0"></TabPane>
                                        <TabPane tab="不展示" key="1"></TabPane>
                                    </Tabs>
                                      {/* <span>{getFieldDecorator('isShow', {})(
                                              <RadioGroup>
                                                  <Radio value="0">展示</Radio>
                                                  <Radio value="1">不展示</Radio>
                                              </RadioGroup>
                                          )}</span> */}
                                  </td>
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
    return {}
}

function dispatchToProps(dispatch) {
    return {
        instAdd(payload = {}) {
            dispatch({type: 'moduleManagement/p_add', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
