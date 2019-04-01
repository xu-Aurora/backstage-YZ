import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/order/mng/selfRaisingList`, //自提点列表
    confirmReceiptPc: `/${Service.platformType}/order/mng/confirmReceiptPc`, //取件确认
    selfFetch: `/${Service.platformType}/self/raising/listAll`, //自提点
    detail: `/${Service.platformType}/order/mng/detail`, //详情
}

export const query = async(params) => post(API.query, params);
export const confirmReceiptPc = async(params) => post(API.confirmReceiptPc, params);
export const selfFetch = async(params) => post(API.selfFetch, params);
export const detail = async(params) => post(API.detail, params);
