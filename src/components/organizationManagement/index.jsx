import React, { Component } from 'react';
import { Button, Form, Row, Col, Icon, Tree, Drawer, message,Menu} from 'antd';
import {Link} from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';

import Add from './add.jsx';
import Edit from './edit.jsx';

import List from './list.jsx';
import Item from 'antd/lib/list/Item';

//antd自定义字体图表
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_869860_t0d83mkm9ms.js',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list: [],
        expandedKeys: [],
        selectdata: '',
        isJump: false,
        isAddPermis: '',
        isRander: true,
        addVisible: false,
        editVisible: false,
        detailVisible: false,
        firstTree: [],
        communisData: [],
        gardenData: [],
        rightStatus: true,
        communityRight: '',
        gardenRight: ''
    }
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getTree({userId : userData.id});
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

    if(nextProps.firstTree) {
      this.setState({
        firstTree: nextProps.firstTree
      })
    }
    if(nextProps.communisData) {
      this.setState({
        communisData: nextProps.communisData
      })
    }
    if(nextProps.gardenData) {
      this.setState({
        gardenData: nextProps.gardenData
      })
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
  //点击弹出页面
  sendShow (e) {
    this.setState({
        [e]: true
    })
  }
  //点击关闭页面
  handleCancel(e)  {
    this.setState({
        [e]: false
    })
  }
  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.getTree({userId : userData.id});
  }

  firstClick (data) {
    this.setState({
      rightStatus: false
    },()=>{
      let list = []
      let firstTree = this.state.firstTree
      firstTree.forEach((item)=>{
        list.push(Object.assign({},item))
      })
      list.forEach((item)=>{
        if(item.id == data.id) {
          item.isUp =  true
          item.checked = !item.checked
          if(item.childrens){
            this.changeChecked(item.childrens, data)
          }
        } else {
          item.isUp = false
          item.checked =  false
          if(item.childrens){
            this.changeDown(item.childrens, data)
          }
        }
      })
      this.setState({
        firstTree: list
      })
  
      if(data.checked) {
        this.props.saveTree()
      } else {
        this.props.saveTree(data)
      }

      this.setState({
        rightStatus: true
      })
    })
  }
  // 收起
  changeDown(data) {
    data.forEach((i)=>{
      i.isUp = false
      if(i.childrens){
        this.changeDown(i.childrens)
      }
    })
  }
  // 取消选中状态
  changeChecked(item, data) {
    item.forEach((i)=>{
      i.checked = false
      if(i.childrens){
        this.changeChecked(i.childrens, data)
      }
    })
  }
  // 选中
  checked(item, data) {
    item.forEach((i)=>{
      if(i.id == data.id) {
        i.checked = !i.checked
        if(i.childrens) {
          this.changeChecked(i.childrens, data)
        }
      } else {
        i.checked = false
        if(i.childrens) {
          this.checked(i.childrens, data)
        }
      }
    })
  }
  secondClick (data) {
    this.setState({
      rightStatus: false
    },()=>{
      let list = []
      let firstTree = this.state.firstTree
      firstTree.forEach((item)=>{
        list.push(Object.assign({},item))
      })
      list.forEach((item)=>{
        //收起展开
        // if(item.isUp) {
          this.secondChangeUp(item.childrens, data)
        // }
        //清除选中
        item.checked = false
        if(item.childrens) {
          this.checked(item.childrens, data)
        }
      })
      this.setState({
        firstTree: list
      })

      if(data.checked) {
        this.props.saveTree(data)
      } else {
        this.props.saveTree()
      }
      this.setState({
        rightStatus: true
      })
    })
  }
  secondChangeUp(item, data) {
    item.forEach((i)=>{
      if(i.id == data.id) {
        if(i.isUp) {
          this.changeDown1(item)
        } else {
          this.changeDown(item)
        }
        i.isUp = true
      } else {
        if(i.childrens){
          this.secondChangeUp(i.childrens, data)
        }
      }
     
    })
  }
  changeDown1(data) {
    data.forEach((i)=>{
      i.isUp = false
      // if(i.childrens){
      //   this.changeDown(i.childrens)
      // }
    })
  }
  first (data, self) {
    const elements = data.map((item) => {
        const menuContent = (
          <div  key={item.id}>
            <div  className={item.checked ? `${styles.show} ${styles.province}` : `${styles.province}`} onClick={self.firstClick.bind(self, item)}>
              <span>{item.name}</span>
              {item.childrens.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
            </div >
            {
              item.isUp ? (item.childrens.length? self.second(self, item.childrens) : null) : null
            } 
          </div>
         );
        return menuContent;
      });
    return elements;
  }
  second (self, data, left) {
    if(left == undefined){
      left = 30
    } else {
      left += 10
    }
    const elements = data.map((item) => {
      const menuContent = (
        <div  key={item.id}>
          <div className={item.checked ? `${styles.show} ${styles.city}` : `${styles.city}`} onClick={self.secondClick.bind(self, item)} style={{paddingLeft: left}}>
            <span>{item.name}</span>
            {item.childrens.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
          </div >
          {
              item.isUp ? (item.childrens.length? self.second(self, item.childrens, left) : null): null
          } 
        </div>
      )
      return menuContent;
    });
    return elements;
  }
  edit (data) {
    this.props.saveCommunisId(data.id)
    this.setState({
      editVisible: true
    })
  }
  render() {
    const {firstTree} = this.state;
    return (
      <div className={styles.organxBox}>
        <Col className={styles.header}>
          <div style={{width:94}}>机构列表</div>
        </Col>
        <Row>
          <div  style={{backgroundColor: 'rgb(255, 255, 255)', overflow: 'hidden',height:"81vh"}}>
            <Col span={5} className={styles.menubox}>
                {this.state.isRander ? (<div>
                <div style={{overflow: 'hidden'}}>
                  <table cellSpacing="0" className={styles.mytable} style={{ border: 'none'}}>
                      <tbody>
                          <tr style={{border: 'none',backgroundColor:'#989898',height:53}}>
                              <td style={{border: 'none',color:'#FFF',textAlign:"left"}}>
                                <div style={{marginLeft:15,width:'68%'}}>机构管理</div>
                              </td>
                              <td style={{border: 'none',textAlign:"right"}}>
                                  <Button type="primary" 
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#989898',borderColor:'#FFF',marginRight: 10}}>新增机构</Button>
                              </td>

                          </tr>
                      </tbody>
                  </table>
                </div>
                <div className={styles.menubox__tree}>
                    {this.first(firstTree, this)}
              </div>
              </div>) : null}
            </Col>
            <Col span={19} className={styles.contentbox}>
              {this.state.rightStatus ? ( <List/>) : null}
            </Col>
          </div>
        </Row>

        <Drawer
          title="新增机构"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>
        <Drawer
          title="编辑小区"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'editVisible')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)}/>
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    firstTree: state.organizationManagement.firstTree,

    
    communisData: state.houseManagement.communisData,
    gardenData: state.houseManagement.gardenData
  }
}
function dispatchToProps(dispatch) {
  return {
    getTree(payload, params) {
      dispatch({
        type: 'organizationManagement/getTree',
        payload
      })
    },
    saveTree(payload, params) {
      dispatch({
        type: 'organizationManagement/saveTree',
        payload
      })
    },

    getCommunis(payload, params) {
      dispatch({
        type: 'houseManagement/getCommunis',
        payload
      })
    },
    getGarden(payload, params) {
      dispatch({
        type: 'houseManagement/getGarden',
        payload
      })
    },
    saveCommunisId(payload, params) {
      dispatch({
        type: 'houseManagement/saveCommunisId',
        payload
      })
    },
    saveCommunityRight(payload, params) {
      dispatch({
        type: 'houseManagement/saveCommunityRight',
        payload
      })
    },
    saveGardenRight(payload, params) {
      dispatch({
        type: 'houseManagement/saveGardenRight',
        payload
      })
    },
    saveUnit(payload = {}) {
      dispatch({
        type: 'houseManagement/saveUnit',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
