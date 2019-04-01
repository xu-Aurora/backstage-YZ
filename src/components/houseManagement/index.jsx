import React, { Component } from 'react';
import { Button, Form, Row, Col, Icon, Tree, Drawer, message,Menu} from 'antd';
import {Link} from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';

import Add from './community/add.jsx';
import Edit from './community/edit.jsx';

import List from './list.jsx';

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
        isRander: false,
        addVisible: false,
        editVisible: false,
        detailVisible: false,
        areaData: [],
        communisData: [],
        gardenData: [],
        rightStatus: false,
        communityRight: '',
        gardenRight: ''
    }
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getArea({userId : userData.id});
    this.props.clearRight()
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

    if(nextProps.areaData) {
      this.setState({
        areaData: nextProps.areaData
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
    this.props.getArea({userId : userData.id});
  }

  firstClick (id) {
    this.setState({
      rightStatus: false
    })
    let data = this.state.areaData
    data.forEach((item)=>{
      if(item.areas) {
        item.areas.forEach((i)=>{
          i.isUp = false
        })
      }
      if(item.id == id) {
        item.isUp =  !item.isUp
      } else {
        item.isUp = false
      }
    })
    this.setState({
      areaData: data
    })
  }
  secondClick (item) {
    this.setState({
      rightStatus: false
    })
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    let data = this.state.areaData
    self.props.getCommunis({
      params:{
        instCode: userData.instCode,
        areaCode: item.code,
        userId: userData.id
      },
      func: function(){
        data.forEach((i)=>{
          if(i.areas) {
            i.areas.forEach((j)=>{
              if(j.id == item.id) {
                j.isUp = !j.isUp
              } else {
                j.isUp = false
              }
            })
          }
        })
        self.setState({
          areaData: data
        })
      }
    })
   
  }
  thirdClick (item) {
   
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    let data = this.state.communisData
    self.setState({
      rightStatus: false
    },() =>{
      self.props.saveCommunityRight(item)
      self.props.saveUnit('')
      self.setState({
        rightStatus: true
      })
    })
    self.props.getGarden({
      params:{
        comId : item.id,
        userId: userData.id
      },
      func: function(){
        data.forEach((i)=>{
          if(i.id == item.id) {
            i.isUp = !i.isUp
          } else {
            i.isUp = false
          }
        })
        self.setState({
          communisData: data
        })
      }
    })
    self.state.communisData.forEach((data) =>{
      if(data.id == item.id) {
       data.checked = true
      }else {
        data.checked = false
      }
    })
  }
  fourthClick (item) {
    let self = this
    this.setState({
      rightStatus: false
    },()=>{
      this.props.saveGardenRight(item)
      this.props.saveUnit('')
      this.setState({
        rightStatus: true
      })
    })
    self.state.communisData.forEach((data) =>{
      data.checked = false
    })
    self.state.gardenData.forEach((data) =>{
      if(data.id == item.id) {
       data.checked = true
      }else {
        data.checked = false
      }
    })
  }
  first (data, self) {
    const elements = data.map((item) => {
        const menuContent = (
          <div  key={item.id} >
            <div  className={styles.province} onClick={self.firstClick.bind(self, item.id)}>
              <span>{item.name}</span>
              {item.areas.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
            </div >
            {
              item.isUp ? (item.areas ? self.second(self, item.areas) : null) : null
            } 
          </div>
         );
        return menuContent;
      });
    return elements;
  }
  second (self, data) {
    const elements = data.map((item) => {
      const menuContent = (
        <div  key={item.id}>
          <div className={styles.city} onClick={self.secondClick.bind(self, item)}>
            <span>{item.name}</span>
            {self.state.communisData.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
          </div >
          {
            item.isUp ? self.third(self, self.state.communisData) : null
          } 
        </div>
      )
      return menuContent;
    });
    return elements;
  }
  third (self, data) {
    const elements = data.map((item) => {
      const menuContent = (
        <div  key={item.id}>
          <div className={item.checked ? `${styles.show} ${styles.garden}` : `${styles.garden}`}>
            <span onClick={self.thirdClick.bind(self, item)}>{item.name}</span>
            {self.state.gardenData.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
            <IconFont type="icon-public" className={styles.icon} onClick={self.edit.bind(self, item)} style={{paddingRight:10}}/>
          </div >
          {
            item.isUp ? self.fourth(self, self.state.gardenData) : null
          } 
        </div>
      )
      return menuContent;
    });
    return elements;
  }
  fourth (self, data) {
    const elements = data.map((item) => {
      const menuContent = (
        <div  key={item.id}>
          <div className={item.checked ? `${styles.show} ${styles.fourth}` : `${styles.fourth}`} onClick={self.fourthClick.bind(self, item)}>
            <span>{item.name}</span>
          </div >
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
    const { areaData} = this.state;
    return (
      <div className={styles.organxBox}>
        <Col className={styles.header}>
          <div style={{width:94}}>小区列表</div>
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
                                <div style={{marginLeft:15,width:'68%'}}>选择小区</div>
                              </td>
                              <td style={{border: 'none',textAlign:"right"}}>
                                 
                                  <Button type="primary" 
                                    onClick={this.sendShow.bind(this, 'addVisible')} 
                                    style={{backgroundColor:'#989898',borderColor:'#FFF',marginRight: 10}}>新增小区</Button>
                              </td>

                          </tr>
                      </tbody>
                  </table>
                </div>
                <div className={styles.menubox__tree}>
                    {this.first(areaData, this)}
              </div>
              </div>) : null}
            </Col>
            <Col span={19} className={styles.contentbox}>
              {this.state.rightStatus ? ( <List/>) : null}
            </Col>
          </div>
        </Row>

        <Drawer
          title="新增小区"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          destroyOnClose
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
    areaData: state.houseManagement.areaData,
    communisData: state.houseManagement.communisData,
    gardenData: state.houseManagement.gardenData
  }
}
function dispatchToProps(dispatch) {
  return {
    getArea(payload, params) {
      dispatch({
        type: 'houseManagement/getArea',
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
    clearRight(payload, params) {
      dispatch({
        type: 'houseManagement/clearRight',
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
