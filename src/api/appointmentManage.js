import { post} from '../util/xFetch';
import Service from '../service';

const API = {
    queryList: `/${Service.platformType}/order/mng/getServiceOrderInfoList`, //列表查询
    detail: `/${Service.platformType}/order/mng/getServiceOrderInfoById`, //详情
    orderRecord: `/${Service.platformType}/maintain/order/getServiceOrderLogById`, //详情->订单记录
    queryTime: `/${Service.platformType}/order/mng/findAppointmentTimeByDates`, //获取预约时间
    updateTime: `/${Service.platformType}/order/mng/updateServiceOrderTime`, //修改预约时间
    allotOrder: `/${Service.platformType}/order/mng/distributionServiceOrder`, //分配订单
    cancelOrder: `/${Service.platformType}/order/mng/cancelServiceOrder`, //取消订单
    queryCom: `/${Service.platformType}/order/mng/findComNameAndNumber`, //获取小区数据
    salesman: `/${Service.platformType}/order/mng/serviceOrderChoiceSalesman`, //业务员数据
}

export const queryList = async(params) => post(API.queryList, params);
export const detail = async(params) => post(API.detail, params);
export const orderRecord = async(params) => post(API.orderRecord, params);
export const queryTime = async(params) => post(API.queryTime, params);
export const updateTime = async(params) => post(API.updateTime, params);
export const allotOrder = async(params) => post(API.allotOrder, params);
export const cancelOrder = async(params) => post(API.cancelOrder, params);
export const queryCom = async(params) => post(API.queryCom, params);
export const salesman = async(params) => post(API.salesman, params);
