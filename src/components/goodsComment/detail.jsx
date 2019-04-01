import React, { Component } from 'react';
import {Button,Row,Form,Modal,Card, Avatar,message} from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './detail.less';

const { Meta } = Card;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      title: '',
      value: ''
    };
  }


  componentWillMount() {
    console.log(231)
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id,
      instCode: userData.instCode
    });
  }


  //点击启用/禁用弹出模态框
  isForbidden () {
    this.setState({visibleShow: true});
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
          case "1":
            data.params = "隐藏"
            break;
          case "2":
          data.params = "正常"
            break;
          case "3":
          data.params = "精选"
            break;
        }
      }
    }
    return data;
  }
  save(index) {
    let title = ''
    if(index == '2') {
      title = '取消精选'
    } else if(index == '3'){
      title = '设为精选'
    }else if(index == '2'){
      title = '取消隐藏'
    }else if(index == '1'){
      title = '隐藏'
    }
    this.setState({
      title,
      value: index,
      visibleShow: true
    })
  }
  handelClck () {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this   
    this.props.setStatus({
      params:{
        id: self.props.argument.id,
        userId: userData.id,
        instCode: userData.instCode,
        status: self.state.value
      },
      func: function() {
        self.props.search('detailVisible')
        self.setState({
          visibleShow: false
        })
        message.success('操作成功')
      }
    });

  }
  render() {
    const {data} = this.props;
    const content = this.loop(data) || {};
    console.log(content.status)
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                content.status == 3 ? (
                  <Button type="primary" onClick={this.save.bind(this,'2')}>取消精选</Button>
                ):( <Button type="primary" onClick={this.save.bind(this,'3')}>设为精选</Button>)
              }
              {
                 content.status == 1 ? (
                  <Button type="primary" onClick={this.save.bind(this,'2')}>取消隐藏</Button>
                ):( <Button type="primary" onClick={this.save.bind(this,'1')}>隐藏</Button>)
              }
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>

                  <tr>
                    <td>订单编号</td>
                    <td colSpan={3}>{content.orderNo}</td>
                  </tr>
                  <tr>
                    <td>评论内容</td>
                    <td colSpan={3}>{content.content}</td>
                  </tr>
                  <tr>
                    <td>评论时间</td>
                    <td colSpan={3}>{content.createTime ? Moment(content.createTime).format("YYYY-MM-DD"): ''}</td>
                  </tr>
                  <tr>
                    <td>客户姓名</td>
                    <td colSpan={3}>{content.userName}</td>
                  </tr>
                  <tr>
                    <td>客户电话</td>
                    <td colSpan={3}>{content.userPhone}</td>
                  </tr>
                  <tr>
                    <td>商品信息</td>
                    <td colSpan={3}>
                      <Card bordered={false}>
                        <Meta
                          avatar={<Avatar src={`/backstage/upload/download?uuid=${content.goodPic}&viewFlag=1&fileType=jpg&filename=aa`}/>}
                          title={content.goodName}
                          description={content.skuName}
                        />
                      </Card>
                    </td>
                  </tr>
                  <tr>
                    <td>评论状态</td>
                    <td colSpan={3}>
                     {content.params}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </Form>
        </div>

        <Modal
            title={this.state.title}
            visible={this.state.visibleShow}
            onOk={this.handelClck.bind(this)}
            onCancel={this.handleCancel}
            >
            <p style={{fontSize:16}}>确定{this.state.title}?</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.goodsComment.saveSeslect,
    data: state.goodsComment.ItemDetail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'goodsComment/queryDetail', payload})
    },
    setStatus(payload = {}) {
      dispatch({type: 'goodsComment/setStatus', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
