import React, {Component} from 'react';
import {Input,Button,Row,Tabs,Checkbox,Form,message} from 'antd';
import {connect} from 'dva'
import Style from './style.less';

const TabPane = Tabs.TabPane;

class App extends Component {
  state = {
    requestStatus: true,
    visible: false,
    data: {},
    roloStatus: '0',
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
    this.props.queryPermiss({
      userId: userData.id
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

  regx(values){
    //正则匹配特殊字符
    var pattern = new RegExp("[-/.~'!@#￥$%^&*()-+_=:]");
    message.destroy();
    if (!values.name) {
      message.warning('角色名称不能为空');
      return;
    }
    if (values.name.length > 20) {
      message.warning('角色名称不能超过20位数');
      return;
    };

    if (pattern.test(values.name)) {
      message.warning('角色名称中含有特殊字符');
      return;
    }

    if (this.refs.selectIDS.value == '') {
      message.warning('角色权限不能为空');
      return;
    }
    return true;
  }

  SubMit = () => {
    let self = this
    self.props.form.validateFields((err, values) => {
      let reg = this.regx(values);
      if(this.state.requestStatus){
        self.setState({requestStatus: false},() => {
          if(reg){
            self.props.addRole({
              params:{
                name: values.name,
                status: self.state.roloStatus,
                roleId: '',
                userId: JSON.parse(localStorage.getItem('userDetail')).id,
                permissionIds: self.refs.selectIDS.value
              },
              func: function(){
                message.success('新增成功', 1.5,function(){
                  self.props.search('addVisible')
                  
                })
              }
            });
          }
        })
      }


    })
  }
  loop = (self, permisTree) => {
    let elements = null;
    const menuContent = [];
    function subfunction(id, item) {
      const elements = [];
      for (let i = 0; i < item.length; i++) {
        if (item[i].type != '0') {
          elements.push((
            <span style={{
              marginLeft: 10
            }} key={Math.random()}>
              <Checkbox onChange={self.onChange.bind(self, item[i].id)}>{item[i].name}</Checkbox>
            </span>
          ));
        }
      }
      return elements;
    };
    if (permisTree) {
      permisTree.forEach((item) => {
        if (item.type == '0') {
          menuContent.push((
            <tr key={Math.random()}>
              <td className={Style.left}>
                <span className={Style.fontone}>
                  <Checkbox onChange={self.onChange.bind(self, item.id)}>{item.name}</Checkbox>
                </span>
              </td>
              <td className={Style.right}>{item.children ? subfunction(item.id, item.children) : null}</td>
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
                      <Checkbox onChange={self.onChange.bind(self, d.id)}>{d.name}</Checkbox>
                    </span>
                  </td>
                  <td className={Style.right}>{d.children ? subfunction(d.id, d.children) : null}</td>
                </tr>
              ));
            }
            if (d.children) {
              d.children.forEach((x) => {
                if (x.type == '0') {
                  menuContent.push((
                    <tr key={Math.random()}>
                      <td>
                        <span className={Style.fontthr}>
                          <Checkbox onChange={self.onChange.bind(self, x.id)}>{x.name}</Checkbox>
                        </span>
                      </td>
                      <td className={Style.right}>{x.children ? subfunction(x.id, x.children) : null}</td>
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
        <tr
          key={Math.random()}
          style={{
          heigth: 0,
          padding: 0,
          margin: 0,
          border: 'none'
        }}>
          <td
            style={{
            heigth: 0,
            padding: 0,
            margin: 0,
            border: 'none'
          }}>
            <div><input type="hidden" ref="selectIDS"/></div>
          </td>
          <td
            style={{
            heigth: 0,
            padding: 0,
            margin: 0,
            border: 'none'
          }}></td>
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
    const {location, permisTree} = this.props;
    const {getFieldDecorator} = this.props.form
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Row>
            <Form className="login-form">
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.SubMit}>保存</Button> :
              <Button type="primary">保存</Button>
            }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>
                      <span className={Style.red}>*</span>角色名称</td>
                    <td>
                      {getFieldDecorator('name', {})(<Input/>)}
                    </td>
                    <td>角色状态</td>
                    <td style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs onTabClick={this.tabChange.bind(this)}>
                          <TabPane tab="启用" key="0"></TabPane>
                          <TabPane tab="禁用" key="1"></TabPane>
                        </Tabs>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{
                fontWeight: 600
              }}>角色权限</h3>
              <table cellSpacing="0" className={Style.checklist}>
                <tbody>
                  {this.loop(this, permisTree)}
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
    permisTree: state.roloManage.PermisTree,
    loading: !!state.loading.models.roloManage
  }
}

function dispatchToProps(dispatch) {
  return {
    queryPermiss(payload = {}) {
      dispatch({type: 'roloManage/queryPermisTree', payload})
    },
    addRole(payload = {}) {
      dispatch({type: 'roloManage/addRole', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
