import React, { Component } from 'react';
import { Button, Form, Row, Col, Icon, Tree, Drawer, message,Menu} from 'antd';
import {Link} from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';

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
  firstClick (id) {
    this.props.tabStatus()
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
    this.props.clearRight()
  }
  secondClick (item) {
    this.props.tabStatus()
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
    this.props.clearRight()   
  }
  thirdClick (item) {
   
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    let data = this.state.communisData
    self.props.tabStatus()
    self.props.saveCommunityRight(item)

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
    this.props.tabStatus()
    this.props.saveGardenRight(item)
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
          <div  key={item.id}>
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
          <div className={item.checked ? `${styles.show} ${styles.garden}` : `${styles.garden}`} onClick={self.thirdClick.bind(self, item)}>
            <span >{item.name}</span>
            {self.state.gardenData.length ? (item.isUp ? (<Icon type="up" theme="outlined"  className={styles.icon}/>):(<Icon type="down" theme="outlined"  className={styles.icon}/>)): null}
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
  render() {
    const { areaData} = this.state;
    return (
      <div>
        <Row>
          <div  style={{backgroundColor: 'rgb(255, 255, 255)', overflow: 'hidden',height:"81vh"}}>
            <Col className={styles.menubox}>
                {this.state.isRander ? (<div>
                <div style={{overflow: 'hidden'}}>
                  <table cellSpacing="0" className={styles.mytable} style={{ border: 'none'}}>
                      <tbody>
                          <tr style={{border: 'none',backgroundColor:'#989898',height:53}}>
                              <td style={{border: 'none',color:'#FFF',textAlign:"left"}}>
                                <div style={{marginLeft:15,width:'68%'}}>选择小区</div>
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
          </div>
        </Row>
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
        type: 'proprietorManagement/saveCommunisId',
        payload
      })
    },
    clearRight(payload, params) {
      // 清空信息
      dispatch({
        type: 'proprietorManagement/clearRight',
        payload
      })
    },
    saveCommunityRight(payload, params) {
      // 小区信息
      dispatch({
        type: 'proprietorManagement/saveCommunityRight',
        payload
      })
    },
    saveGardenRight(payload, params) {
      // 苑信息
      dispatch({
        type: 'proprietorManagement/saveGardenRight',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
