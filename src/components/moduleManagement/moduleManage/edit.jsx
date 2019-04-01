import React, {Component} from 'react';
import {Input,Button,Row,Tabs,Form,message} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            status: this.props.data.status,
            isShow: this.props.data.status
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryDetails({
                id: this.props.argument.id,
                userId: userData.id
        });
    }
    update() {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus:false},() => {
                            this.props.update({
                                params: {
                                    status: self.state.status,
                                    isShow: self.state.isShow,
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                    ...values
                                },
                                func: function () {
                                    message.success('操作成功', 1.5, ()=>{
                                        self.props.search('editVisible')
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
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                {
                    this.state.requestStatus ? <Button type="primary" onClick={this.update.bind(this)}>保存</Button> :
                    <Button type="primary">保存</Button>
                }
                  
                  <Row>
                      <table cellSpacing="0" className={Style.mytable}>
                          <tbody>
                              <tr>
                                  <td>
                                      <span className={Style.red}>*</span>模块名</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleName', {
                                              initialValue: content.moduleName || null
                                          })(<Input />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>模块名称</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleCode', {
                                              initialValue: content.moduleCode || null
                                          })(<Input />)}</span>
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

                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>是否展示</td>
                                  <td>
                                        <Tabs activeKey={this.state.isShow} onTabClick={this.tabChange.bind(this,'isShow')}>
                                            <TabPane tab="展示" key="0"></TabPane>
                                            <TabPane tab="不展示" key="1"></TabPane>
                                        </Tabs>
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
    return {
      data: state.moduleManagement.pDetail, 
      argument: state.moduleManagement.p_data, 
      linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'moduleManagement/p_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'moduleManagement/p_update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
