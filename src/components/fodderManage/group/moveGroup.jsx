import React, { Component } from 'react';
import {Button,Row,Form,Select,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true
    };
  }

  componentWillMount(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryGroup1({
      userId: userData.id,
      instCode: userData.instCode
    })
  }

  handelClck(){
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    
      if(this.state.newPictureGroupName == '未分组'){
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.moveGroup({
              params: {
                userId: userData.id,
                newPictureGroupId: this.state.newPictureGroupId,
                ids: self.props.groupData[0].join(','),
                pictureGroupIds: self.props.groupData[1]
              },
              func: function(){
                self.props.search('moveGroupVisible')
                message.success('操作成功!', 1.5, function() {
                  //操作完了把ids数据清空
                  self.props.emptyArr();
                });
              }
            })
          })
        }
      }else{
        if(!this.state.newPictureGroupId){
          message.warning('分组不能为空');
          return false;
        }
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.moveGroup({
              params: {
                userId: userData.id,
                newPictureGroupId: this.state.newPictureGroupId,
                ids: self.props.groupData[0].join(','),
                pictureGroupIds: self.props.groupData[1]
              },
              func: function(){
                self.props.search('moveGroupVisible')
                message.success('操作成功!', 1.5, function() {
                  //操作完了把ids数据清空
                  self.props.emptyArr();
                });
              }
            })
          })
        }
      }

  }

  cancel(){
    this.props.editGroup()
  }

  changeGroup(val,name) {
    this.setState({
      newPictureGroupId: val,
      newPictureGroupName: name.props.children
    })
  }



  render() {
    const {listGroup1} = this.props;
    const listGroups = listGroup1 ? listGroup1 : [];

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={ this.handelClck.bind(this) }>确定</Button>
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>分组名称</td>
                    <td colSpan={3}>
                        {/* {getFieldDecorator('newPictureGroupId')( */}
                            <Select placeholder="请选择分组" onChange={this.changeGroup.bind(this)}>
                              {listGroups ? listGroups.map((item,index) => (
                                  <Option key={item.id} value={item.id}>{item.name}</Option>
                              )) : null}
                            </Select>
                        {/* )} */}
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
    listGroup1: state.fodderManage.listGroup1,//分组数据
  }
}

function dispatchToProps(dispatch) {
  return {
    queryGroup1(payload = {}) {
      dispatch({type: 'fodderManage/queryGroup1', payload})
    },
    moveGroup(payload = {}) {
      dispatch({type: 'fodderManage/mobilePacket', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
