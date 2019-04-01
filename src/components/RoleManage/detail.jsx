import React, {Component} from 'react';
import {Input,Select,Button,Row,Tabs,Form,Switch,Checkbox,message} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './style.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
      roloStatus: '',
      isEdiut: 0,
      checkeID: [],
      selectID: [],
      isUp: ''
    };
  }
  onChange = (checkedValues, e) => {
    if (this.state.isEdiut == 1) {
      const checkeID = this.refs.selectIDS.value.split(',');
      const checkedStatus = e.target.checked;
      if (!checkedStatus) {
        const newdata = checkeID.filter(item => item != checkedValues);
        this.refs.selectIDS.value = newdata.join();
      } else {
        if (!checkeID.includes(checkedValues.toString())) {
          checkeID.push(checkedValues);
          this.refs.selectIDS.value = checkeID.join();
        }
      }
    }
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
  componentWillReceiveProps() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if (this.props.checkeID) {
      this.setState({checkeID: this.props.checkeID});
    }
  }
  handleReturn = () => {
    history.back(-1);
  }

  toggle = () => {
    if (this.state.isEdiut == 1) {
      if (this.state.roloStatus == '1' || this.state.roloStatus == 1) {
        // this.setState({isUp: '0', roloStatus: '0'});
      } else {
        // this.setState({isUp: '1', roloStatus: '1'});
      }
    }

  }
  menuContent = (id, item) => {
    let menu = [];
    let defaultValue = []
    for (let i in item) {
      if (id == i) {
        item[i].forEach((n) => {
          menu.push({label: n.name, value: n.id});
          if (n.hasRelevance == '1') {
            defaultValue.push(n.id);
          }
        })
      }
    }
    return {menu, defaultValue};
  }
  loop = (self, permisTree, ParentIds) => {
    let elements = null;
    const menuContent = [];
    function subfunction(id, item) {//遍历生成右侧功能项数据
      const elements = [];
      for (let i in item) {
        if (id == i) {
          item[i].forEach((n) => {
            elements.push((
              <span style={{marginLeft: 10}} key={Math.random()}>
                <Checkbox onChange={self.onChange.bind(self, n.id)} defaultChecked={n.hasRelevance == '1'
                  ? true
                  : false} disabled={self.state.isEdiut == 0
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
      permisTree.forEach((item) => {//遍历资源管理的数据
        if (item.type == '0') {//菜单
          menuContent.push((
            <tr key={Math.random()}>
              <td className={Style.left}>
                <span className={Style.fontone}>
                  <Checkbox onChange={self.onChange.bind(self, item.id)} defaultChecked={item.hasRelevance == '1'
                    ? true
                    : false} disabled={this.state.isEdiut == 0
                    ? true
                    : false}>{item.name}</Checkbox>
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
                        : false} disabled={this.state.isEdiut == 0
                        ? true
                        : false}>{d.name}</Checkbox>
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
                            : false} disabled={this.state.isEdiut == 0
                            ? true
                            : false}>{x.name}</Checkbox>
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
  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }
  render() {
    const {permisTree, ParentIds, content} = this.props;
    const {getFieldDecorator} = this.props.form
    const data = content || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Row>
            <Form  className="login-form">
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>
                      角色名称</td>
                    <td>
                      <span>
                        {getFieldDecorator('name', {initialValue: data.name})(
                          <Input maxLength={30} disabled/>
                        )}
                      </span>
                    </td>
                    <td>角色状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={data.status}> 
                          <TabPane  disabled tab="启用" key="0"></TabPane>
                          <TabPane disabled  tab="禁用" key="1"></TabPane>
                        </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td>更新时间</td>
                    <td>{Moment(data.updateTime || data.createTime).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>更新人</td>
                    <td>
                      {getFieldDecorator('updateUserId', {initialValue: data.updateUserId})(
                        <Input disabled/>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{fontWeight: 600}}>角色权限</h3>
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
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
