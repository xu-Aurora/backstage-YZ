import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,Row,Form,Card,Select,Icon,message  } from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;

let salesmanDatas = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visibleShow: false,
      salesmanDatas: [],
      disabled: false
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      orderNo: this.props.argument.serviceOrderNo,
    });
    this.props.querySalesman({
      userId: userData.id, 
      instCode: userData.instCode,
      // comId: this.props.argument.comId
      comId: 75
    });
  }

  handleSel(val){
    salesmanDatas.push({
      salesmanName: val.split('-')[0],
      id: val.split('-')[1],
      comNames: val.split('-')[2],
    })
    this.setState({
      salesmanDatas
    })
    if(salesmanDatas.length > 2) {
      this.setState({
        disabled: true
      })
    }else{
      this.setState({
        disabled: false
      })
    }
  }

  close(i){
    const result = salesmanDatas.filter((item,index) => 
      i != index
    )
    this.setState({
      salesmanDatas: result
    })
    if(result.length > 2) {
      this.setState({
        disabled: true
      })
    }else{
      this.setState({
        disabled: false
      })
    }
  }


  confirm(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
      if(JSON.stringify(this.state.salesmanDatas) == '[]'){
        message.warning('请选择服务人员');
        return 
      }
  
      if(this.state.requestStatus){
        this.setState({requestStatus: false},() => {
          this.props.allotOrder({
            params: {
              userId: userData.id,
              operationName: userData.name,
              serviceOrderNo: this.props.argument.serviceOrderNo,
              salesmanJson: JSON.stringify(this.state.salesmanDatas)
            },
            func:  () => {
              message.success('操作成功', 1.5, () => {
                this.props.search('allotOrderVisible');
              });
            }
          })
        })
      }



  }



  render() {
    const { data,salesmanData } = this.props;
    const content = data ? data : {};
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            {
              this.state.requestStatus ? <Button type="primary" onClick={ this.confirm.bind(this) }>确定</Button> :
              <Button type="primary">确定</Button>
            }
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
                  选择服务人员
                </div>
                <div>服务人员 : &nbsp;
                  <Select 
                    showSearch
                    disabled={ this.state.disabled }
                    onSelect={ this.handleSel.bind(this) }
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="请选择" style={{width:'60%'}}>
                    {
                      salesmanData ? salesmanData.map((item) => 
                        <Option value={`${item.salesmanName}-${item.id}-${item.comNames}`} key={item.id}>{ `${item.salesmanName}(${item.id})` }</Option>
                      ) : ( <Option value={' '}>暂无数据</Option> )
                    }
                    
                  </Select>
                </div>
                <div className={Style.severNo3} style={{marginTop:20}}>
                  {
                    this.state.salesmanDatas.map((item,index) => (
                      <div style={{background:'#F0F0F0',marginRight:15,paddingRight:15}} key={index}>
                        <div>
                          <img src="" alt=""/>
                        </div>
                        <div>
                          <p>{ item.instName }（id：{ item.id }）</p>
                          <p>{ item.comNames }</p>
                          <div onClick={this.close.bind(this,index)}><Icon type="close" /></div>
                        </div>
                      </div>
                    ))
                  }



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
    salesmanData: state.appointmentManage.salesmanData,
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {   //详情
      dispatch({type: 'appointmentManage/serchDetail', payload})
    },
    querySalesman(payload = {}) {   //业务员
      dispatch({type: 'appointmentManage/salesman', payload})
    },
    allotOrder(payload = {}) {  //分配订单
      dispatch({type: 'appointmentManage/allotOrder', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
