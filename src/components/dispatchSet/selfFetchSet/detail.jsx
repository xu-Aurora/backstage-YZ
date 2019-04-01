import React, { Component } from 'react';
import {Button,Row,Form,Modal,message} from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Style from './style.less';
import { Map,Marker } from 'react-amap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      position: { //默认坐标
        longitude: this.props.data?this.props.data.longitude:'',
        latitude: this.props.data?this.props.data.latitude:''
      }
    };
  }
  showCenter(){
    this.setState({
      center: `${this.mapInstance.getCenter()}`
    });
  }

  mapEvents = () => {
    let self = this;
    return {
      created: (map) => { 
        this.mapInstance = map;
        this.showCenter();
      },
      moveend: () => { this.showCenter() }
    }
  }



  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id,
      instCode: userData.instCode
    });
  }


  handleOk = (e) => {
    let self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.updateStateId({
      params: {
        userId: userData.id,
        id: this.props.argument.id,
        status: this.props.data.status == '1' ? '2' : '1'
      },
      func: function(){
        message.success('操作成功!', 1.5, function() {
          self.props.search('detailVisible')
        });
      }

    })

  }
  handleCancel = (e) => {
    this.setState({
        visibleShow: false,
    });
  }


  loop = (data) => {
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "4":
            data[i] = "交易完成"
            break;
          case "5":
            data[i] = "交易关闭"
            break;
          case "6":
            data[i] = "已退款"
            break;
        }
      }
      if(i == "terminal"){
        switch (data[i]) {
          case "1":
            data[i] = "APP"
            break;
          case "2":
            data[i] = "微信公众号"
            break;
          case "3":
            data[i] = "支付宝生活号"
            break;
        }
      }
    }
    return data;
  }

  goEdit(){
    this.props.goEdit();
  }
  statusVal(status){
    let x = '未知状态';
    switch (status){
      case '0':
        x="禁用";
        break;
      case '1':
        x="启用";
        break;
    }
    return x;
  }


  render() {
    const {data} = this.props;
    const content = data ? data : {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)} >编辑</Button>
              <Button type="primary" 
                onClick={ () => this.setState({visibleShow:true}) } style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>
                {content.status == '1' ? '禁用' : '启用'}</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>自提点编号</td>
                    <td>{ content.code }</td>
                    <td>自提点名称</td>
                    <td>{ content.name }</td>
                  </tr>
                  <tr>
                    <td>自提点地址</td>
                    <td colSpan={3}>{ content.provinceName }{ content.cityName }{ content.countyName }{ content.address } </td>
                  </tr>
                  <tr>
                    <td>负责人</td>
                    <td>{ content.principal }</td>
                    <td>负责人电话</td>
                    <td>{ content.principalPhone }</td>
                  </tr>
                  <tr>
                    <td>自提点电话</td>
                    <td>{ content.phone }</td>
                    <td>服务时间</td>
                    <td>{ content.serverTime }</td>
                  </tr>
                  <tr>
                    <td>编辑人</td>
                    <td>{ content.updateUserName }</td>
                    <td>编辑时间</td>
                    <td>{ content.updateTime?Moment(content.updateTime).format("YYYY-MM-DD HH:mm:ss"):'' }</td>
                  </tr>
                  <tr>
                    <td>自提点坐标</td>
                    <td>{ content.latitude }-{ content.longitude }</td>
                    <td>自提点状态</td>
                    <td>{ this.statusVal(content.status) }</td>
                  </tr>
                </tbody>
              </table>
              <div className={Style.map}>
                <Map events={this.mapEvents()} center={this.state.position}>
                  <Marker position={this.state.position} />
                </Map>
              </div>
            </Row>
          </Form>
        </div>

        <Modal
            title={content.status == '1' ? '禁用自提点' : '启用自提点'}
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定{content.status == '1' ? '禁用自提点' : '启用自提点'}?</p>
        </Modal>
      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    argument: state.selfFetchSet.saveSeslect,
    data: state.selfFetchSet.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'selfFetchSet/detail', payload})
    },
    updateStateId(payload = {}) {
      dispatch({type: 'selfFetchSet/updateState', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
