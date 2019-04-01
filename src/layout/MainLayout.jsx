import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Layout,Popover, Menu, Icon, Modal, Dropdown, Form, Input, message,Avatar, Badge } from 'antd';
import {connect} from 'dva'
import { Link} from 'dva/router';
import styles from './MainLayout.less';
import Md5 from 'js-md5';


const {Header, Sider, Content} = Layout;
const reg = /^\/(\w+[^/])/;
const SubMenu = Menu.SubMenu;

const confirm = Modal.confirm;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 10
    }
};


function isAction(params) {
  let linkAddress = 'javascript:;';
  if (params) {
    linkAddress = `/1/app/${params}`;
  }
  return linkAddress;
}

function getdata(data){
  let i = 0;
  const elements = data.map((item) => {
      i++;
      const linkAddress = isAction(item.url);
      const menuContent = item.url ? (<Menu.Item key={linkAddress}>
                <Link to={linkAddress}>
                  <Icon type="exception" />
                  <span>{item.name}</span>
                </Link>
              </Menu.Item>): formart(item, i);

      return menuContent;
    });
  return elements;
}

class MainLayout extends Component {
  state = {
    collapsed: false,
    current: '1',
    openKeys: [],
    data: {},
    id: 0,
    currentUrl : 'home',
    mouseStatus: false,
    visibleMM: false,
    userData: ''
  };
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      userData
    })
    this.props.queryMenu({userId: userData.id, type: 1});
  }
  componentWillReceiveProps (nextProps){
    let url = window.location.href
    let href = url.split('?')[0].split('#')[1]
    this.setState({
      currentUrl: href
    })
  }
  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2']
    };
    return map[key] || [];
  }
  handleClick = (e) => {
    this.setState({current: e.key});
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onOpenChange = (openKeys) => {
    // 不完全的hack。暂时支持三级导航
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    let closeCode = false

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this
        .getAncestorKeys(latestOpenKey)
        .concat(latestOpenKey);
    } else {
        closeCode = true
    }
    for (let i = 0;i<nextOpenKeys.length;i++) {
      if(!isNaN(nextOpenKeys[i])) {
        closeCode = true
        break;
      }
    }
    if(closeCode) {
      openKeys.length = 2
      openKeys[1] = latestOpenKey
      nextOpenKeys = openKeys
    }
    this.setState({openKeys: nextOpenKeys});
  }
  formart = (item, index) => {
    function renderE(item) {
      const linkAddress = isAction(item.url);
      const element = item.children ? getdata(item.children) : (
        <Menu.Item key={linkAddress}>
          <Link to={linkAddress}>
            <Icon type="area-chart"/>
            <span>{item.name}</span>
          </Link>
        </Menu.Item>
      );
      return element;
    }
    const menu = item.map((d) => {
      const linkAddress = isAction(d.url);
      const content = d.children ? (
        <SubMenu key={d.id} title={<span> <Icon type="switcher"/> <span>{d.name}</span></span>}>
          {renderE(d)}
        </SubMenu>) : (
          <Menu.Item key={linkAddress}>
              <Link to={linkAddress}>
                <Icon type="area-chart"/>
                <span>{d.name}</span>
              </Link>
          </Menu.Item>
        );
      return content;
    });
    return menu;
  }
  loop = (self, data) => {
    let i = 0;
    const elements = data.map((item) => {
        i++;
        const linkAddress = isAction(item.url);

        const menuContent = item.url ? (<Menu.Item key={linkAddress}>
                  <Link to={linkAddress}>
                    <Icon type="home"/>
                    <span>{item.name}</span>
                  </Link>
                </Menu.Item>): (
      <SubMenu key={item.name} title={<span> <Icon type="home"/> <span>{item.name}</span></span>}>
        {item.children ? self.formart(item.children, i) : null}
      </SubMenu>);

        return menuContent;
      });
    return elements;
  }
  handleSelectKey(item,key,selectedKeys){
    this.setState({
      currentUrl: item.key
    });
  }
  handleLogout () {
    let self = this
    confirm({
      title: '是否注销退出系统?',
      content: '',
      onOk() {
        self.props.Logout({userId: self.state.userData.id});
        localStorage.setItem('userDetail', false);
        self.context.router.history.push(`/login`)
      },
      onCancel() {
        return;
      },
    });
  }
  edit () {
    this.setState({
      visibleMM: true
    })
  }
  handleOk() {
    let self = this
      self.props.form.validateFields((err, values) => {
          let rex = self.regx(values)
          if (!rex) {

          } else {
            self.props.updatePwd({
                params: {
                    oldPwd: Md5(values.oldPwd),
                    newPwd: Md5(values.newPwd),
                    userId: self.state.userData.id
                },
                func: function () {
                    message.success('操作成功!', 1.5, function () {
                        self.setState({
                            visibleMM: false
                        })
                    })
                }
            })
          }
      })
  }
  handleCancel () {
    this.setState({
      visibleMM: false
    })
  }
  regx (item) {
      if (!item.oldPwd) {
          message.error('旧密码不能为空')
          return false
      }
      if (!item.newPwd) {
          message.error('新密码不能为空')
          return false
      }
    return true
  }
  onKeyUp (ev) {
    ev.target.value = ev.target.value.replace(/\s+/g,'')
  }
  render() {
    const { children, location, data } = this.props;
    if (location.pathname && reg.test(location.pathname)) {
      keys = reg.exec(location.pathname)[1];
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <div>
            <span>个人中心</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={this.edit.bind(this)}>
            <span>修改密码</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    const {getFieldDecorator} = this.props.form;
    return (
      <Layout className={styles.layout}>
        <Sider trigger={null} collapsed={this.state.collapsed}>
            <div ref="refcb">
              <div className="km-logo">
                <img style={{display:this.state.collapsed ? 'none' : 'block'}} src={require('../../public/img/logoBig.png')} alt=""/>
                <img style={{width:35,height:35,display:this.state.collapsed ? 'block' : 'none'}} src={require('../../public/img/logo.png')} alt=""/>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                onOpenChange={this.onOpenChange}
                openKeys={this.state.openKeys}
                onClick={this.handleClick}
                selectedKeys={[this.state.currentUrl]}
                onSelect={this.handleSelectKey.bind(this)}
                >
                <Menu.Item key="/1/app/home">
                  <Link to="/1/app/home">
                    <Icon type="home"/>
                    <span>首页</span>
                  </Link>

                </Menu.Item>


                {this.loop(this, data)}
              </Menu>
            </div>
          </Sider>

        <Layout>
          <Header>
            <div className="use-msgs">
              <div onClick={this.toggle}>
                <img style={{width:30,height:30}} src={require('../../public/img/u692.png')} alt=""/>
              </div>

              <div style={{cursor: 'pointer'}} onClick={this.handleLogout.bind(this)}>
                <Icon type="poweroff" style={{color: 'red', fontSize: 14, marginRight: 7}}/>
                <span>注销</span>
              </div>

              <div>
                <Dropdown overlay={menu} placement="bottomCenter">
                  <div>
                    <span>
                      <Badge>
                        <img style={{width:35,height:35}} src={require('../../public/img/u688.png')} alt=""/>
                      </Badge>
                    </span>
                  <span>{this.state.userData.name}</span>
                  </div>
                </Dropdown>
              </div>

              {/* <div>
                <span style={{ marginRight: 25,marginLeft:25 }}>
                  <Badge count={8}>
                    <div style={{width:30,height:30,borderRadius:"50%"}}>
                      <img src={require('../../public/img/u3699.png')} alt=""/>
                    </div>
                  </Badge>
                </span>
              </div> */}

            </div>
          </Header>
          <Content style={{background: 'none', padding: 0}}>
            {children}
          </Content>
        </Layout>
        <Modal
            maskClosable = {false}
            title="修改密码"
            visible={this.state.visibleMM}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            okText="确定"
            cancelText="取消">
              <div>
                  <div style={{
                      margin: '15px 0'
                  }}>
                      <FormItem
                          label='旧密码'
                          {...formItemLayout}
                          style={{
                          paddingLeft: '20%',
                          marginBottom: '5px'
                      }}>
                          {getFieldDecorator('oldPwd', {
                          })(<Input type="text" onKeyUp= {this.onKeyUp.bind(this)}/>)}

                      </FormItem>
                  </div>
                  <div>
                      <FormItem
                          label='新密码'
                          {...formItemLayout}
                          style={{
                          paddingLeft: '20%',
                          marginBottom: '5px'
                      }}>
                          {getFieldDecorator('newPwd', {})(<Input type="text" onKeyUp= {this.onKeyUp.bind(this)}/>)}

                      </FormItem>
                  </div>
              </div>
        </Modal>
      </Layout>
    );
  }

}
MainLayout.propTypes = {
  children: PropTypes.node // eslint-disable-line
};
MainLayout.contextTypes = {
  router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
  return {
    data: state.menu.data, 
    name: state.login.userMsg.loginAccount
  }
}

function dispatchToProps(dispatch) {
  return {
    queryMenu(payload = {}) {
      dispatch({type: 'menu/queryMenu', payload})
    },
    Logout(payload = {}) {
      dispatch({type: 'menu/Logout', payload})
    },
    updatePwd (payload = {}) {
      dispatch({type: 'menu/updatePwd', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(MainLayout));
