import React, { Component} from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../layout/MainLayout';
import '../styles';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';

import Home from './home'; //首页
import { Route, Switch, Redirect} from 'dva/router';
import ResourceManagement from './resourceManagement/index.jsx';//资源管理
import Datadictionary from './datadictionary/index.jsx';//数据字典
import AdminManagement from './adminManagement/index.jsx'; //管理员管理
import RoleManage from './RoleManage/index.jsx';//角色管理
import UsersManagement from './usersManagement/index.jsx';//用户管理
import ActivityManagement from './activityManagement/index.jsx';//活动管理
import AdvertisingManagment from './advertisingManagment/index.jsx';//广告位管理

import MessageManagement from './messageManagement/index.jsx';// 消息管理
import MessagePush from './messagePush/index.jsx';//消息推送
import OrganizationManagement from './organizationManagement/index.jsx';//机构管理
import CarportManagement from './carportManagement/index.jsx';//车位管理
import HouseManagement from './houseManagement/index.jsx';//小区管理
import ProprietorManagement from './proprietorManagement/index.jsx';//业主管理
import PhoneManage from './phoneManage/index.jsx';//小区电话


{/* 公共服务 */}
import NewsManage from './newsManage/index.jsx';//消息管理
import ThresholdManage from './thresholdManage/index.jsx';//阀值管理
import ComputationManage from './computationManage/index.jsx';//计算规则管理
import IssueManagement from './issueManagement/index.jsx';//问题管理
import ModuleManagement from './moduleManagement/index.jsx';//模块管理
import ApiManagement from './apiManagement/index.jsx';//接口管理

{/* 网关系统 */}
import GatewayWater from './gatewayWater/index.jsx';//网关流水管理
import InstitutionManagement from './institutionManagement/index.jsx';//机构管理
import AgencyChannel from './agencyChannel/index.jsx';//机构通道管理
import ChannelAPI from './channelAPI/index.jsx';//通道API管理
import CallLog from './callLog/index.jsx';//调用日志管理

{/* 路由管理 */}
import RouterField from './routerField/index.jsx';//路由字段管理
import ChannelManagement from './channelManagement/index.jsx';//渠道管理
import RulesManagement from './rulesManagement/index.jsx';//规则管理

{/* 商品管理 */}
import GoodsReleased from './goodsReleased/index.jsx';//商品发布
import GoodsManage from './goodsManage/index.jsx';//商品管理
import GoodsComment from './goodsComment/index.jsx';//商品评论
import ProviderManage from './providerManage/index.jsx';//供应商管理

{/* 订单管理 */}
import AllOrder from './allOrder/index.jsx';//全部订单
import ShipmentManage from './shipmentManage/index.jsx';//发货管理
import AfterSaleManage from './afterSaleManage/index.jsx';//售后管理
import SelfFetchManage from './selfFetchManage/index.jsx';//自取管理
import AppointmentManage from './appointmentManage/index.jsx';//预约管理
import ServiceManage1 from './serviceManage1/index.jsx';//服务管理

{/* 商城设置 */}
import GroupManage from './groupManage/index.jsx';//分组管理
import DispatchSet from './dispatchSet/index.jsx';//配送设置
import FodderManage from './fodderManage/index.jsx';//素材管理
import SalesmanManage from './salesmanManage/index.jsx';//业务员管理


{/* 服务管理 */}
import ServiceManage from './serviceManage/index.jsx';//服务管理
import ServiceRelease from './serviceRelease/index.jsx';//服务发布

{/* 财务管理 */}
import InvoiceManage from './invoiceManage/index.jsx';//发票管理

{/* 卡券管理 */}
import TicketDetail from './ticketDetail/index.jsx';//发票明细
import TicketCancel from './ticketCancel/index.jsx';//卡券核销

import AdviceManage from './adviceManage'; //投诉建议
import AffairManage from './affairManage'; //报事订单
import ProprietorManage from './proprietorManage'; //业主审核
import PaymentManage from './paymentManage'; //缴费管理
import MemberManagerment from './memberManagerment'; //会员管理
import CouponManagerment from './couponManagerment'; //粮票订单

import NotFound from './notFound';//未匹配到页面

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      userData: ''
    }
  }
  componentWillMount () {
    // 判断是否登录
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
      userData
    })
    // if(!userData) {
    //   this.context.router.history.push(`/`)
    // }
  }
  componentWillReceiveProps(nextProps) {
            localStorage.removeItem('firstPage1')
            localStorage.removeItem('editorHtml1')
            localStorage.removeItem('threePage1')
  }

  render() {
    const { children, location } = this.props
    return (
      <LocaleProvider locale={zhCN}>
        {this.state.userData ? 
          (
        <MainLayout location={location}>
            <Switch>
            {/* 首页 */}
            <Route exact path={`/:id/app/home`} component={Home} />
            
            {/* 系统管理 */}
            <Route  path={`/:id/app/resourceManagement`} component={ResourceManagement} />{/* 资源管理 */}
            <Route exact path={`/:id/app/roleManage`} component={RoleManage} />{/* 角色管理 */}
            <Route exact path={`/:id/app/adminManagement`} component={AdminManagement} />{/* 管理员管理 */}
            <Route path={`/:id/app/datadictionary`} component={Datadictionary} />{/* 数据字典 */}

            {/* 物业设置 */}
            <Route exact path={`/:id/app/organizationManagement`} component={OrganizationManagement} />{/* 机构管理 */}
            <Route exact path={`/:id/app/carportManagement`} component={CarportManagement} />{/* 车位管理 */}
            <Route exact path={`/:id/app/houseManagement`} component={HouseManagement} />{/* 小区管理 */}
            <Route  path={`/:id/app/proprietorManagement`} component={ProprietorManagement} />{/* 业主管理 */}
            <Route  path={`/:id/app/proprietorManagement/:skipStatus`} component={ProprietorManagement} />{/* 业主管理 */}
            <Route exact path={`/:id/app/phoneManage`} component={PhoneManage} />{/* 小区电话 */}

            {/* 运营管理 */}
            <Route exact path={`/:id/app/usersManagement`} component={UsersManagement} />{/* 用户管理 */}
            <Route exact path={`/:id/app/activityManagement`} component={ActivityManagement} />{/* 活动管理 */}
            <Route  path={`/:id/app/advertisingManagment`} component={AdvertisingManagment} />{/* 广告位管理 */}

            <Route exact path={`/:id/app/messageManagement`} component={MessageManagement} />{/* 消息管理 */}
            <Route exact path={`/:id/app/messagePush`} component={MessagePush} />{/* 消息推送 */}

            {/* 公共服务 */}
            <Route exact path={`/:id/app/newsManage`} component={NewsManage} />{/* 消息管理 */}
            <Route exact path={`/:id/app/thresholdManage`} component={ThresholdManage} />{/* 阀值管理 */}
            <Route exact path={`/:id/app/computationManage`} component={ComputationManage} />{/* 计算规则管理 */}
            <Route exact path={`/:id/app/issueManagement`} component={IssueManagement} />{/* 问题管理 */}
            <Route exact path={`/:id/app/moduleManagement`} component={ModuleManagement} />{/* 模块管理 */}
            <Route exact path={`/:id/app/apiManagement`} component={ApiManagement} />{/* 接口管理 */}

            {/* 网关系统 */}
            <Route exact path={`/:id/app/gatewayWater`} component={GatewayWater} />{/* 网关流水管理 */}
            <Route exact path={`/:id/app/institutionManagement`} component={InstitutionManagement} />{/* 机构管理 */}
            <Route exact path={`/:id/app/agencyChannel`} component={AgencyChannel} />{/* 机构通道管理 */}
            <Route exact path={`/:id/app/channelAPI`} component={ChannelAPI} />{/* 通道API管理 */}
            <Route exact path={`/:id/app/callLog`} component={CallLog} />{/* 调用日志管理 */}

            {/* 路由管理 */}
            <Route exact path={`/:id/app/routerField`} component={RouterField} />{/* 路由字段管理 */}
            <Route exact path={`/:id/app/channelManagement`} component={ChannelManagement} />{/* 渠道管理 */}
            <Route exact path={`/:id/app/rulesManagement`} component={RulesManagement} />{/* 规则管理 */}

            {/* 商品管理 */}  
            <Route exact path={`/:id/app/goodsReleased`} component={GoodsReleased} />{/* 商品发布 */}
            <Route exact path={`/:id/app/goodsReleased/:goodsId`} component={GoodsReleased} />{/* 商品发布 */}

            <Route exact path={`/:id/app/goodsManage`} component={GoodsManage} />{/* 商品管理 */}
            <Route exact path={`/:id/app/goodsComment/:orderNo?`} component={GoodsComment} />{/* 商品评论 */}
            <Route exact path={`/:id/app/providerManage`} component={ProviderManage} />{/* 商户管理 */}
            <Route exact path={`/:id/app/providerManage`} component={ProviderManage} />{/* 供应商管理 */}
            {/* 服务管理 */}  
            <Route exact path={`/:id/app/serviceManage`} component={ServiceManage} />{/* 服务管理 */}
            <Route exact path={`/:id/app/serviceRelease`} component={ServiceRelease} />{/* 服务发布 */}
            

            {/* 订单管理 */}
            <Route exact path={`/:id/app/allOrder`} component={AllOrder} />{/* 全部订单 */}
            <Route exact path={`/:id/app/shipmentManage`} component={ShipmentManage} />{/* 发货管理 */}
            <Route exact path={`/:id/app/afterSaleManage`} component={AfterSaleManage} />{/* 售后管理 */}
            <Route exact path={`/:id/app/selfFetchManage`} component={SelfFetchManage} />{/* 自取管理 */}
            <Route exact path={`/:id/app/appointmentManage`} component={AppointmentManage} />{/* 预约管理 */}
            <Route exact path={`/:id/app/serviceManage1`} component={ServiceManage1} />{/* 服务管理 */}

            {/* 商城设置 */}
            <Route exact path={`/:id/app/groupManage`} component={GroupManage} />{/* 分组管理 */}
            <Route exact path={`/:id/app/dispatchSet`} component={DispatchSet} />{/* 配送设置 */}
            <Route exact path={`/:id/app/fodderManage`} component={FodderManage} />{/* 素材管理 */}
            <Route exact path={`/:id/app/salesmanManage`} component={SalesmanManage} />{/* 业务员管理 */}
            

            {/* 财务管理 */}
            <Route exact path={`/:id/app/invoiceManage`} component={InvoiceManage} />{/* 发票管理 */}

            {/* 卡券管理 */}
            <Route exact path={`/:id/app/ticketDetail`} component={TicketDetail} />{/* 发券明细 */}
            <Route exact path={`/:id/app/ticketCancel`} component={TicketCancel} />{/* 卡券核销 */}


            <Route exact path={`/:id/app/adviceManage`} component={AdviceManage} />
            <Route exact path={`/:id/app/affairManage`} component={AffairManage} />
            <Route exact path={`/:id/app/proprietorManage`} component={ProprietorManage} />
            <Route exact path={`/:id/app/paymentManage`} component={PaymentManage} />
            <Route exact path={`/:id/app/memberManagerment`} component={MemberManagerment} />
            <Route exact path={`/:id/app/couponManagerment`} component={CouponManagerment} />
            <Route path = "*"  render={()=>
                <Redirect exact path="*" to="/404" />
              }
            />
          </Switch>
        </MainLayout>

          ) : (
            <Switch>
              <Route path = "*" render={()=>
                <Redirect exact path="/" to="/login" />
              }/>
            </Switch>
          )
        }
         
      </LocaleProvider>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

App.propTypes = {
    // Injected by React Router
  children: PropTypes.node // eslint-disable-line
}

export default App;
