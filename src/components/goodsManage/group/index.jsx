import React, { Component } from 'react';
import {Button,Row,Form,Input,Select,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      groupList: []
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    this.props.getgroup({
      params: {
        userId: userData.id,
        businessType: '1'
      },
      func: function() {
        self.setState({
            groupList: self.props.groupList
        })
      }
    })
  }


  confirm(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    this.props.form.validateFields((err, values) => {
      this.props.goodsBatchUpdate({
        params: {
          idsStr: self.props.groupStatus ? self.props.data.id : self.props.checkList.join(), 
          type: '4', 
          userId: userData.id, 
          goodGroupId: `|${values.group.join('|')}|`, 
          instCode: userData.instCode
        },
        func: function () {
          message.success('操作成功', 1.5, ()=>{
            self.props.search('groupVisible')
          });
        }
      })
    })
  }

  cancel(){
    this.props.closeGroup(false)
  }

    // 商品分组
  groupApply() {
    let children = []
    this.state.groupList.forEach((data, index)=>{
        children.push(
            <Option key={index} value={`${data.id}`}>{data.name}</Option>
        )
    })
    return children
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.props.groupStatus ? this.props.data : {};
    console.log(data)
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              <Button type="primary" onClick={this.confirm.bind(this)}>确定</Button>
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>商品分组</td>
                    <td>
                      {getFieldDecorator('group', {initialValue: data.goodGroupId ? data.goodGroupId.replace(/(^\|*)|(\|*$)/g, "").split('|') : undefined})(
                        <Select
                          mode="multiple"
                          style={{width: '100%'}}
                        >
                            {this.groupApply()}
                        </Select>
                      )}
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
    groupList: state.goodsManage.groupList,
    data: state.goodsManage.ItemDetail
  }
}

function dispatchToProps(dispatch) {
  return {
    getgroup(payload = {}) {
      dispatch({type: 'goodsManage/getgroup', payload})
    },
    goodsBatchUpdate(payload = {}) {
      dispatch({type: 'goodsManage/goodsBatchUpdate', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
