import React, { Component } from 'react';
import {Button,Form,Row,Modal,message} from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Style from './detail.less';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      delVisibleShow: false,
      status: ''
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id,
      instCode: userData.instCode
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

  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }
  show(params, data) {
    let caption = ''
    if(data == 'end') {
      caption = '禁用'
    } else if(data == 'start') {
      caption = '启用'
    }
    this.setState({
      caption, 
      [params]: true
    })
  }
  handleCancel(params) {
    this.setState({
      [params]: false
    })
  }

  // 启用禁用
  handelClck() { 
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this;
    self.setState({
      visibleShow: false
    })
    self.props.update({
      params:{
        userId: userData.id, 
        id: this.props.argument.id,
        status: this.props.data.status == '1' ? '2' : '1',
      },
      func:function() {
        message.success('操作成功!', 1.5, function() {
          self.props.search('detailVisible')
        });
      }
    });
  }
  formart = (content) => {
    const data = [];
    content.forEach((item, keys) => {
        data.push({
            keys: keys+1,
            code: item.code,
            name: item.name,
            actualSales: item.actualSales,
            initialSales: item.initialSales,
        })
    });
    return data
}
  render() {
    const { data } = this.props
    const content = data ? data : {}
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <Button onClick={ () => this.setState({visibleShow: true}) }>{ content.status == '1' ? '禁用' : '启用' }</Button>
   
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>业务员编号</td>
                    <td>
                      { content.instCode }
                    </td>
                    <td>业务员名称</td>
                    <td>
                      { content.salesmanName }
                    </td>
                  </tr>
                  <tr>
                    <td>手机号码</td>
                    <td>
                      { content.salesmanPhone }
                    </td>
                    <td>登录账号</td>
                    <td>
                      { content.salesmanPhone }
                    </td>
                  </tr>
                  <tr>
                    <td>业务员类型</td>
                    <td>
                      { content.salesmanType == '1' ? '服务人员' : '配送人员' }
                    </td>
                    <td>所属机构</td>
                    <td>
                      { content.instName }
                    </td>
                  </tr>
                  <tr>
                    <td>服务区域</td>
                    <td colSpan={3}>
                      { content.comNames }
                    </td>
                  </tr>
                  <tr>
                    <td>状态</td>
                    <td>
                      { content.status == '1' ? '启用' : '禁用' }
                    </td>
                    <td>编辑时间</td>
                    <td>{content.updateTime ? Moment(content.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                  </tr>

                </tbody>
              </table>
            </Row>
        </div>


        {/* 启用禁用 提示框 */}
        <Modal
            title={ content.status == '1' ? '禁用' : '启用' }
            visible={this.state.visibleShow}
            onOk={this.handelClck.bind(this)}
            onCancel={ () => this.setState({visibleShow: false}) }
            >
            <p style={{fontSize:16}}>确定{ content.status == '1' ? '禁用' : '启用' }该业务员?</p>
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
    argument: state.salesmanManage.saveSeslect,
    data: state.salesmanManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'salesmanManage/queryDetail', payload})
    },    
    update(payload = {}) {
      dispatch({type: 'salesmanManage/update', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
