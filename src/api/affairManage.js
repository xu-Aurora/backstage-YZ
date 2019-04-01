import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/maintain/order/list`, //查询
    detail: `/${Service.platformType}/maintain/order/detail`, //详情
    assignById: `/${Service.platformType}/maintain/order/assignById`, //派单
    completeById: `/${Service.platformType}/maintain/order/completeById`, //结单
    closeById: `/${Service.platformType}/maintain/order/closeById`, //关闭订单
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const assignById = async(params) => post(API.assignById, params);
export const completeExplain = async(params) => post(API.completeById, params);
export const closeById = async(params) => post(API.closeById, params);