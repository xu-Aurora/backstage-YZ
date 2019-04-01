import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/order/mng/listPc`, //查询
    delivery: `/${Service.platformType}/order/mng/delivery`, //发货
    detail: `/${Service.platformType}/order/mng/detail`, //详情
    closeOrder: `/${Service.platformType}/order/mng/closingOrder`, //关闭订单
    updateLogistics: `/${Service.platformType}/order/mng/updateLogistics`, //修改物流
    refundAudit: `/${Service.platformType}/order/mng/refundAudit`, //订单退款审核
    refundConfirm: `/${Service.platformType}/order/mng/refundConfirm`, //订单退款确认
    refundDetails: `/${Service.platformType}/order/mng/refundDetails`, //售后管理详情
    confirmReceiptPc: `/${Service.platformType}/order/mng/confirmReceiptPc`, //订单确认收货
    queryCom: `/${Service.platformType}/order/mng/findComNameAndNumberByAppointmentTime`, //小区
    queryTime: `/${Service.platformType}/order/mng/findAppointmentTime`, //预约时间
    refundInfo: `/${Service.platformType}/order/mng/serviceOrderSkuRefundInfo`, //服务退款信息
    serverRefund: `/${Service.platformType}/order/mng/serviceOrderRefund`, //服务退款
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const refundDetails = async(params) => post(API.refundDetails, params);
export const delivery = async(params) => post(API.delivery, params);
export const closeOrder = async(params) => post(API.closeOrder, params);
export const updateLogistics = async(params) => post(API.updateLogistics, params);
export const refundAudit = async(params) => post(API.refundAudit, params);
export const refundConfirm = async(params) => post(API.refundConfirm, params);
export const confirmReceiptPc = async(params) => post(API.confirmReceiptPc, params);
export const queryTime = async(params) => post(API.queryTime, params);
export const queryCom = async(params) => post(API.queryCom, params);
export const refundInfo = async(params) => post(API.refundInfo, params);
export const serverRefund = async(params) => post(API.serverRefund, params);
