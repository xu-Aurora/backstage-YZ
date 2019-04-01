import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {Tabs,Steps, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const Step = Steps.Step;

import OnePage from './onePage/index.jsx';
import TwoPage from './twoPage/index.jsx';
import ThreePage from './threePage/index.jsx';


const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.myRef=React.createRef();
        this.state = {
          current: 0,
          steps: [
            {
              title: '基本信息',
              content: <OnePage onRef={this.onRef.bind(this)} ref={this.myRef}/>,
            }, 
            {
              title: '收费标准',
              content: <TwoPage onRef={this.onRef.bind(this)} />,
            }, 
            {
              title: '详细信息',
              content: <ThreePage onRef={this.onRef.bind(this)} />,
            }
          ],
          visible: false
        };
    }

    next() {
      let goodsId = this.context.router.route.match.params.goodsId      
      if(this.state.current == 0) { //第一页信息存在本地
        let state = this.onePage.state
        let rex = this.firstRegx(state)
        if(rex) {
            let pic = []
            state.arrayImg.forEach(item=>{
              pic.push(item.ossKey)
            })
            let firstData = {
              name: state.name,//服务名称
              synopsis: state.synopsis,//服务介绍
              code: state.code,//服务编号
              serviceType: state.serviceType, //服务类型
              categoryId: state.categoryId,//服务分类
              categoryName: state.categoryName,//服务分类
              pic: pic,//服务图片
              chargeType: state.chargeType, //收费类型
              tableList: state.tableList, //一口价模式
              tableList1: state.tableList1,//预付款模式
              advanceType: state.advanceType, //预付类型

              isUseTicket: state.isUseTicket == 1 ? true : false,//允许使用粮票
              ticketProportion: state.ticketProportion, //收费类型
              serviceAreaType: state.serviceAreaType,//服务区域类型
              serviceArea: state.comIds, //服务区域
              serviceAppointment: state.serviceAppointment == 1 ? true : false, //服务预约
              serviceAscription: state.serviceAscription, //服务归属
              merchantId: state.merchantId, //商户
            }
            localStorage.setItem('firstData', JSON.stringify(firstData))
            const current = this.state.current + 1;
            this.setState({ current });
        }
      } else if(this.state.current == 1) {//第二页信息存在本地
        let state = this.twoPage.state
        let twoData = {
          type: state.type,//编辑类型
          tableList: state.tableList,//单条编辑
          tableList1: state.tableList1,//组合编辑
        }
        localStorage.setItem('twoData', JSON.stringify(twoData))
        const current = this.state.current + 1;
        this.setState({ current });
      }
      
    }
    //第一页信息校验
    firstRegx(state) {
      message.destroy()
      // if (!state.name) {
      //   message.error('服务名称不能为空')
      //   return false
      // }
      // if (!state.code) {
      //   message.error('服务编号不能为空')
      //   return false
      // }
      // if(!state.categoryId) {
      //   message.error('请选择服务分类')
      //   return false
      // }
      // if(!state.categoryName) {
      //   message.error('请选择服务分类')
      //   return false
      // }
      // if(!state.arrayImg.length) {
      //   message.error('服务图片不能为空')
      //   return false
      // }
      // if(!state.merchantId) {
      //   message.error('请选择商户')
      //   return false
      // }
      return true
    }
    prev() {
      if(this.state.current == 2){//第三页信息存在本地
        let state = this.threePage.state
        let threeData = {
          editorHtml: state.editorHtml, //服务详情
          editorHtml1: state.editorHtml1, //常见问题
        }
        localStorage.setItem('threeData', JSON.stringify(threeData))
      }
      const current = this.state.current - 1;
      this.setState({ current });
    }
    // 回传子组件
    onRef (param, ref) {
     this[param] = ref
    }
 
    save() {
      let userData = JSON.parse(localStorage.getItem('userDetail'));
      let firstData= JSON.parse(localStorage.getItem('firstData'));
      let twoData= JSON.parse(localStorage.getItem('twoData'));
      let threeData= JSON.parse(localStorage.getItem('threeData'));

      let serviceDetail = {
        commonProblem: threeData.editorHtml1,
        content: threeData.editorHtml
      }

      //冗余字段
      let redundancy = {
        categoryId: firstData.categoryId,//服务分类
        categoryName: firstData.categoryName,//服务分类
        serviceArea: firstData.serviceArea, //区域
        type: twoData.type //编辑类型
      }
      this.props.addService({
        params:{
            userId: userData.id,
            //商品
            name: firstData.name,//服务名称
            synopsis: firstData.synopsis,//服务介绍
            code: firstData.code,//服务编号
            serviceType: firstData.serviceType, //服务类型
            firstClassification: firstData.categoryId ?  firstData.categoryId.split(',')[0] : '', //一级分类
            twoClassification: firstData.categoryId ?  firstData.categoryId.split(',')[1] : '',//二级分类
            pic: firstData.pic.length ? firstData.pic.join() : '',//服务图片
            chargeType: firstData.chargeType, //收费类型
            serviceSkuRequests: firstData.chargeType == '1' ? firstData.tableList : firstData.tableList1,
            advanceType: firstData.advanceType, //预付类型
            isUseTicket: firstData.isUseTicket,//允许使用粮票
            ticketProportion: firstData.ticketProportion, //收费类型
            serviceAreaType: firstData.serviceAreaType, //服务区域类型
            serviceArea: firstData.serviceAreaType == '2' ? (firstData.serviceArea ?  this.setcomIds(firstData.serviceArea, this.onePage.props.areaList) : ''):'', //服务区域
            serviceAppointment: firstData.serviceAppointment, //服务预约
            serviceAscription: firstData.serviceAscription, //服务归属
            merchantId: firstData.merchantId, //商户
            serviceChargeStandardRequests: twoData.type == '1' ? twoData.tableList : undefined,
            serviceChargeStandardCombinationRequest:  twoData.type == '2' ? twoData.tableList1 : undefined,
            serviceDetail: 	serviceDetail,
            redundancy: redundancy
        }, 
        func: () => {
          localStorage.removeItem('firstData')
          localStorage.removeItem('twoData')
          localStorage.removeItem('threeData')
          message.destroy()
          message.success('操作成功',()=>{
            // this.context.router.history.push(`/${this.props.match.params.id}/app/goodsManage`)
          })
        }
      })

    }
    // 处理区域id
    setcomIds (data, area) {
      let self = this
      let ids = []
      if(data) {
        data.forEach((item)=>{
          if(item.split('-')[2] == 1) {
            area.forEach(ele => {
              if(ele.id == item.split('-')[0]) {
                ele.areas.forEach(element=>{
                  element.communitys.forEach(e=>{
                    ids.push(e.id)
                  })
                })
              }
            });
          } else if(item.split('-')[2] == 2) {
  
            area.forEach(ele => {
              ele.areas.forEach(element=>{
                if(element.id == item.split('-')[0]) {
                    element.communitys.forEach(e=>{
                      ids.push(e.id)
                    })
                }
              })
  
            });
          } else if(item.split('-')[2] == 3) {
            ids.push(item.split('-')[0])
          }
        })
      }
      return ids.join()
    }
    //保存并关闭
    quit() {

      

      // console.log(ReactDom.findDOMNode(this.myRef.current))

      // this.setState({
      //   visible: true
      // })
    }
    confirm() {
      //第一页信息存在本地
      let state = this.oneConfig.state
      let propsFormValue = this.oneConfig.props.form.getFieldsValue()
      let rex = this.firstRegx(state, propsFormValue)
      if(rex) {
        // 参数
        let parameter = [],parameterDetail = []
        state.parameterList.forEach((data)=>{
          if(propsFormValue[`${data.name}-${data.id}`]) {
            parameter.push({
              'key':data.name,
              'value':propsFormValue[`${data.name}-${data.id}`].label
            })
            parameterDetail.push({
              [`${data.name}-${data.id}`]: propsFormValue[`${data.name}-${data.id}`]              
            })
          }
        })
        let tableArray = this.oneConfig.tableSelf ? this.oneConfig.tableSelf.state.array: ''
        let totalStock = this.oneConfig.tableSelf ? this.oneConfig.tableSelf.state.totalStock: ''
        let code = this.oneConfig.tableSelf ? this.oneConfig.tableSelf.state.code: ''
        let pic = []
        state.arrayImg.forEach(item=>{
          pic.push(item.ossKey)
        })
        let specification = []
        if (state.first.name) {
          specification.push(state.first)
        }
        if (state.second.name) {
          specification.push(state.second)
        }
        if (state.third.name) {
          specification.push(state.third)
        }
        specification.forEach((data, i)=>{
            let list = []
            data.list.forEach((item,index)=>{
                list.push({
                    value: item,
                    id: index
                })
            })
            data.entries = list
        })
        // 规格表格 
        let firstPage = {
          name: state.name,
          introduction: state.introduction,
          categoryId: state.categoryId,
          categoryName: state.categoryName,
          goodGroupId: `|${state.goodGroupId.join('|')}|`,
          type: state.type,
          parameter: parameter,
          parameterIds: parameterDetail,
          arrayImg: state.arrayImg,
          pic: pic,
          specification: specification,
          configList: state.configList,
          headerLIst: state.headerLIst,
          first: state.first,
          firstConfigName: state.firstConfigName,
          firstStatus: state.firstStatus,
          firstVisible: state.firstVisible,
          second: state.second,
          secondConfigName: state.secondConfigName,
          secondStatus: state.secondStatus,
          secondVisible: state.secondVisible,
          third: state.third,
          thirdConfigName: state.thirdConfigName,
          thirdStatus: state.thirdStatus,
          thirdVisible: state.thirdVisible,
          tableArray: tableArray,
          totalStock: totalStock,
          code: code,
          way: state.way,
          freightSet: propsFormValue.freightSet,
          freight: state.freight,
          isDeliveryTime: propsFormValue.isDeliveryTime,
          arrivalDay: propsFormValue.arrivalDay,
          arrivalTime: propsFormValue.arrivalTime,
          isPick: propsFormValue.isPick,
          deliveryAreaType: propsFormValue.deliveryAreaType,
          comIds: state.comIds
        }
        localStorage.setItem('firstPage', JSON.stringify(firstPage))

        //第二页信息存在本地
        if(this.twoConfig){
          let state1 = this.twoConfig.state
          let rex = this.second(state1)
          if(rex) {
              localStorage.setItem('editorHtml', JSON.stringify(state1.editorHtml))
              if(this.threeConfig) {
                let state2 = this.threeConfig.state
                let propsFormValue = this.threeConfig.props.form.getFieldsValue()
                let threePage = {
                  assureList: state2.assureList,
                  labelCode: propsFormValue.labelCode,
                  initialSales: propsFormValue.initialSales,
                  calculate: propsFormValue.calculate,
                  status: propsFormValue.status,
                  supplierId: propsFormValue.supplierId,
                }
                localStorage.setItem('threePage', JSON.stringify(threePage))
              } else {
                this.context.router.history.push(`/${this.props.match.params.id}/app/home`)
              }
          }
        } else {
          if(this.threeConfig) {
            let state2 = this.threeConfig.state
            let propsFormValue = this.threeConfig.props.form.getFieldsValue()
            let threePage = {
              assureList: state2.assureList,
              labelCode: propsFormValue.labelCode,
              initialSales: propsFormValue.initialSales,
              calculate: propsFormValue.calculate,
              status: propsFormValue.status,
              supplierId: propsFormValue.supplierId,
            }
            localStorage.setItem('threePage', JSON.stringify(threePage))
          } else {
            this.context.router.history.push(`/${this.props.match.params.id}/app/home`)
          }
        }
          

      }
    }
    close() {
      this.context.router.history.push(`/${this.props.match.params.id}/app/home`)
    }
    render() {
      const { current } = this.state;
        return (
            <div className={styles.commonBox}>
                <div style={{background:'#fff'}}>
                    <Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: 24, color: '#999999'}}>
                        <TabPane tab={`新增服务`} key="1" style={{padding:'0 15px'}}>
                          <div>
                            <Steps current={current} style={{padding:'1% 7%'}}>
                              {this.state.steps.map(item => <Step key={item.title} title={item.title} />)}
                            </Steps>
                            <div className="steps-content">{this.state.steps[current].content}</div>
                            <div className="steps-action" style={{textAlign:'center'}}>
                              {
                                current === this.state.steps.length - 3
                                && <Button type="primary" ghost style={{marginRight:13}} 
                                  onClick={this.quit.bind(this)}
                                >保存并关闭</Button>
                              }
                              {
                                current > 0
                                && (
                                <Button style={{marginRight:13}} onClick={() => this.prev()}>
                                  上一步
                                </Button>
                                )
                              }
                              {
                                current < this.state.steps.length - 1
                                && <Button type="primary" onClick={() => this.next()}>下一步</Button>
                              }
                              {
                                current === this.state.steps.length - 1
                                && <Button type="primary" onClick={this.save.bind(this)}>完成</Button>
                              }
                              
                            </div>
                          </div>
                        </TabPane>
                    </Tabs>
                </div>
              <Modal
                  title="保存并关闭"
                  visible={this.state.visible}
                  onOk={this.confirm.bind(this)}
                  onCancel={this.close.bind(this)}
                  okText="保存并退出"
                  cancelText="直接退出"
                  >
                  <p style={{fontSize:14, textAlign: "center"}}>您正在退出商品发布，是否需要保存本次已经编辑的内容？</p>
                  <p style={{fontSize:14, textAlign: "center"}}>（保存后下次进入发布商品将读取当前已编辑内容）?</p>
              </Modal>
            </div>
        )
    }
}
App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state) {
    return {
    }
}
function dispatchToProps(dispatch) {
    return {
        addService(payload = {}) {
          dispatch({type: 'serviceRelease/addService', payload})
        },


        upadteGoods(payload = {}) {
          dispatch({type: 'goodsReleased/upadteGoods', payload})
        },
        setTableStatus(payload={}) {
            dispatch({type: 'goodsReleased/setTableStatus',payload})
        },
        queryList(payload, params) {
            dispatch({type: 'borrowingManagement/queryList', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);