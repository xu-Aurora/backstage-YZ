import React, { Component} from 'react';
import { Button, Form, Modal, Row, Col, Icon, Tree, Tabs, message} from 'antd';
import {Link} from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

import { Route} from 'dva/router';
import Details from './details';//资源管理详情

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list: [],
        expandedKeys: [],
        selectdata: '',
        isJump: false,
        isAddPermis: '',
        isRander: false
    }
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({userId : userData.id});
  }
  componentDidMount() {
    const self = this;
    setTimeout(function() {
      self.setState({isRander: true})
    }, 600);
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.list) {
      this.formatData(nextProps.list);
    }
    if (this.props.isAddPermis) {
      if (this.props.isAddPermis !== nextProps.isAddPermis) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({userId : userData.id});
      }
    }

  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  confirmDele = () => {
    const data = this.state.list;
    const selectedKeys = this.state.selectdata;
    const self = this;
    if (selectedKeys == '') {
      message.error('请选择需要删除的菜单')
    } else {
      confirm({
        title: '是否要删除此菜单?',
        onOk() {
          for (let i=0; i<data.length;i++) {
            if (data[i].key == selectedKeys[0]) {
              data.splice(i, 1);
              break;
            }
            if (data[i].children && data[i].children.length > 0) {
              const data_x1 = data[i].children;
              for (let n=0; n<data_x1.length; n++) {
                if (data_x1[n].key == selectedKeys[0]) {
                  data[i].children.splice(n, 1);
                  break;
                };
                if (data_x1[n].children && data_x1[n].children.length > 0) {
                  const data_x2 = data_x1[n].children;
                  for (let d=0; d<data_x2.length; d++) {
                    if (data_x2[d].key == selectedKeys[0]) {
                      data[i].children[n].children.splice(d, 1);
                      break;
                    };
                    if (data_x2[d].children && data_x2[d].children.length > 0) {
                      const data_x3 = data_x2[d].children;
                      for (let y=0; y<data_x3.length; y++) {
                        if (data_x3[y].key == selectedKeys[0]) {
                          data[i].children[n].children[d].children.splice(y, 1);
                          break;
                        };
                      }
                    }
                  }

                }
              }
            }
          }
          self.props.deleId({id: selectedKeys[0], deleRandom: Math.random()})
          self.setState({list: data});
          self.props.saveId({id: ''})
        },
        onCancel() {},
      });
    }

  }
  onDrop = (info) => {

    const dropKey = info.node.props.eventKey; //目的ID
    const dragKey = info.dragNode.props.eventKey; //当前ID
    let targetParentId = null;
    // const dragNodesKeys = info.dragNodesKeys;
    let seq = null;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key == key) {
          if (item.type === '0') {
            targetParentId = item.key
          } else {
            targetParentId = item.parentId;
          }
          const seqNum =  parseInt(item.seq, 10);

          seq = seqNum - 1;

          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = this.state.list;
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      ar.splice(i, 0, dragObj);
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.props.updatePermis({ parentId: targetParentId, userId: this.props.match.params.id, id: dragKey || dropKey, seq });
    this.setState({
      list: data,
    });
  }
  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length != 0) {
      this.setState({
        selectdata: selectedKeys
      });
      this.props.saveId({id: selectedKeys[0]});
    } else {
       this.setState({
        selectdata: ''
      });
      this.props.saveId({id: ''})
    }

  }
  formatData = (data) => {
   var childrenData =  function (type, item){
      const content = [];
      if (item.children) {
        item.children.forEach((d) => {
          let sub = childrenData(d.type, d);
          defaultData.push(d.id.toString())
            content.push({
              title: d.name,
              parentId: d.parentId || '',
              key: d.id,
              type: d.type,
              children: sub.length > 0 ? sub : false,
              seq: d.seq
            })
        });
      }

      return content;
    };
    const content = [];
    const defaultData = [];
    data.forEach((item) => {
        const sub = childrenData(item.type, item);
        defaultData.push(item.id.toString())
        content.push({
          title: item.name,
          key: item.id,
          type: item.type,
          parentId: item.parentId || '',
          children: sub.length > 0 ? sub : false,
          seq: item.seq
        })

    })
    this.setState({list: content, expandedKeys: defaultData})
  }
  setLabel (item) {
    if(item.type == 0) {
      return (<Icon type="folder" style={{color: '#FACB4B',marginRight: 5}} />)
    } else if (item.type == 1) {
      return (<Icon type="book" style={{color: '#2C9BEA',marginRight: 5}} />)
    } else if (item.type == 2) {
      return (<Icon type="swap" style={{color: '#2C9BEA',marginRight: 5}} />)
    }
  }
  render() {
    const { children, location, routeParams} = this.props;
    const {list, expandedKeys} = this.state;
    const reg = /details/g;
    const linkAddress = (id) => {
      return `/${this.props.match.params.id}/app/resourceManagement/${id}/details`;
    }
    const loop = data => data.map((item) => {
       if (item.children && item.children.length) {
          return <TreeNode key={item.key} title={item.type == '0' ? (<Link to={linkAddress(item.key)} ><Icon type="folder" style={{color: '#FACB4B',marginRight: 5}} />{item.title}</Link>) : (<Link to={linkAddress(item.key)}><Icon type="inbox" style={{color: '#2C9BEA',marginRight: 5}} />{item.title}</Link>)}>{loop(item.children)}</TreeNode>;
       }
       return <TreeNode key={item.key} title={(<Link to={linkAddress(item.key)} >{this.setLabel(item)} {item.title}</Link>)} />;
    });
    return (
      <div className={styles.organxBox}>
          <Row>
              <Col className={styles.header}>
                <div style={{width:94}}>资源管理</div>
              </Col>
              <div  style={{backgroundColor: 'rgb(255, 255, 255)', padding: 15, overflow: 'hidden', marginTop: 20,height:"81vh"}}>
                <Col span={6} className={styles.menubox}>
                    {this.state.isRander ? (<div>
                    <div style={{borderBottom: "1px solid rgb(204, 204, 204)", paddingBottom: '10px',overflow: 'hidden'}}>
                      <table cellSpacing="0" className={styles.mytable} style={{ border: 'none'}}>
                          <tbody>
                              <tr style={{border: 'none'}}>
                                  <td style={{border: 'none'}}>
                                  <Link to={reg.test(location.pathname) ? `/${this.props.match.params.id}/app/resourceManagement/details` : location.pathname + '/details'} >
                                    <Button type="primary"  style={{marginRight: 20}}>新增</Button>
                                  </Link></td>
                                  <td  style={{border: 'none'}} onClick={this.confirmDele}>
                                    <Button type="primary" >删除</Button>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                    </div>
                    <div className={styles.menubox__tree}>
                      <Tree
                        className="draggable-tree"
                        defaultExpandedKeys={expandedKeys}
                        draggable
                        onDragEnter={this.onDragEnter}
                        onSelect={this.onSelect}
                        onDrop={this.onDrop}
                      >
                        {loop(list)}
                      </Tree>
                  </div>
                  </div>) : null}
                </Col>
                <Col span={18} className={styles.contentbox}>
                    <Route path={`/:id/app/resourceManagement/details`} component={Details} />
                    <Route path={`/:id/app/resourceManagement/:key/details`} component={Details} />
                    {children}
                </Col>
              </div>
          </Row>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isAddPermis: state.resourceManagement.isAddPermis,
    list: state.resourceManagement.organData
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({
        type: 'resourceManagement/queryList',
        payload
      })
    },
    saveId(payload, params) {
      dispatch({
        type: 'resourceManagement/saveId',
        payload
      })
    },
    updatePermis(payload, params) {
      dispatch({type: 'resourceManagement/updatePermis', payload})
    },
    deleId(payload, params) {
      dispatch({
        type: 'resourceManagement/deleId',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
