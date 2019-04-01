import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Col,Icon,Form,message,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true
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
        if (!value.moduleId) {
            message.warning('模板ID不能为空')
            return false
        }
         if (!value.name) {
            message.warning('分组名称不能为空')
            return false
        }
        return true
    }
    render() {
        const {location} = this.props;
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
                                      <span className={Style.red}>*</span>模板ID</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleId', {})(<Input/>)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>分组名称</td>
                                  <td>
                                      <span>{getFieldDecorator('name', {})(<Input/>)}</span>
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
            dispatch({type: 'moduleManagement/h_add', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
