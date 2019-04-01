import React, { Component } from 'react';
import {Button,Row,Form,Input} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

const { TextArea } = Input;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({ 
      userId: userData.id, 
      // id: this.props.argument.id, 
    });
  }

  label(){
    //点击跳转编辑页面
    this.props.closeAmend(false);
  }


  render() {
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.label.bind(this)}>保存</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>标记类型</td>
                    <td colSpan={3}>
                      <Input placeholder="请输入修改金额" style={{width:'67%'}} />
                      当前账单金额为：{2038.03} 元（年）
                    </td>
                  </tr>
                  <tr>
                    <td>修改原因</td>
                    <td colSpan={3}>
                        <TextArea placeholder="请输入修改金额原因" autosize={{ minRows: 2, maxRows: 6 }} />
                    </td>
                  </tr>

                </tbody>
              </table>

            </Row>
          </Form>
        </div>

      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.adviceManage.saveSeslect,
    data: state.adviceManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload,params) {
      dispatch({type: 'adviceManage/detail', payload})
    },
    
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
