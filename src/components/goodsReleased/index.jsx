import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Steps, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const Step = Steps.Step;

import BasicInfo from './basicInfo/index.jsx';
import DetailInfo from './detailInfo/index.jsx';
import ElseInfo from './elseInfo/index.jsx';


const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          current: 0,
          steps: [
            {
              title: '基本信息',
              content: <BasicInfo onRef={this.onRef.bind(this)} />,
            }, 
            {
              title: '详细信息',
              content: <DetailInfo onRef={this.onRef.bind(this)} />,
            }, 
            {
              title: '其他信息',
              content: <ElseInfo onRef={this.onRef.bind(this)} />,
            }
          ],
          visible: false
        };
    }

    next() {
      let goodsId = this.context.router.route.match.params.goodsId      
      if(this.state.current == 0) { //第一页信息存在本地
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
          if(goodsId) {
            localStorage.setItem('firstPage1', JSON.stringify(firstPage))
          } else {
            localStorage.setItem('firstPage', JSON.stringify(firstPage))
          }
          const current = this.state.current + 1;
          this.setState({ current });
        }
        this.props.setTableStatus(false)
        
      } else if(this.state.current == 1) {
        let state = this.twoConfig.state
        let rex = this.second(state)
        if(rex) {
          if(goodsId) {
            localStorage.setItem('editorHtml1', JSON.stringify(state.editorHtml))
          } else {
            localStorage.setItem('editorHtml', JSON.stringify(state.editorHtml))
          }
          const current = this.state.current + 1;
          this.setState({ current });
        }
      }
     
    }
    firstRegx(state, propsFormValue) {
      message.destroy()
      if (!state.name) {
        message.error('商品名称不能为空')
        return false
      }
      if(!state.categoryId) {
        message.error('请选择商品分类')
        return false
      }
      if(!state.categoryName) {
        message.error('请选择商品分类')
        return false
      }
      if(!state.goodGroupId) {
        message.error('请选择商品分组')
        return false
      }
      if(!state.type) {
        message.error('商品类型不能为空')
        return false
      }
      if(!state.arrayImg.length) {
        message.error('商品图片不能为空')
        return false
      }
      if(!this.oneConfig.tableSelf) {
          message.error('请设置规格')
          return false
      }
      if(this.oneConfig.tableSelf) {
        let state = this.oneConfig.tableSelf.state
        if (state.array) {
          for(let i=0; i < state.array.length; i++){
            if (!state.array[i].sellingPrice) {
              message.error(`第${i+1}条规格销售价不能为空`)
              return false
            }
            if (!state.array[i].ticket) {
              message.error(`第${i+1}条规格粮票抵用不能为空`)
              return false
            } else {
              if(Number(state.array[i].ticket) > Number(state.array[i].sellingPrice)) {
                message.error(`第${i+1}条规格粮票抵用必须小于等于销售价`)
                return false
              }
            }
            if (!state.array[i].costPrice) {
              message.error(`第${i+1}条规格成本价不能为空`)
              return false
            }
            if (!state.array[i].stock) {
              message.error(`第${i+1}条规格库存不能为空`)
              return false
            }
          }
        }
        if(!this.oneConfig.tableSelf.state.code) {
          message.error('商品编码不能为空')
          return false
        }
      }
      
      if(state.way == '1') {
        if(!propsFormValue.freightSet) {
          message.error('运费设置不能为空')
          return false
        }
      }
      return true
    }
    second(state) {
      if (!state.editorHtml) {
        message.destroy()
        message.error('详细信息不能为空')
        return false
      }
      return true
    }
    prev() {
      let goodsId = this.context.router.route.match.params.goodsId      
      //把第三页数据存储
      if(this.state.current == 2){
        let state = this.threeConfig.state
        let propsFormValue = this.threeConfig.props.form.getFieldsValue()
        let threePage = {
          assureList: state.assureList,
          labelCode: propsFormValue.labelCode,
          initialSales: propsFormValue.initialSales,
          calculate: propsFormValue.calculate,
          status: propsFormValue.status,
          supplierId: propsFormValue.supplierId,
        }
        if(goodsId) {
          localStorage.setItem('threePage1', JSON.stringify(threePage))
        } else {
          localStorage.setItem('threePage', JSON.stringify(threePage))
        }
      }
      const current = this.state.current - 1;
      this.setState({ current });
    }
    // 回传子组件
    onRef (param, ref) {
     this[param] = ref
    }
    // 区域id
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
    save() {
      let goodsId = this.context.router.route.match.params.goodsId
      let userData,firstPage,editorHtml    
      if(goodsId) {
        userData = JSON.parse(localStorage.getItem('userDetail'));
        firstPage = JSON.parse(localStorage.getItem('firstPage1'));
        editorHtml = JSON.parse(localStorage.getItem('editorHtml1'));
      } else {
        userData = JSON.parse(localStorage.getItem('userDetail'));
        firstPage = JSON.parse(localStorage.getItem('firstPage'));
        editorHtml = JSON.parse(localStorage.getItem('editorHtml'));
      }
     
      let props = this.oneConfig.props
      let skuDetail = {
        configList: firstPage.configList,
        headerLIst: firstPage.headerLIst,
        first: firstPage.first,
        firstConfigName: firstPage.firstConfigName,
        firstStatus: firstPage.firstStatus,
        firstVisible: firstPage.firstVisible,
        second: firstPage.second,
        secondConfigName: firstPage.secondConfigName,
        secondStatus: firstPage.secondStatus,
        secondVisible: firstPage.secondVisible,
        third: firstPage.third,
        thirdConfigName: firstPage.thirdConfigName,
        thirdStatus: firstPage.thirdStatus,
        thirdVisible: firstPage.thirdVisible,
        tableArray: firstPage.tableArray
      }
      let freightSetup = {
          name: '包邮',
          isDeliveryTime: firstPage.isDeliveryTime,
          arrivalDay: firstPage.arrivalDay,
          arrivalTime: firstPage.arrivalTime,
          isPick: firstPage.isPick,
      }
      let goodDetail = {
        content: editorHtml
      }
      //商品保证
      let labelName = []
      if(this.threeConfig) {
        this.threeConfig.state.assureList.forEach(item=>{
          if(item.checked) {
            labelName.push(item.name)
          }
        })
      }
      if(goodsId) {
        this.props.upadteGoods({
          params:{
              id: goodsId,
              userId: userData.id,
              //商品
              name: firstPage.name,
              introduction: firstPage.introduction,
              categoryId: firstPage.categoryId,
              categoryName: firstPage.categoryName,
              goodGroupId: firstPage.goodGroupId,
              type: firstPage.type,
              //参数
              parameter: JSON.stringify(firstPage.parameter),
              parameterIds:  JSON.stringify(firstPage.parameterIds),
              //图片
              pic: firstPage.pic.length ? firstPage.pic.join() : '',
              //规格
              specification: firstPage.specification.length ? JSON.stringify(firstPage.specification) : '',
              goodSkus: JSON.stringify(firstPage.tableArray),
              totalStock: firstPage.totalStock,
              code:  firstPage.code,
              specificationIds: JSON.stringify(skuDetail),
              //运费
              freightWay: firstPage.way,
              deliveryAreaType: firstPage.deliveryAreaType,
              freightSetup: freightSetup,
              deliveryAreaComId: firstPage.comIds ? this.setcomIds(firstPage.comIds, props.areaList) : '',
              scopeInfo: firstPage.comIds ? firstPage.comIds.join() : '',
              freightId: firstPage.way == 1 ? firstPage.freightSet: firstPage.freight,
              //详情
              goodDetail: goodDetail,
              //其他
              labelName: labelName.join(),
              labelCode: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().labelCode : '',
              initialSales: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().initialSales : '',
              calculate: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().calculate : '',
              status: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().status : '',
              supplierId: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().supplierId : '',
          }, 
          func: () => {
            localStorage.removeItem('firstPage1')
            localStorage.removeItem('editorHtml1')
            localStorage.removeItem('threePage1')
            localStorage.removeItem('goodsClassify')
            message.destroy()
            message.success('操作成功',()=>{
              this.context.router.history.push(`/${this.props.match.params.id}/app/goodsManage`)
            })
          }
        })
      } else {

      this.props.addGoods({
        params:{
            userId: userData.id,
            //商品
            name: firstPage.name,
            introduction: firstPage.introduction,
            categoryId: firstPage.categoryId,
            categoryName: firstPage.categoryName,
            goodGroupId: firstPage.goodGroupId,
            type: firstPage.type,
            //参数
            parameter: JSON.stringify(firstPage.parameter),
            parameterIds:  JSON.stringify(firstPage.parameterIds),
            //图片
            pic: firstPage.pic.length ? firstPage.pic.join() : '',
            //规格
            specification: firstPage.specification.length ? JSON.stringify(firstPage.specification) : '',
            goodSkus: JSON.stringify(firstPage.tableArray),
            totalStock: firstPage.totalStock,
            code:  firstPage.code,
            specificationIds: JSON.stringify(skuDetail),
            //运费
            freightWay: firstPage.way,
            deliveryAreaType: firstPage.deliveryAreaType,
            freightSetup: freightSetup,
            deliveryAreaComId: firstPage.comIds ? this.setcomIds(firstPage.comIds, props.areaList) : '',
            scopeInfo: firstPage.comIds ? firstPage.comIds.join() : '',
            freightId: firstPage.way == 1 ? firstPage.freightSet: firstPage.freight,
            //详情
            goodDetail: goodDetail,
            //其他
            labelName: labelName.join(),
            labelCode: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().labelCode : '',
            initialSales: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().initialSales : '',
            calculate: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().calculate : '',
            status: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().status : '',
            supplierId: this.threeConfig ? this.threeConfig.props.form.getFieldsValue().supplierId : '',
        }, 
        func: () => {
          localStorage.removeItem('firstPage')
          localStorage.removeItem('editorHtml')
          localStorage.removeItem('threePage')
          localStorage.removeItem('goodsClassify')
          message.destroy()
          message.success('操作成功',()=>{
            this.context.router.history.push(`/${this.props.match.params.id}/app/goodsManage`)
          })
        }
      })
              
      }
    }
    //保存并关闭
    quit() {
      this.setState({
        visible: true
      })
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
                        <TabPane tab={`新增商品`} key="1" style={{padding:'0 15px'}}>
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
        addGoods(payload = {}) {
          dispatch({type: 'goodsReleased/addGoods', payload})
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