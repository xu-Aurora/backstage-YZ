import React, { Component } from 'react';
import {Button,Row,Form,Modal,Input,Select,DatePicker, message} from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Style from './detail.less';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      editVisible: false
    };
  }
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      goodId: this.props.argument.id,
      instCode: userData.instCode
    });
  }


  //点击启用/禁用弹出模态框
  isForbidden () {
    this.setState({visibleShow: true});
  }
  //商品上下架
  handleOk = (e) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    this.props.goodsBatchUpdate({
      params: {
          idsStr: this.props.argument.id, 
          type: this.state.val, 
          userId: userData.id, 
          instCode: userData.instCode
      },
      func: function() {
          self.setState({
              visibleShow: false
          })
          message.success('操作成功', function(){
            self.props.search('detailVisible')
          })
      }
    });

  }

  handleCancel (e) {
    this.setState({
      [e]: false,
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

  goDrawer(type){
    this.props.closeDetail(type);
  }

  editStatus(){
    let data =  this.props.argument
    if(data.status == '2') {
      this.setState({
        editVisible: true
      })
    } else {
      this.context.router.history.push(`/${this.props.match}/app/goodsReleased/${this.props.argument.id}`)
    }
  }

  visibleShow(val) {
    this.setState({
      visibleShow: true,
      val
    })
  }

  btnType(data) {
    let btn;
    if(data) {
      if(data.status == '1') {  //未上架
        btn = <Button type="primary" onClick={ this.visibleShow.bind(this,'2') }
        style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>商品上架</Button>
      }
      if(data.status == '2') {  //已上架
        btn = <Button type="primary" onClick={ this.visibleShow.bind(this,'1') }
        style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>商品下架</Button>
      }
      if(data.status == '3') {  //已下架
        btn = <Button type="primary" onClick={ this.visibleShow.bind(this,'2') }
        style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>商品上架</Button>
      }
    }
    return btn;
  }

  goEdit() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    this.props.goodsBatchUpdate({
      params: {
          idsStr: this.props.argument.id, 
          type: 1, 
          userId: userData.id, 
          instCode: userData.instCode
      },
      func: function() {
        self.context.router.history.push(`/${self.props.match}/app/goodsReleased/${self.props.argument.id}`)
      }
    });
  }
  render() {
    const {data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const content = data || {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.editStatus.bind(this)}>编辑服务</Button>
              <Button type="primary" onClick={this.goDrawer.bind(this,'amendPriceVisible')}>快速修改</Button>
              <Button type="primary" onClick={this.goDrawer.bind(this,'groupVisible')}
                style={{backgroundColor:'#F19000',borderColor:'#F19000'}}>分组修改</Button>

              { this.btnType(content) }

              <h4 style={{fontWeight: 600,marginTop:15}}>服务信息</h4>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>服务名称</td>
                    <td colSpan={3}>
                      <div>
                        <div>
                          {
                            content.pic ? content.pic.split(',').map(ele => {
                              return <img key={Math.random()} className={Style.goodImg} src={`/backstage/upload/download?uuid=${ele}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>
                            }) : null
                          }
                        </div>
                        <div style={{marginTop:10}}>
                          { content ? content.name : '' }
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>服务编号</td>
                    <td>
                      {getFieldDecorator('id', {
                          initialValue: content.id || null
                      })(<Input disabled/>)}
                    </td>
                    <td>服务分类</td>
                    <td>
                      {getFieldDecorator('id', {
                          initialValue: content.id || null
                      })(<Input disabled/>)}
                    </td>
                  </tr>
                  <tr>
                    <td>销售价格</td>
                    <td>
                      {getFieldDecorator('salesPriceRange', {
                          initialValue: content.salesPriceRange || null
                      })(<Input disabled/>)}
                    </td>
                    <td>抵用粮票</td>
                    <td>
                    {getFieldDecorator('ticketRange', {
                          initialValue: content.ticketRange || null
                      })(<Input disabled/>)}
                    </td>
                  </tr>
                  <tr>
                    <td>收费类型</td>
                    <td>
                      {getFieldDecorator('costPriceRange', {
                          initialValue: content.costPriceRange || null
                      })(<Input disabled/>)}
                    </td>
                    <td>定金类型</td>
                    <td>
                      {getFieldDecorator('totalStock', {
                          initialValue: content.totalStock || null
                      })(<Input disabled/>)}
                    </td>
                  </tr>
                  <tr>
                    <td>服务归属</td>
                    <td>
                      {getFieldDecorator('actualSales', {
                          initialValue: content.actualSales || null
                      })(<Input disabled/>)}
                    </td>
                    <td>所属商户</td>
                    <td>
                      {getFieldDecorator('initialSales', {
                          initialValue: content.initialSales || null
                      })(<Input disabled/>)}
                    </td>
                  </tr>
                  <tr>
                    <td>排序</td>
                    <td>
                      {getFieldDecorator('seq', {
                          initialValue: content.seq || null
                      })(<Input disabled/>)}
                    </td>
                    <td>是否推荐</td>
                    <td>
                      {getFieldDecorator('isHot', {
                          initialValue: `${content.isHot}` || null
                      })(
                          <Select disabled>
                              <option value="1">是</option>
                              <option value="2">不是</option>
                          </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>商品状态</td>
                    <td>
                      {getFieldDecorator('status', {
                          initialValue: content.status || null
                      })(
                        <Select disabled>
                          <option value="1">未上架</option>
                          <option value="2">已上架</option>
                          <option value="3">已下架</option>
                        </Select>
                      )}
                    </td>
                    <td>上下架时间</td>
                    <td>
                      {getFieldDecorator('upDownTime', {
                          initialValue: content.upDownTime ? Moment(content.upDownTime) : null
                      })(<DatePicker disabled style={{width: '100%'}}/>)}
                    </td>
                  </tr>
                  <tr>
                    <td>编辑人</td>
                    <td>
                      {getFieldDecorator('updateUserId', {
                          initialValue: content.updateUserId || null
                      })(<Input disabled/>)}
                    </td>
                    <td>发布时间</td>
                    <td>
                      {getFieldDecorator('createTime', {
                          initialValue: content.createTime ? Moment(content.createTime) : null
                      })(<DatePicker disabled style={{width: '100%'}}/>)}
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </Row>
            {/* <Row className='info'>
              <h4 style={{fontWeight: 600,marginBottom:10,marginTop:10}}>产品销量(件)</h4>
              <table cellSpacing="0" className={Style.mytable1}>
                <tbody>
                  <tr>
                    <td>本月</td><td>9月</td><td>8月</td><td>7月</td><td>6月</td><td>5月</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>103</td>
                    <td>291</td>
                    <td>232</td>
                    <td>215</td>
                    <td>164</td>
                  </tr>
                </tbody>
              </table>
            </Row> */}
          </Form>
        </div>

        {/* 商品上下架 提示框 */}
        <Modal
            title={ content.status == '1' || content.status == '3' ? '商品上架' : '商品下架' }
            visible={this.state.visibleShow}
            onOk={this.handleOk}
            onCancel={this.handleCancel.bind(this,'visibleShow')}
            >
            <p style={{fontSize:16}}>{ content.status == '1' || content.status == '3' ? '确定上架商品?' : '确定下架商品?' }</p>
        </Modal>
         {/* 商品编辑 提示框 */}
         <Modal
            title="编辑商品"
            visible={this.state.editVisible}
            onOk={this.goEdit.bind(this)}
            onCancel={this.handleCancel.bind(this,'editVisible')}
            okText="是"
            cancelText="否"
            >
            <p>商品仅可在下架状态进行编辑，是否需要下架该商品?</p>
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
    argument: state.serviceManage.saveSeslect,
    data: state.serviceManage.infoList,
  }
}

function dispatchToProps(dispatch) {
  return {
    getDetail(payload = {}) {
      dispatch({type: 'serviceManage/getDetail', payload})
    },
    


    goodsBatchUpdate(payload = {}) {  //商品上下架接口
      dispatch({type: 'goodsManage/goodsBatchUpdate', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
