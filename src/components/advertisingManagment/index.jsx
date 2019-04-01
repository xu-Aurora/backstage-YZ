import React, { Component } from 'react';
import { Button, Form, Row, Col, Icon, Drawer,List } from 'antd';
import AdvertManagment from './advertManagment/index.jsx';//广告管理
import { connect } from 'dva';
import { Route} from 'dva/router';
import PropTypes from 'prop-types';
import styles from './style.less';

import Detail from './detail.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list: [],
        expandedKeys: [],
        selectdata: '',
        isAddPermis: '',
        isRander: false,
        detailVisible: false,
        datas:''
    }
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({
      userId:userData.id,
      instCode: userData.instCode
    });

  }

  componentWillReceiveProps (nextProps) {

  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length != 0) {
      this.setState({
        selectdata: selectedKeys
      });
      this.props.saveId({id: selectedKeys[0]})
    } else {
       this.setState({
        selectdata: ''
      });
      this.props.saveId({id: ''})
    }

  }


  formart = (content) => {
    const indexData = [];//首页
    const startData = [];//启动项
    const shoppData = [];//商城
    if (content) {
        content.forEach((item, keys) => {
          if(item.page == '1'){
            indexData.push(item)
          }
          if(item.page == '2'){
            startData.push(item)
          }
          if(item.page == '3'){
            shoppData.push(item)
          }
            
        });
    }
    return { indexData,startData,shoppData };
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
    this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode})
  }


  //获取点击对应的id
  idData = (item) => {
    let id;
    const data = this.props.data;
    data.map((e) => {
      if(item == e.name){
        id = e.id
      }
    })
    return id;
  }
  //获取点击对应的code,id
  codeData = (item) => {
    let code;
    let ids;
    const data = this.props.data;
    data.map((e) => {
      if(item == e.name){
        code = e.code;
        ids = e.id;
      }
    })
    return [code,ids];
  }

  //广告位详情
  goEdit(id) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId:userData.id,
      id
    });

    this.setState({detailVisible:true});
  }


  queryChild(data){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryadQuery({
      userId:userData.id,
      page:1,
      size:10,
      spaceCode:data[0]
    });
    this.props.saveIds(data[1]);
    this.props.saveCodes(data[0]);
    this.context.router.history.push(`/${this.props.match.params.id}/app/advertisingManagment/advertManagment/${Math.random().toFixed(2)}`);
  }


  render() {
    const { children,data } = this.props;
    const content = data ? this.formart(data) : [];

    return (
      <div className={styles.organxBox}>
        <Col className={styles.header}>
          <div>广告位管理</div>
        </Col>
        <Row>
          <div style={{backgroundColor: 'rgb(255, 255, 255)', overflow: 'hidden',height:"81vh"}}>
            <Col span={5} className={styles.menubox}>
                <div>
                  <div style={{overflow: 'hidden'}}>
                    <table cellSpacing="0" className={styles.mytable} style={{ border: 'none'}}>
                        <tbody>
                            <tr style={{border: 'none',backgroundColor:'#989898',height:53}}>
                                <td style={{border: 'none',color:'#FFF',textAlign:"left",width:'30%'}}>
                                  <div style={{marginLeft:20}}>广告位管理</div>
                                </td>
                                {/* <td style={{border: 'none',textAlign:"right"}}>
                                    <Button type="primary" 
                                      onClick={this.sendShow.bind(this, 'detailVisible')} 
                                      style={{backgroundColor:'#989898',borderColor:'#FFF',marginRight: 20}}>新增广告位</Button>
                                </td> */}

                            </tr>
                        </tbody>
                    </table>
                  </div>
                  <div className={styles.menubox__tree}>
                    <List
                      header={<div>首页</div>}
                      bordered
                      dataSource={content.indexData.map((item)=>item.name)}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <div onClick={this.queryChild.bind(this,this.codeData(item))}>{item}</div>
                          <div onClick={this.goEdit.bind(this,this.idData(item))}><Icon type="file-search" theme="outlined" /></div>
                        </List.Item>
                      )}
                    />
                    <List
                        header={<div>启动项</div>}
                        bordered
                        dataSource={content.startData.map((item)=>item.name)}
                        renderItem={item => (
                          <List.Item>
                            <div onClick={this.queryChild.bind(this,this.codeData(item))}>{item}</div>
                            <div onClick={this.goEdit.bind(this,this.idData(item))}><Icon type="file-search" theme="outlined" /></div>
                          </List.Item>
                        )}
                      />                    
                    <List
                      header={<div>商城</div>}
                      bordered
                      dataSource={content.shoppData.map((item)=>item.name)}
                      renderItem={item => (
                        <List.Item>
                          <div onClick={this.queryChild.bind(this,this.codeData(item))}>{item}</div>
                          <div onClick={this.goEdit.bind(this,this.idData(item))}><Icon type="file-search" theme="outlined" /></div>
                        </List.Item>
                      )}
                    />
                  </div>
              </div>
            </Col>
            <Col span={19} className={styles.contentbox}>
                <Route path={`/:id/app/advertisingManagment/advertManagment`} component={AdvertManagment} />
                {children}
            </Col>
          </div>
        </Row>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)}/>
        </Drawer>
      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.advertisingManagment.list,
    detail: state.advertisingManagment.detail,
  }
}
function dispatchToProps(dispatch) {
  return {
    //广告位
    queryList(payload, params) {
      dispatch({
        type: 'advertisingManagment/serch',
        payload
      })
    },
    queryDetail(payload, params) {
      dispatch({
        type: 'advertisingManagment/detail',
        payload
      })
    },
    //广告
    queryadQuery(payload, params) {
      dispatch({
        type: 'advertisingManagment/adQuery',
        payload
      })
    },
    saveIds(payload = {}) {
      dispatch({
        type: 'advertisingManagment/saveIds',
        payload
      })
    },
    saveCodes(payload = {}) {
      dispatch({
        type: 'advertisingManagment/saveCodes',
        payload
      })
    },


  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
