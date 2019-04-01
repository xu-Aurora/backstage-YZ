import React, {Component} from 'react';
import {Input,Button,Row,Select,Tabs,Checkbox,Form,message} from 'antd';
import {connect} from 'dva'
import Style from './style.less';
import Moment from 'moment';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class App extends Component {
  state = {
    requestStatus: true,
    visible: false,
    data: {},
    roloStatus: this.props.data.roloStatus,
    isEdiut: 0,
    checkeID: [],
    selectID: [],
    isUp: '',
    arr: []
  }
  onChange = (checkedValues, e) => {
    const checkeID = this.refs.selectIDS.value.split(',');
    const checkedStatus = e.target.checked;
    if (!checkedStatus) {
      const newdata = checkeID.filter(item => item !== checkedValues.toString());
      this.refs.selectIDS.value = newdata.join();
    } else {
      if (!checkeID.includes(checkedValues.toString())) {
        checkeID.push(checkedValues);
        this.refs.selectIDS.value = checkeID.join();
      }
    }

  }
  handleReturn = () => {
    history.back(-1);
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      this.setState({data: this.props.data, roloStatus: this.props.data.status, isUp: this.props.data.status});
      this.props.detail({id: this.props.data.id, userId: userData.id})
      this.props.queryPermiss({
        userId: userData.id,
        roleId: this.props.data.id,
        func: (ids) => {
          this.props.queryParentIds({userId: userData.id, roleId: this.props.data.id, ids: ids});
        }
      });
  }

  componentDidMount(){
    if (this.props.checkeID) {
      this.setState({checkeID: this.props.checkeID});
    }
  }

  changeName = (e) => {
    this.setState({name: e.target.value});
  }
  changeType = (e) => {
    this.setState({type: e});
  }
  changeClass = (e) => {
    this.setState({Class: e});
  }
  changeParameter = (e) => {
    this.setState({Parameter: e.target.value});
  }

  handelClck(e) {
    let self = this
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const roleId = self.props.data.id;
      const id = self.props.data.id;
      self.props.form.validateFields((err, values) => {
        // if(this.state.requestStatus){
        //   this.setState({requestStatus: false},() => {
            self.props.saveRole({
              params: {
                name: values.name,
                status: self.state.roloStatus,
                roleId,
                id,
                userId: userData.id,
                permissionIds: self.refs.selectIDS.value
              }, 
              func: function(){
                message.success('操作成功', 1.5,function(){
                  self.props.search('editVisible')
                  self.props.queryMenu({userId: userData.id, type: 1});
                })
              }
            });
        //   })
        // }

      })

  }
  loop = (self, permisTree, ParentIds) => {
    let elements = null;
    const menuContent = [];
    function subfunction(id, item) {
      const elements = [];
      for (let i in item) {
        if (id == i) {
          item[i].forEach((n) => {
            elements.push((
              <span style={{marginLeft: 10}} key={Math.random()}>
                <Checkbox onChange={self.onChange.bind(self, n.id)} defaultChecked={n.hasRelevance == '1'
                  ? true
                  : false}>{n.name}</Checkbox>
              </span>
            ));
          })
        }
      }
      return elements;
    };
    if (permisTree && ParentIds && self.props.checkeID) {
      permisTree.forEach((item) => {
        if (item.type == '0') {
          menuContent.push((
            <tr key={Math.random()}>
              <td className={Style.left}>
                <span className={Style.fontone}>
                  <Checkbox onChange={self.onChange.bind(self, item.id)} defaultChecked={item.hasRelevance == '1'
                    ? true
                    : false} >{item.name}</Checkbox>
                </span>
              </td>
              <td className={Style.right}>{subfunction(item.id, ParentIds)}</td>
            </tr>
          ));
        }
        if (item.children) {
          item.children.forEach((d, index) => {
            if (d.type == '0') {
              menuContent.push((
                <tr key={Math.random()}>
                  <td>
                    <span className={Style.fonttwo}>
                      <Checkbox onChange={self.onChange.bind(self, d.id)} defaultChecked={d.hasRelevance == '1'
                        ? true
                        : false} >{d.name}</Checkbox>
                    </span>
                  </td>
                  <td className={Style.right}>{subfunction(d.id, ParentIds)}</td>
                </tr>
              ));
            }
            if (d.children) {
              d.children.forEach((x, index) => {
                if (x.type == '0') {
                  menuContent.push((
                    <tr key={Math.random()}>
                      <td>
                        <span className={Style.fontthr}>
                          <Checkbox onChange={self.onChange.bind(self, x.id)} defaultChecked={x.hasRelevance == '1'
                            ? true
                            : false} >{x.name}</Checkbox>
                        </span>
                      </td>
                      <td className={Style.right}>{subfunction(x.id, ParentIds)}</td>
                    </tr>
                  ));
                }
              })
            }
          })
        }
        return menuContent;
      });
      menuContent.push((
        <tr key={Math.random()} style={{heigth: 0,padding: 0,margin: 0,border: 'none'}}>
          <td style={{heigth: 0,padding: 0,margin: 0,border: 'none'}}>
            <div><input type="hidden" value={self.props.checkeID.join()} ref="selectIDS"/></div>
          </td>
          <td style={{
              heigth: 0,
              padding: 0,
              margin: 0,
              border: 'none'
            }}>
          </td>
        </tr>
      ));
    }
    return menuContent;
  }
  tabChange (item) {
    this.setState({
      roloStatus: item
    })
  }
  render() {
    const {ParentIds, permisTree, content} = this.props;
    const {getFieldDecorator} = this.props.form
    const data = content || {}
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Row>
            <Form className="login-form">
              <Button type="primary" onClick={this.handelClck.bind(this)}>保存</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>
                      <span className={Style.red}>*</span>角色名称</td>
                    <td>
                      <span>
                          {getFieldDecorator('name', {initialValue: data.name})(
                            <Input />
                          )}
                      </span>
                    </td>
                    <td>角色状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={this.state.roloStatus} onTabClick={this.tabChange.bind(this)}>
                          <TabPane tab="启用" key="0"></TabPane>
                          <TabPane tab="禁用" key="1"></TabPane>
                        </Tabs>  
                    </td>
                  </tr>
                  <tr>
                    <td style={{height: 43}}>更新时间</td>
                    <td>
                    {Moment(data.updateTime || data.createTime).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>更新人</td>
                    <td>
                      {data.updateUserId}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{
                fontWeight: 600
              }}>角色权限</h3>
              <table cellSpacing="0" className={Style.checklist}>
                <tbody>
                  {this.loop(this, permisTree, ParentIds)}
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
    data: state.roloManage.saveSeslect,
    ParentIds: state.roloManage.ParentIds,
    permisTree: state.roloManage.PermisTree,
    checkeID: state.roloManage.checkeID,
    content: state.roloManage.details
  }
}

function dispatchToProps(dispatch) {
  return {
    queryPermiss(payload = {}) {
      dispatch({type: 'roloManage/queryPermisTree', payload})
    },
    queryParentIds(payload = {}) {
      dispatch({type: 'roloManage/queryParentIds', payload})
    },
    detail(payload = {}) {
      dispatch({type: 'roloManage/details', payload})
    },
    saveRole(payload = {}) {
      dispatch({type: 'roloManage/saveRole', payload})
    },
    queryMenu(payload = {}) {
      dispatch({type: 'menu/queryMenu', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
