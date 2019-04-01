import React, {Component} from 'react';
import {Input,Button,Row,Form,message,Tabs} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            status: '0'
        };
        this.regx = this.regx.bind(this)
    }

    add = () => {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.instAdd({
                                params: {
                                    ...values,
                                    status: this.state.status,
                                    userId: userData.id
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
    tabChange (item) {
        this.setState({
          status: item
        })
    }
    regx () {
        let value = (this.props.form.getFieldsValue())
        message.destroy();
        if (!value.code) {
            message.warning('机构编码不能为空')
            return false
        }
        if (!value.name) {
            message.warning('机构名称不能为空')
            return false
        }
        return true
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
                                      <span className={Style.red}>*</span>机构编码</td>
                                  <td>
                                      <span>{getFieldDecorator('code', {})(<Input/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>机构名称</td>
                                  <td>
                                      <span>{getFieldDecorator('name', {})(<Input/>)}</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>状态</td>
                                  <td>
                                    <Tabs activeKey={this.state.status} onTabClick={this.tabChange.bind(this)}>
                                        <TabPane tab="启用" key="0"></TabPane>
                                        <TabPane tab="禁用" key="1"></TabPane>
                                    </Tabs>
                                  </td>
                                  <td>备注</td>
                                  <td>
                                      <div>
                                          {getFieldDecorator('memo', {})(<Input />)}
                                      </div>
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
            dispatch({type: 'institutionManagement/instAdd', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
