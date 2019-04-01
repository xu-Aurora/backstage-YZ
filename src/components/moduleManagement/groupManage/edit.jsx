import React, {Component} from 'react';
import {Input,Select,Radio,Button,Row,Col,Icon,Form,message,DatePicker,} from 'antd';
import {connect} from 'dva';
import Style from '../style.less';
import Moment from 'moment';

const userData = JSON.parse(localStorage.getItem('userDetail'));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            requestStatus: true
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
        const {location, permisTree, data} = this.props;
        const {index_r, input_type, tables} = this.state;
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
                                      <span className={Style.red}>*</span>模板ID</td>
                                  <td>
                                      <span>{getFieldDecorator('moduleId', {
                                              initialValue: content.moduleId || null
                                          })(<Input  />)}</span>
                                  </td>
                                  <td>
                                      <span className={Style.red}>*</span>分组名称</td>
                                  <td>
                                      <span>{getFieldDecorator('name', {
                                              initialValue: content.name || null
                                          })(<Input   />)}</span>
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
        data: state.moduleManagement.hDetail, 
        argument: state.moduleManagement.h_data, 
        linkID: state.login.userMsg.id
    }
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'moduleManagement/h_detail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'moduleManagement/h_update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));