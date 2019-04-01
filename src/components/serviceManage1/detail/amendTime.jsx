import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Form,Card,DatePicker,Select,message } from 'antd';
import {connect} from 'dva';
import Moment from 'moment';
import Style from './index.less';

const Option = Select.Option;

function disabledDate(current) {
  return   current > Moment().add('days',31) || current <= Moment().startOf('day');
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
      date: '',
      freightTimeInfo: '',
      val: ''
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      orderNo: this.props.argument.serviceOrderNo,
    });

  }
  //选择日期
  handleDate(a,date){
    this.setState({
      date
    })
  }
  //选择时间段
  handleTime(val,opt){
    this.setState({
      val,
      freightTimeInfo: opt.props.children
    })
  }

  confirm(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if(!this.state.date){
      message.warning('请选择日期');
      return
    }
    if(this.state.val == ''){
      message.warning('请选择时段');
      return
    }


    if(this.state.requestStatus){
      this.setState({requestStatus: false},() => {
        this.props.updateTime({
          params: {
            userId: userData.id,
            serviceOrderNo: this.props.argument.serviceOrderNo,
            operationName: userData.name,
            freightTimeInfo: `${this.state.date} ${this.state.freightTimeInfo}`
          },
          func:  () => {
            message.success('操作成功', 1.5, () => {
              this.props.search('amendTimeVisible');
            });
          }
        })
      })
    }


  }


  render() {
    const { data } = this.props;
    const content = data ? data : {};

    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Button type="primary" onClick={ this.confirm.bind(this) }>确定</Button>
            <Button onClick={ () => this.props.close() }>取消</Button>
            <Row>
              <Card className="cards" style={{marginTop:20}}>
                <div className={Style.nav}>
                  服务信息
                </div>
                
                <p>预约时间 : { content.freightTimeInfo }</p>
                <p>客户信息 : { content.receiptName }&nbsp;&nbsp;{ content.receiptPhone }&nbsp;&nbsp;{ content.address }</p>
                <p>服务名称 : { content.name }</p>
                <div className={Style.severNo}>
                  <div>服务项目 :&nbsp;
                    <div>
                      {
                        content.serviceOrderSkuInfoResponses ? content.serviceOrderSkuInfoResponses.map((item,index) => {
                          return (
                            <p key={index}>{item.skuname}*{item.skunum}</p>
                          )
                        }) : ''
                      }
                    </div>
                  </div>
                </div>

                <p>买家留言 : { content.message }</p>

              </Card>

              <Card className="cards">
                <div className={Style.nav}>
                  更改时间
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>选择日期 : &nbsp;
                    <DatePicker format="YYYY-MM-DD" onChange={ this.handleDate.bind(this) } disabledDate={disabledDate}/>
                  </div>
                  <div>选择时段 : &nbsp;
                    <Select placeholder="请选择" onChange={ this.handleTime.bind(this) } style={{width:170}}>
                      <Option value="1">上午 8:00-11:00</Option>
                      <Option value="2">中午 11:00-14:00</Option>
                      <Option value="3">下午 14:00-17:00</Option>
                      <Option value="4">晚上 17:00-20:00</Option>
                    </Select>
                  </div>

                </div>


              </Card>

            </Row>
        </div>


      </div>
    )
  }
}
App.contextTypes = {
  router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
  return {
    argument: state.appointmentManage.saveSeslect,
    data: state.appointmentManage.detail,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'appointmentManage/serchDetail', payload})
    },
    updateTime(payload = {}) {
      dispatch({type: 'appointmentManage/updateTime', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
